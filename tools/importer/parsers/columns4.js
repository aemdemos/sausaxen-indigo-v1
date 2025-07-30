/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row containing columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate children of .row as columns
  const columns = Array.from(row.children);

  // Build the columns cell array by referencing each column's direct children
  // Preserves all content within each column (icons, headings, paragraphs, links)
  const colCells = columns.map(col => {
    // We want to reference all direct children of the column (no clones)
    const colContent = [];
    Array.from(col.childNodes).forEach(child => {
      // Only include elements and non-empty text nodes
      if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
        colContent.push(child);
      }
    });
    // If only one element, return it directly for cleaner tables
    if (colContent.length === 1) return colContent[0];
    // If multiple, return as an array
    return colContent;
  });

  // The first row is the header row per spec
  const headerRow = ['Columns (columns4)'];
  // The second row is the actual columns content
  const bodyRow = colCells;

  const cells = [headerRow, bodyRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
