/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Gather all direct child divs with the innerwrap-stats class (each column)
  const columns = Array.from(row.children).filter(
    (child) => child.classList.contains('innerwrap-stats')
  );
  if (columns.length === 0) return;

  // Header row: only one cell, as per the markdown example
  const headerRow = ['Columns (columns5)'];
  // Data row: one cell per column
  const dataRow = columns;

  // Create the table with exactly one cell in header row, and N cells in data row
  const table = WebImporter.DOMUtils.createTable([headerRow, dataRow], document);
  // Set colspan for the header cell if there are multiple columns
  if (columns.length > 1) {
    const th = table.querySelector('th');
    if (th) th.setAttribute('colspan', columns.length);
  }

  element.replaceWith(table);
}
