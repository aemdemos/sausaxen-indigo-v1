/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get absolute URL for images
  function getAbsoluteUrl(src) {
    const a = document.createElement('a');
    a.href = src;
    return a.href;
  }

  // Find the container for the columns
  const row = element.querySelector('.row');
  const accordion = element.querySelector('.ig-footer-accordion');

  // Collect Columns:
  // 1: 'Get to Know Us'
  // 2: 'Services'
  // 3: 'Quick links'
  // 4: Social/Download/Awards
  let col1 = null, col2 = null, col3 = null, col4 = null;
  if (accordion) {
    const sitemapCols = accordion.querySelectorAll('.col-12.col-md-3.ig-acc-sitemap');
    if (sitemapCols.length > 0) col1 = sitemapCols[0];
    if (sitemapCols.length > 1) col2 = sitemapCols[1];
    if (sitemapCols.length > 2) col3 = sitemapCols[2];
  }
  if (row) {
    col4 = row.querySelector('.col-lg-3.social-downloads');
  }

  // Fallback: If any missing, fill with empty divs for structure
  function safeCol(col) { return col || document.createElement('div'); }

  // Table header as in the example (must match exactly)
  const headerRow = ['Columns (columns7)'];
  // Table content row: each column in its own cell
  const contentRow = [safeCol(col1), safeCol(col2), safeCol(col3), safeCol(col4)];

  // Create and insert table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
