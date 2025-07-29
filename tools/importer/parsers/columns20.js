/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .aem-Grid that contains the three columns
  const grid = element.querySelector('.mokobara-days-three .aem-Grid');
  if (!grid) return;

  // Get the direct column containers (div.imagevideo)
  const columns = Array.from(grid.querySelectorAll(':scope > .imagevideo'));
  const numCols = columns.length;

  // Header row: first cell is the block name, others are empty, total cells = numCols
  const headerRow = ['Columns (columns20)', ...Array(numCols - 1).fill('')];

  // Content row: each column's element
  const contentRow = columns.map(col => col);

  // Build and insert table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
