/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main table inside the current element
  const mainTable = element.querySelector('table');

  // Collect the table and all following <p> siblings (for additional info)
  const contentParts = [mainTable];
  let sibling = mainTable ? mainTable.nextElementSibling : null;
  while (sibling && (sibling.tagName.toLowerCase() === 'p' || sibling.tagName.toLowerCase() === 'br')) {
    contentParts.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  // Build the cells for the Table (table33) block
  const cells = [
    ['Table (table33)'],
    [contentParts]
  ];

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
