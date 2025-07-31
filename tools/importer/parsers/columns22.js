/* global WebImporter */
export default function parse(element, { document }) {
  // Locate main row of the footer
  const row = element.querySelector('.row');
  // Columns for the links are in the ig-footer-accordion
  const accordion = element.querySelector('.ig-footer-accordion');
  let linkCols = [];
  if (accordion) {
    linkCols = Array.from(accordion.querySelectorAll('.col-12.col-md-3.ig-acc-sitemap'));
    // Only take the first three that have actual content
    linkCols = linkCols.filter(col => col.textContent.trim().length > 0 && col.querySelector('ul.ig-footer-site-list')).slice(0, 3);
  }

  // Social/download/awards column (rightmost)
  let socialCol = null;
  if (row) {
    socialCol = row.querySelector('.col-lg-3.social-downloads');
  }

  // Reference existing elements directly; if missing, use empty div
  const col1 = linkCols[0] || document.createElement('div');
  const col2 = linkCols[1] || document.createElement('div');
  const col3 = linkCols[2] || document.createElement('div');
  const col4 = socialCol || document.createElement('div');

  // Header row: one cell, string exactly matching the example
  const headerRow = ['Columns (columns22)'];
  // Content row: four cells, each for one column
  const columnsRow = [col1, col2, col3, col4];

  const cells = [
    headerRow,
    columnsRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
