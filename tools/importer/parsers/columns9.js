/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Columns (columns9)'];

  // Get all direct children of the element
  const children = Array.from(element.children);
  // Group: first three children together, last child separate
  const leftGroup = children.slice(0, 3);
  const rightGroup = children[3] || '';

  // Each row in the table is an array
  const tableCells = [
    headerRow,
    [leftGroup, rightGroup]
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
