/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child with class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // 1. Left column: All navigation links (Get to Know Us, Services, Quick links) grouped into one div
  const accordion = element.querySelector('#footer-accordion');
  let leftColContent = document.createElement('div');
  if (accordion) {
    // Only keep first three .ig-acc-sitemap (major columns)
    const cols = Array.from(accordion.querySelectorAll('.ig-acc-sitemap')).slice(0, 3);
    cols.forEach((col) => {
      // Find button (header) and ul (list) - in order
      const button = col.querySelector('button');
      const ul = col.querySelector('ul');
      if (button) leftColContent.appendChild(button);
      if (ul) leftColContent.appendChild(ul);
    });
  }

  // 2. Right column: Social, downloads, awards, etc.
  const row = element.querySelector('.row');
  let rightCol = getDirectChildByClass(row, 'social-downloads');
  let rightColContent = document.createElement('div');
  if (rightCol) {
    // Filter out empty textblock.section children
    Array.from(rightCol.children).forEach((child) => {
      if (!(child.classList && child.classList.contains('textblock') && child.textContent.trim() === '')) {
        rightColContent.appendChild(child);
      }
    });
  }

  // Compose the block table as 2 columns, matching the example
  const cells = [
    ['Columns (columns22)'],
    [leftColContent, rightColContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
