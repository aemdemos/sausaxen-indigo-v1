/* global WebImporter */
export default function parse(element, { document }) {
  // Extract visible left-side controls: from, swap, to
  const from = element.querySelector('.from-destination');
  const swap = Array.from(element.children).find(el => el.classList && el.classList.contains('icon-swap'));
  const to = element.querySelector('.to-destination');

  // Extract right-side controls: date, currency, search button
  const date = element.querySelector('.date-container');
  const currency = element.querySelector('.widget-container__search-form__currency');
  const searchBtn = element.querySelector('button.custom-button');

  // Compose first row left column: all left controls in visual order
  const col1left = [];
  if (from) col1left.push(from);
  if (swap) col1left.push(swap);
  if (to) col1left.push(to);

  // Compose first row right column: all right controls in visual order
  const col1right = [];
  if (date) col1right.push(date);
  if (currency) col1right.push(currency);
  if (searchBtn) col1right.push(searchBtn);

  // Only create a second row if either side has content (following the example, usually 2 rows)
  const row2 = ['', ''];

  const headerRow = ['Columns (columns15)'];
  const row1 = [col1left, col1right];
  const cells = [headerRow, row1, row2];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
