/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all direct children (including text nodes) from a parent
  function extractAllContent(parent) {
    const fragment = document.createDocumentFragment();
    Array.from(parent.childNodes).forEach((node) => {
      fragment.appendChild(node);
    });
    return fragment;
  }

  // Find main columns in the footer
  const accordion = element.querySelector('.ig-footer-accordion');
  const sitemaps = accordion ? Array.from(accordion.querySelectorAll('.col-12.col-md-3.ig-acc-sitemap')) : [];
  const row = element.querySelector('.row');
  const socialCol = row ? Array.from(row.children).find(c => c.classList && c.classList.contains('social-downloads')) : null;

  // Top Left: All content from the first sitemap ("Get to Know Us")
  let topLeft = '';
  if (sitemaps[0]) {
    topLeft = extractAllContent(sitemaps[0]);
  }

  // Top Right: All content from the social/downloads/awards column
  let topRight = '';
  if (socialCol) {
    topRight = extractAllContent(socialCol);
  }

  // Bottom Left: All content from the second sitemap ("Services")
  let bottomLeft = '';
  if (sitemaps[1]) {
    bottomLeft = extractAllContent(sitemaps[1]);
  }

  // Bottom Right: All content from the third sitemap ("Quick links")
  let bottomRight = '';
  if (sitemaps[2]) {
    bottomRight = extractAllContent(sitemaps[2]);
  }

  // Copyright row (full width)
  let copyrightContent = '';
  const copyrightBlk = element.querySelector('.copyright-blck');
  if (copyrightBlk) {
    copyrightContent = extractAllContent(copyrightBlk);
  }

  // Build table rows according to the Columns (columns7) spec
  const cells = [
    ['Columns (columns7)'],
    [topLeft, topRight],
    [bottomLeft, bottomRight]
  ];
  if (copyrightContent) {
    cells.push([copyrightContent]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
