/* global WebImporter */
export default function parse(element, { document }) {
  // 2x2 structure after header: [from][to] [dates+currency][search button]
  // Extract the 'from' section
  const fromSection = element.querySelector('.from-destination');
  // Extract the 'to' section
  const toSection = element.querySelector('.to-destination');
  // Extract the swap icon (usually between from and to)
  const swapIcon = element.querySelector('.icon-swap');
  // Extract the dates/currency section
  const dates = element.querySelector('.date-container');
  const currency = element.querySelector('.widget-container__search-form__currency');
  // Extract the search button
  const searchBtn = element.querySelector('button.custom-button');

  // Compose cell for left/top: FROM input with swap icon after if present
  const fromCell = document.createElement('div');
  if (fromSection) fromCell.appendChild(fromSection);
  // Compose cell for right/top: TO input, with swap icon before if present (for visual)
  const toCell = document.createElement('div');
  if (swapIcon) toCell.appendChild(swapIcon);
  if (toSection) toCell.appendChild(toSection);

  // Compose cell for left/bottom: dates + currency
  const dateCurrencyCell = document.createElement('div');
  if (dates) dateCurrencyCell.appendChild(dates);
  if (currency) dateCurrencyCell.appendChild(currency);

  // Compose cell for right/bottom: search button
  const searchCell = document.createElement('div');
  if (searchBtn) searchCell.appendChild(searchBtn);

  // Assemble table as per the 2x2 structure after the header
  const cells = [
    ['Columns (columns15)'],
    [fromCell, toCell],
    [dateCurrencyCell, searchCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
