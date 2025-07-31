/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the block name exactly as per requirements
  const headerRow = ['Hero (hero14)'];

  // Extract the key content elements
  // 1. Get the background image (prefer non-base64)
  let backgroundImg = null;
  const bckgrdTupple = element.querySelector('.bckgrd-tupple');
  if (bckgrdTupple) {
    const imgs = bckgrdTupple.querySelectorAll('img');
    // Prefer the first not-data: image
    for (const img of imgs) {
      if (img.src && !img.src.startsWith('data:')) {
        backgroundImg = img;
        break;
      }
    }
    // Fallback: if only base64 image exists
    if (!backgroundImg && imgs.length > 0) {
      backgroundImg = imgs[0];
    }
  }

  // 2. Get the text content (banner-content)
  let contentBlock = null;
  if (bckgrdTupple) {
    const bannerContent = bckgrdTupple.querySelector('.banner-content');
    // Only include if it contains any meaningful element or text
    if (bannerContent && (bannerContent.textContent.trim().length > 0 || bannerContent.children.length > 0)) {
      contentBlock = bannerContent;
    }
  }

  // Compose rows (always 3 rows: header, image, text)
  const rows = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [contentBlock ? contentBlock : '']
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}