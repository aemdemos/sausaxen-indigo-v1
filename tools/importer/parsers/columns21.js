/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that holds the image columns
  const grid = element.querySelector('.mokobara-days-three > .aem-Grid');
  if (!grid) return;

  // Get all the direct column elements with class 'imagevideo' (in order)
  const columns = Array.from(grid.children).filter(col => col.classList.contains('imagevideo'));

  // For each column, extract the .carousel-image block (which holds both desktop and mobile images)
  const cells = columns.map(col => {
    const carousel = col.querySelector('.carousel-image');
    return carousel || col;
  });

  // Structure: header row with one cell, then one row with all columns
  const tableRows = [
    ['Columns (columns21)'],
    cells
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
