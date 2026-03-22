// src/services/empireFlippersApi.js
// All API calls go through YOUR proxy backend — key never touches the APK

import config from '../config';

// ---------------------------------------------------------------
// IMPORTANT: Replace this with your deployed backend URL.
// Free options: Railway (railway.app), Render (render.com), Fly.io
// Local dev:    http://localhost:3000
// ---------------------------------------------------------------
const PROXY_URL = 'https://YOUR_BACKEND_URL';  // e.g. https://flipfinder-api.up.railway.app

export const buildAffiliateLink = (listingUrl = '') => {
  const ref = config.ef.affiliateRef;
  if (listingUrl.startsWith('http')) {
    const sep = listingUrl.includes('?') ? '&' : '?';
    return `${listingUrl}${sep}referrer=${ref}`;
  }
  return `https://empireflippers.com/marketplace/?referrer=${ref}`;
};

export const buildListingAffiliateUrl = (listingNumber) =>
  `https://empireflippers.com/listing/${listingNumber}/?referrer=${config.ef.affiliateRef}`;

export const fetchListings = async ({
  page = 1, perPage = 20, businessType = null,
  minPrice = null, maxPrice = null, sortBy = 'list_price_desc',
} = {}) => {
  const params = new URLSearchParams({ page, per_page: perPage, sort_by: sortBy });
  if (businessType && businessType !== 'all') params.append('monetization', businessType);
  if (minPrice) params.append('listing_price_from', minPrice);
  if (maxPrice) params.append('listing_price_to', maxPrice);

  const response = await fetch(`${PROXY_URL}/listings?${params.toString()}`);
  if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
  const data = await response.json();
  return {
    listings: data.listings || data.data || [],
    total: data.total || 0,
    page: data.page || page,
    totalPages: data.total_pages || Math.ceil((data.total || 0) / perPage),
  };
};

export const fetchListingById = async (id) => {
  const response = await fetch(`${PROXY_URL}/listings/${id}`);
  if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
  const data = await response.json();
  return data.listing || data;
};

export const fetchFeaturedListings = async (limit = 5) => {
  const result = await fetchListings({ perPage: limit, sortBy: 'list_price_desc' });
  return result.listings;
};

export const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
};

export const formatMultiple = (price, monthlyProfit) => {
  if (!price || !monthlyProfit) return 'N/A';
  return `${Math.round(price / monthlyProfit)}x`;
};

export const getTypeColor = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('amazon') || t.includes('fba')) return '#FF9500';
  if (t.includes('shopify')) return '#96BF48';
  if (t.includes('saas')) return '#A855F7';
  if (t.includes('content')) return '#22C55E';
  if (t.includes('agency')) return '#F59E0B';
  if (t.includes('drop')) return '#FF6B6B';
  return '#00D4FF';
};
