/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row: prefer first non-base64 image
  let backgroundImg = null;
  const imgs = element.querySelectorAll('img');
  for (const img of imgs) {
    if (img.src && !img.src.startsWith('data:')) {
      backgroundImg = img;
      break;
    }
  }
  const backgroundRow = [backgroundImg ? backgroundImg : ''];

  // 3. Content row: collect banner-content, but make cell truly empty if all its text content is empty
  let contentRow = [''];
  const bannerContent = element.querySelector('.banner-content');
  if (bannerContent) {
    // Check if any child node has non-empty text
    const hasContent = Array.from(bannerContent.childNodes || []).some(node => {
      return node.nodeType === Node.ELEMENT_NODE && node.textContent.trim().length > 0;
    });
    if (hasContent) {
      // If there's real content, include the whole bannerContent
      contentRow = [bannerContent];
    }
  }

  // 4. Assemble block table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
