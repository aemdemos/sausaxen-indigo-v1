/* global WebImporter */
export default function parse(element, { document }) {
  // Left cell: from-destination + to-destination
  const leftCell = document.createDocumentFragment();
  const fromDest = element.querySelector('.from-destination');
  if (fromDest) leftCell.appendChild(fromDest);
  const toDest = element.querySelector('.to-destination');
  if (toDest) leftCell.appendChild(toDest);

  // Right cell: date-container + currency container + search button
  const rightCell = document.createDocumentFragment();
  const dateContainer = element.querySelector('.date-container');
  if (dateContainer) rightCell.appendChild(dateContainer);
  const currencyContainer = element.querySelector('.widget-container__search-form__currency');
  if (currencyContainer) rightCell.appendChild(currencyContainer);
  const searchButton = element.querySelector('button.custom-button');
  if (searchButton) rightCell.appendChild(searchButton);

  // Table header as per the example
  const cells = [
    ['Columns (columns15)'],
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
