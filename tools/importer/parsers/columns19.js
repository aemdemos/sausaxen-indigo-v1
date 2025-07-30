/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row with columns
  const statsWrapper = element.querySelector('.stats-ig-wrapper > .d-flex');
  let columns = [];
  if (statsWrapper) {
    const columnBlocks = Array.from(statsWrapper.children);
    columns = columnBlocks.map((col) => {
      // Reference existing icon and text nodes
      const icon = col.querySelector('i');
      const stats = col.querySelector('.stats-no');
      const cellContent = [];
      if (icon) cellContent.push(icon);
      if (icon && stats) cellContent.push(document.createElement('br'));
      if (stats) cellContent.push(stats);
      return cellContent.length === 1 ? cellContent[0] : cellContent;
    });
  }
  // Ensure at least one column is present to avoid invalid table
  if (columns.length === 0) columns = [''];
  // The header row must be a single cell/column
  const headerRow = ['Columns (columns19)'];
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
