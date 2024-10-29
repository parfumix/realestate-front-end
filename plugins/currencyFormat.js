export default defineNuxtPlugin(() => {
  const formatCurrency = (value, locale = 'de-DE', currency = 'EUR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return {
    provide: {
      currencyFormat: formatCurrency,
    },
  };
});
