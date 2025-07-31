/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the stats
  const row = element.querySelector('.row');
  if (!row) return;
  // Collect all columns (each stat)
  const columns = Array.from(row.querySelectorAll(':scope > .innerwrap-stats'));
  if (columns.length === 0) return;

  // Header row: exactly one cell, per the requirements
  const headerRow = ['Columns (columns12)'];
  const contentRow = columns;
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
