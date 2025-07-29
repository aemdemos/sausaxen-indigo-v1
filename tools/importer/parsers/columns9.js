/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row that contains the columns (direct child with flex)
  const flexRow = element.querySelector('.d-flex');
  let columnsRow = [];
  if (flexRow) {
    // Each column is a .wrapper-flight-blocks div
    columnsRow = Array.from(flexRow.children).filter(child => child.classList.contains('wrapper-flight-blocks'));
  }
  // Edge case: fallback to any .wrapper-flight-blocks found
  if (columnsRow.length === 0) {
    columnsRow = Array.from(element.querySelectorAll('.wrapper-flight-blocks'));
  }
  // Defensive: if still nothing found, try to extract content from .stats-no spans
  if (columnsRow.length === 0) {
    columnsRow = Array.from(element.querySelectorAll('.stats-no')).map(span => span.parentElement);
  }

  // Header row: always a single cell, per requirements and example
  const headerRow = ['Columns (columns9)'];

  // Build table cells array: first row is header (1 column), second row is the actual columns
  const tableCells = [
    headerRow,
    columnsRow
  ];
  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
