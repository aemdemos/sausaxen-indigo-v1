/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all images that are direct or indirect descendants
  const imgs = Array.from(element.querySelectorAll('img'));

  // Create header row: a single cell (array with only one string)
  const headerRow = ['Columns (columns31)'];
  // Content row: as many columns as there are images
  const contentRow = imgs.length ? imgs : [''];

  // Table structure: header row is single cell, content row is as many cells as needed
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
