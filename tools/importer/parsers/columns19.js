/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell, as per the requirement
  const headerRow = ['Columns (columns19)'];

  // Extract the flex container containing all wrapper-flight-blocks
  const flexContainer = element.querySelector('.stats-ig-wrapper .d-flex');
  let columnCells = [];

  if (flexContainer) {
    // Place each direct column child in its own cell for the columns row
    columnCells = Array.from(flexContainer.children);
  } else {
    // Fallback: just place the whole element if structure changes
    columnCells = [element];
  }

  // Build the block: header, then stats in columns
  const rows = [
    headerRow, // first row: a single cell (header)
    columnCells // second row: as many columns as needed
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
