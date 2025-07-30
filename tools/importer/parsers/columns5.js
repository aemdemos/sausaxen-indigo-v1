/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the stat columns
  const statsRow = element.querySelector('.stats-wrapper .row');
  if (!statsRow) return;

  // Extract all direct child .innerwrap-stats elements (each is a column)
  const statDivs = Array.from(statsRow.querySelectorAll(':scope > .innerwrap-stats'));
  if (statDivs.length === 0) return;

  // Table header: single cell as per spec
  const headerRow = ['Columns (columns5)'];
  // Content row: one cell per column
  const contentRow = statDivs;

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
