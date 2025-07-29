/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;
  // For each .innerwrap-stats, get the element itself
  const stats = Array.from(row.querySelectorAll('.innerwrap-stats'));

  // Header row: exactly one column, with the exact block name
  const headerRow = ['Columns (columns13)'];
  // Content row: one cell per stat
  const contentRow = stats;

  const cells = [
    headerRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
