/**
 * The function `getPricesWithPercent` calculates prices with added percentages based on a given base
 * price and an array of percentages.
 * @param {number} basePrice - The `basePrice` parameter is the original price of a product or service
 * before any discounts or markups are applied.
 * @param {number[]} percents - An array of percentage values that you want to apply to the base price.
 */
export const getPricesWithPercent = (basePrice: number, percents: number[]) =>
  percents.map(percent => {
    const decimalPercent = parseFloat(percent.toString()) / 100;

    return basePrice + (basePrice * decimalPercent);
  });