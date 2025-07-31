/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Get the direct children columns
  const cols = Array.from(row.children);

  // For each column, gather all direct children (fragment or array of nodes)
  const cells = cols.map((col) => {
    // Remove empty text nodes
    const contentNodes = Array.from(col.childNodes).filter(
      (node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== ''
    );
    // If there's only one child, use it directly, else return an array
    if (contentNodes.length === 1) {
      return contentNodes[0];
    } else {
      return contentNodes;
    }
  });

  // Build the table: header is single cell, second row has N columns
  const tableData = [
    ['Columns (columns4)'],
    cells
  ];

  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
