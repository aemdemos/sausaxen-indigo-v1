/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row as a single cell array
  const headerRow = ['Columns (columns7)'];

  // Find the accordion for the columns
  const accordion = element.querySelector('.ig-footer-accordion');
  let columns = [];
  if (accordion) {
    // Get all relevant .col-12.col-md-3.ig-acc-sitemap columns (up to 3 non-empty)
    const allCols = Array.from(
      accordion.querySelectorAll('.col-12.col-md-3.ig-acc-sitemap:not(.commonMarginSeparator)')
    );
    for (let i = 0; i < allCols.length && columns.length < 3; i++) {
      const col = allCols[i];
      // Consider columns with a button and a list as valid
      if (col.querySelector('button, ul')) {
        columns.push(col);
      }
    }
  }
  // Pad columns to 3 if needed
  while (columns.length < 3) {
    columns.push(document.createElement('div'));
  }
  // Content row as an array of 3 columns
  const contentRow = columns;
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
