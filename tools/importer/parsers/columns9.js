/* global WebImporter */
export default function parse(element, { document }) {
  // Select all direct children that are column candidates
  // We want to keep the column structure, but ensure the header row is a single cell
  // The main columns are:
  // - .cmp-custom-drop-down (first instance) -- One Way
  // - .widget-container__filter-bar__pax-selection
  // - .widget-container__filter-bar__specailFare
  // - .widget-container__filter-bar__currency-desktop

  const columns = [];
  const oneWay = element.querySelector('.cmp-custom-drop-down');
  if (oneWay) columns.push(oneWay);

  const pax = element.querySelector('.widget-container__filter-bar__pax-selection');
  if (pax) columns.push(pax);

  const specialFare = element.querySelector('.widget-container__filter-bar__specailFare');
  if (specialFare) columns.push(specialFare);

  const currency = element.querySelector('.widget-container__filter-bar__currency-desktop');
  if (currency) columns.push(currency);

  // The header row must be a single cell array:
  const cells = [
    ['Columns (columns9)'],
    columns
  ];
  
  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
