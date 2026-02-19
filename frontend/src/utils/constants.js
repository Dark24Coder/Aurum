// src/utils/constants.js

export const ADMIN_EMAIL = "admin@bjbusiness.com";
export const APP_VERSION = "1.0.0-PROD";
export const CAUTION_AMOUNT = 10000;
export const COMMISSION_RATE = 0.01; 

export const SHIPPING_RATES = {
  AIR_NORMAL: 9500,
  AIR_EXPRESS: 15000,
  SEA_CBM: 265000
};

export const COUNTRIES_DATA = [
  { name: "Allemagne", code: "+49" },
  { name: "Autre", code: "+" },
  { name: "Belgique", code: "+32" },
  { name: "Bénin", code: "+229" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Cameroun", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Chine", code: "+86" },
  { name: "Congo", code: "+242" },
  { name: "Côte d'Ivoire", code: "+225" },
  { name: "États-Unis", code: "+1" },
  { name: "France", code: "+33" },
  { name: "Gabon", code: "+241" },
  { name: "Ghana", code: "+233" },
  { name: "Mali", code: "+223" },
  { name: "Niger", code: "+227" },
  { name: "Nigéria", code: "+234" },
  { name: "RDC", code: "+243" },
  { name: "Royaume-Uni", code: "+44" },
  { name: "Sénégal", code: "+221" },
  { name: "Togo", code: "+228" },
].sort((a, b) => a.name.localeCompare(b.name));

export const generateId = (prefix) => `${prefix}-${Math.floor(Math.random() * 100000)}`;

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount);
};