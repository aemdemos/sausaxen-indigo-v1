/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, must match example exactly
  const headerRow = ['Hero (hero1)'];

  // --- Background Image Extraction ---
  // Use the first <img> whose src is NOT a data:image
  let bgImg = null;
  const imgs = element.querySelectorAll('img');
  for (let img of imgs) {
    if (img.src && !img.src.startsWith('data:image')) {
      bgImg = img;
      break;
    }
  }
  const bgImgRow = [bgImg ? bgImg : ''];

  // --- Content Extraction ---
  // Banner text content (title, subtitle, cta, etc)
  // The structure is <div class="banner-content"><h2></h2><p></p></div>
  // Reference the entire .banner-content (may be empty)
  let bannerContent = element.querySelector('.banner-content');
  if (!bannerContent) {
    bannerContent = '';
  }
  const contentRow = [bannerContent];

  // Compose cell array (must be 3 rows, 1 column each)
  const cells = [
    headerRow,
    bgImgRow,
    contentRow
  ];

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
