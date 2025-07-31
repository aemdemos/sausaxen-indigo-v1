/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract nav columns from .ig-footer-accordion
  function getFooterColumns(accordion) {
    return Array.from(accordion.querySelectorAll(':scope > .col-12.col-md-3.ig-acc-sitemap'))
      .filter(col => col.querySelector('button') && col.querySelector('ul'));
  }
  // Helper: Extract visible text from a button, ignoring icons
  function getButtonText(btn) {
    let text = '';
    btn.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        text += node.textContent.trim();
      }
    });
    return text;
  }
  // 1. Find .row and .ig-footer-accordion
  const row = element.querySelector('.row');
  const accordion = element.querySelector('.ig-footer-accordion');
  // 2. Extract navigation columns (Get to Know Us, Services, Quick Links)
  let navColumns = [];
  if (accordion) {
    navColumns = getFooterColumns(accordion).map(col => {
      const frag = document.createDocumentFragment();
      const headingBtn = col.querySelector('button');
      if (headingBtn) {
        const headingDiv = document.createElement('div');
        headingDiv.textContent = getButtonText(headingBtn);
        headingDiv.style.fontWeight = 'bold';
        frag.appendChild(headingDiv);
      }
      const list = col.querySelector('ul');
      if (list) frag.appendChild(list);
      return frag;
    });
  }
  // 3. Right-most column: Social, WhatsApp, Download, Awards (with all headings and text)
  let rightColContent = document.createDocumentFragment();
  if (row) {
    const socialDownloads = row.querySelector('.social-downloads');
    if (socialDownloads) {
      Array.from(socialDownloads.children).forEach(child => {
        if (child.textContent.trim() || child.querySelector('img,ul')) {
          rightColContent.appendChild(child);
        }
      });
    }
  }
  // 4. Copyright row: preserve all text and icons as a single cell
  let copyrightRow = null;
  const copyrightBlock = element.querySelector('.copyright-blck');
  if (copyrightBlock) {
    copyrightRow = [copyrightBlock];
  }
  // Compose table rows: header is single column, second row is columns, third row copyright as single cell
  const headerRow = ['Columns (columns7)'];
  // Second row: one array with 4 columns (3 nav, 1 right-most)
  const colCells = [
    ...navColumns,
    rightColContent.childNodes.length ? rightColContent : null
  ].filter(Boolean);
  const rows = [
    headerRow,
    colCells,
  ];
  if (copyrightRow) {
    rows.push(copyrightRow);
  }
  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
