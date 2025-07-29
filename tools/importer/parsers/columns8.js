/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the columns row
  const rowDiv = element.querySelector('.row');
  if (!rowDiv) return;
  // Get all direct children with the column class
  const colDivs = Array.from(rowDiv.children).filter(col => col.classList.contains('col-12'));
  if (!colDivs.length) return;
  // Collect the entire content of each column, referencing the nodes
  const colCells = colDivs.map(col => {
    // If the column is empty, return an empty string
    if (!col.hasChildNodes()) return '';
    // Get all child nodes (to preserve structure)
    const nodes = Array.from(col.childNodes);
    return nodes.length === 1 ? nodes[0] : nodes;
  });
  // Header row: exactly one cell with the block name
  const cells = [
    ['Columns (columns8)'], // header row with a single cell
    colCells                // content row, one cell per column
  ];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
