/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container for the stats block
  const container = element.querySelector('.container.d-none.d-md-block');
  if (!container) return;
  const statsWrapper = container.querySelector('.stats-wrapper');
  if (!statsWrapper) return;
  const row = statsWrapper.querySelector('.row');
  if (!row) return;

  // Get all the stat columns (should be 5 for columns5)
  const statCols = Array.from(row.children).filter(child => child.classList.contains('innerwrap-stats'));
  if (!statCols.length) return;

  // Assemble contents for each column (reference existing elements)
  const contentRow = statCols.map(col => {
    // We keep the whole .innerwrap-stats element as the cell content, so icons and text included
    return col;
  });

  // The header row must be a single column/cell, matching ['Columns (columns5)']
  const headerRow = ['Columns (columns5)'];

  // The table is assembled as: header row (one cell), then one row with five cells
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
