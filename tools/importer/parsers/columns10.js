/* global WebImporter */
export default function parse(element, { document }) {
  // The example expects:
  // - Header row: one cell with 'Columns (columns10)'
  // - Next row: one array with all columns content as separate cells

  // Get all direct children of the block
  const children = Array.from(element.children);

  // According to the HTML, these are:
  // 0: Trip type dropdown
  // 1: Pax selection dropdown
  // 2: Special Fare
  // 3: Promocode (empty)
  // 4: Currency dropdown

  // The screenshot shows only four columns, skipping the empty promocode at index 3
  const columnContent = [children[0], children[1], children[2], children[4]].map(col => col || document.createElement('div'));

  // Build table
  const cells = [
    ['Columns (columns10)'], // header row, single column
    columnContent            // content row, multiple columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}