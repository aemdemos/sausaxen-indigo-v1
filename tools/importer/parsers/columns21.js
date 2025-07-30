/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block container
  const block = element.querySelector('.mokobara-days-three');
  if (!block) return;
  
  const grid = block.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all columns
  const columns = Array.from(grid.children);
  const cells = columns.map(col => {
    const carousel = col.querySelector('.carousel-image');
    return carousel || col;
  });

  // Build the correct table structure: header row is a single cell, data row has three columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns21)'],
    cells
  ], document);

  element.replaceWith(table);
}
