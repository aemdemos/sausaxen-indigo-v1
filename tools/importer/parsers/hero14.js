/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content: .bckgrd-tupple
  const bckgrdTupple = element.querySelector('.bckgrd-tupple');
  if (!bckgrdTupple) return;

  // --- BACKGROUND IMAGE ---
  // Prefer <img> with src that is NOT data: and is not empty
  let backgroundImg = null;
  const imgs = bckgrdTupple.querySelectorAll('img');
  for (const img of imgs) {
    if (img.src && !img.src.startsWith('data:')) {
      backgroundImg = img;
      break;
    }
  }
  // fallback: first image
  if (!backgroundImg && imgs.length > 0) backgroundImg = imgs[0];

  // --- CONTENT (heading, subheading, cta, all content) ---
  // inside .banner-content
  const bannerContent = bckgrdTupple.querySelector('.banner-content');
  let contentCell = '';
  if (bannerContent) {
    // Only include bannerContent if it contains actual content
    const hasContent = Array.from(bannerContent.childNodes).some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node.textContent && node.textContent.trim().length > 0;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });
    if (hasContent) {
      contentCell = Array.from(bannerContent.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return node.textContent && node.textContent.trim().length > 0;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      // If any are text nodes, convert them to paragraphs
      contentCell = contentCell.map(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return node;
        } else if (node.nodeType === Node.TEXT_NODE) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          return p;
        }
        return '';
      });
    } else {
      contentCell = '';
    }
  }

  const headerRow = ['Hero (hero14)'];
  const imageRow = [backgroundImg ? backgroundImg : ''];
  const contentRow = [contentCell && contentCell.length ? contentCell : ''];
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
