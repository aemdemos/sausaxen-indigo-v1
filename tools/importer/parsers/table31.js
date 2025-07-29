/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  const container = element.querySelector('.container-mob') || element;
  // Get the first table in the container
  const table = container.querySelector('table');
  // Collect paragraphs after the table for later inclusion (only direct siblings)
  const paragraphs = [];
  let next = table.nextElementSibling;
  while (next && (next.tagName === 'P' || next.tagName === 'BR')) {
    paragraphs.push(next);
    next = next.nextElementSibling;
  }

  // Build cells: header row with block name, next row with table, then row with text/paragraphs if present
  const cells = [];
  const headerRow = ['Table (table31)'];
  cells.push(headerRow);
  // Second row: the table itself
  cells.push([table]);
  // Third row: combine paragraphs into a single cell if present (optional)
  if (paragraphs.length > 0) {
    cells.push([paragraphs]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
