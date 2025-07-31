/* global WebImporter */
export default function parse(element, { document }) {
  // Find the stats container that holds the columns
  const statsWrapper = element.querySelector('.stats-ig-wrapper');
  if (!statsWrapper) return;
  const statsRow = statsWrapper.querySelector('.d-flex');
  if (!statsRow) return;
  // Get all direct column children
  const columns = Array.from(statsRow.children).filter(c => c.classList.contains('wrapper-flight-blocks'));

  // If there are no columns, exit
  if (columns.length === 0) return;

  // The header row should be a single cell
  const headerRow = ['Columns (columns19)'];
  // The content row should have as many cells as columns
  const contentRow = columns;

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
