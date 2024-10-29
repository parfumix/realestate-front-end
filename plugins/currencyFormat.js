export default defineNuxtPlugin(() => {
  const formatCurrency = (value, locale = 'fr-FR', currency = 'EUR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2, // Ensure two decimal places
      maximumFractionDigits: 2,
    }).format(value);
  };

  return {
    provide: {
      currencyFormat: formatCurrency,
    },
  };
});
