import config from '../config';

var PROXY_URL = 'https://flipfinder-backend-production.up.railway.app';

export function buildAffiliateLink(listingUrl) {
  var ref = config.ef.affiliateRef;
  if (!listingUrl) {
    return 'https://empireflippers.com/marketplace/?referrer=' + ref;
  }
  if (listingUrl.indexOf('http') === 0) {
    var sep = listingUrl.indexOf('?') >= 0 ? '&' : '?';
    return listingUrl + sep + 'referrer=' + ref;
  }
  return 'https://empireflippers.com/marketplace/?referrer=' + ref;
}

export function buildListingAffiliateUrl(listingNumber) {
  return 'https://empireflippers.com/listing/' + listingNumber + '/?referrer=' + config.ef.affiliateRef;
}

export async function fetchListings(options) {
  var page = (options && options.page) || 1;
  var perPage = (options && options.perPage) || 20;
  var businessType = (options && options.businessType) || null;
  var sortBy = (options && options.sortBy) || 'list_price_desc';

  var params = 'page=' + page + '&per_page=' + perPage + '&sort_by=' + sortBy;
  if (businessType && businessType !== 'all') {
    params = params + '&monetization=' + encodeURIComponent(businessType);
  }

  try {
    var response = await fetch(PROXY_URL + '/listings?' + params);
    if (!response.ok) {
      throw new Error('API Error: ' + response.status);
    }
    var data = await response.json();
    return {
      listings: data.listings || data.data || [],
      total: data.total || 0,
      page: data.page || page,
      totalPages: data.total_pages || Math.ceil((data.total || 0) / perPage),
    };
  } catch (error) {
    console.error('fetchListings error:', error);
    return { listings: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function fetchListingById(id) {
  try {
    var response = await fetch(PROXY_URL + '/listings/' + id);
    if (!response.ok) {
      throw new Error('API Error: ' + response.status);
    }
    var data = await response.json();
    return data.listing || data;
  } catch (error) {
    console.error('fetchListingById error:', error);
    return null;
  }
}

export async function fetchFeaturedListings(limit) {
  var result = await fetchListings({ perPage: limit || 5, sortBy: 'list_price_desc' });
  return result.listings;
}

export function formatCurrency(amount) {
  if (!amount) return 'N/A';
  if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(2) + 'M';
  if (amount >= 1000) return '$' + Math.round(amount / 1000) + 'K';
  return '$' + amount.toString();
}

export function formatMultiple(price, monthlyProfit) {
  if (!price || !monthlyProfit) return 'N/A';
  return Math.round(price / monthlyProfit) + 'x';
}

export function getTypeColor(type) {
  var t = (type || '').toLowerCase();
  if (t.indexOf('amazon') >= 0 || t.indexOf('fba') >= 0) return '#FF9500';
  if (t.indexOf('shopify') >= 0) return '#96BF48';
  if (t.indexOf('saas') >= 0) return '#A855F7';
  if (t.indexOf('content') >= 0) return '#22C55E';
  if (t.indexOf('agency') >= 0) return '#F59E0B';
  if (t.indexOf('drop') >= 0) return '#FF6B6B';
  return '#00D4FF';
}
