export default defineNuxtPlugin(() => {
    const formatCurrency = (value, locale = 'en-US', currency = 'USD') => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      }).format(value);
    }
  
    return {
      provide: {
        currencyFormat: formatCurrency
      }
    }
  });
  