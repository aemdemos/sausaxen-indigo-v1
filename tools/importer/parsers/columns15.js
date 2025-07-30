/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find immediate child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get the main columns in order
  const from = getDirectChildByClass(element, 'from-destination');
  const swapIcon = element.querySelector(':scope > i.icon-swap');
  const to = getDirectChildByClass(element, 'to-destination');
  const dateContainer = getDirectChildByClass(element, 'date-container');
  const currencyDiv = element.querySelector(':scope > .widget-container__search-form__currency');
  const searchBtn = element.querySelector(':scope > button.custom-button');

  // Compose the columns row as a single array (second row)
  const columnsRow = [from, swapIcon, to, dateContainer, currencyDiv, searchBtn].filter(Boolean);

  // Table data: first row is single header cell, second row is N columns
  const tableData = [
    ['Columns (columns15)'],
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
