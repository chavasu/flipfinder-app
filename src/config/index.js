// src/config/index.js
const config = {
  ef: {
    apiKey: process.env.EF_API_KEY || '',
    baseUrl: process.env.EF_API_BASE_URL || 'https://api.empireflippers.com/api/v1',
    affiliateRef: 'IW20AKOTKCMFADUS',
    affiliateBaseUrl: 'https://empireflippers.com',
    marketplaceUrl: 'https://empireflippers.com/marketplace/?referrer=IW20AKOTKCMFADUS',
  },
  emailProvider: 'mailchimp',
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY || '',
    listId: process.env.MAILCHIMP_LIST_ID || '',
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
  },
  convertkit: {
    apiKey: process.env.CONVERTKIT_API_KEY || '',
    formId: process.env.CONVERTKIT_FORM_ID || '',
  },
  businessTypes: [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'amazon_fba', label: 'Amazon FBA', icon: 'shopping-bag', efFilter: 'Amazon FBA' },
    { id: 'shopify', label: 'Shopify', icon: 'shopping-cart', efFilter: 'Shopify' },
    { id: 'ecommerce', label: 'eCommerce', icon: 'package', efFilter: 'eCommerce' },
    { id: 'dropshipping', label: 'Dropshipping', icon: 'truck', efFilter: 'Dropshipping' },
    { id: 'saas', label: 'SaaS', icon: 'cpu', efFilter: 'SaaS' },
    { id: 'content', label: 'Content Site', icon: 'file-text', efFilter: 'Content' },
    { id: 'agency', label: 'Agency', icon: 'briefcase', efFilter: 'Agency' },
  ],
  sortOptions: [
    { id: 'list_price_desc', label: 'Price: High to Low' },
    { id: 'list_price_asc', label: 'Price: Low to High' },
    { id: 'monthly_net_profit_desc', label: 'Profit: High to Low' },
    { id: 'created_at_desc', label: 'Newest First' },
  ],
};

export default config;
