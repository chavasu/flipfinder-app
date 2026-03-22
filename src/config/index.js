var config = {
  ef: {
    apiKey: '',
    baseUrl: 'https://api.empireflippers.com/api/v1',
    affiliateRef: 'IW20AKOTKCMFADUS',
    affiliateBaseUrl: 'https://empireflippers.com',
    marketplaceUrl: 'https://empireflippers.com/marketplace/?referrer=IW20AKOTKCMFADUS',
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
};

export default config;
