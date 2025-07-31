/* global WebImporter */
export default function parse(element, { document }) {
  // The Columns (columns31) block expects:
  // - The header row is a single cell: ['Columns (columns31)']
  // - The following row(s) have as many columns as the layout (here, 2 for desktop and mobile image blocks)

  // Find the .carousel-image container holding both columns
  const container = element.querySelector('.carousel-image');
  if (!container) return;
  // Get both .cmp-image blocks (desktop, mobile)
  const columns = Array.from(container.querySelectorAll(':scope > div.cmp-image'));
  // Defensive: if there are no columns, don't replace
  if (!columns.length) return;

  // Each cell is one of these image blocks (preserving all structure)
  const row = columns;

  // Assemble the table rows
  const cells = [
    ['Columns (columns31)'], // header row: MUST be a single cell
    row                      // content row: as many cells as needed
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
