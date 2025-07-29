/* global WebImporter */
export default function parse(element, { document }) {
  // Find the stats-wrapper and the row of stats
  const statsWrapper = element.querySelector('.stats-wrapper');
  if (!statsWrapper) return;
  const row = statsWrapper.querySelector('.row');
  if (!row) return;

  // Find all immediate children with class 'innerwrap-stats'
  const statColumns = Array.from(row.querySelectorAll(':scope > .innerwrap-stats'));

  // Build contents of each column (icon and text)
  const cellsRow = statColumns.map(col => {
    // Use the actual div.innerwrap-stats as the column cell content
    return col;
  });

  // The first row is a single cell (header)
  const headerRow = ['Columns (columns6)'];

  // Create the table array: header row, followed by a single row of N columns
  const tableData = [headerRow, cellsRow];
  
  // Create block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
