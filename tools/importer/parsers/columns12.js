/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate .innerwrap-stats children (columns)
  const columns = Array.from(row.querySelectorAll(':scope > .innerwrap-stats'));
  if (!columns.length) return;

  // Build the table: header is a single cell (one column), second row has N columns
  const cells = [
    ['Columns (columns12)'], // header row, single cell
    columns                 // content row, as many columns as found
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
