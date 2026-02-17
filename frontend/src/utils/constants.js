export const APP_VERSION = "1.0.0-PROD";
export const CAUTION_AMOUNT = 10000;
export const COMMISSION_RATE = 0.01; 

export const SHIPPING_RATES = {
  AIR_NORMAL: 9500,
  AIR_EXPRESS: 15000,
  SEA_CBM: 265000
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount);
};