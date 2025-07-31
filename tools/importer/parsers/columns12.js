/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the row with the stat blocks
  const row = container.querySelector('.stats-wrapper .row');
  if (!row) return;

  // Get all immediate stat items as columns
  const columns = Array.from(row.children).filter(child => child.classList.contains('innerwrap-stats'));
  if (columns.length === 0) return;

  // Per requirements, header row should be a single cell
  const cells = [
    ['Columns (columns12)'],
    columns
  ];

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}