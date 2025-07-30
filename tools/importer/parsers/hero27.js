/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main <img> for the background
  let img = null;
  const imgs = element.querySelectorAll('img');
  for (let i = 0; i < imgs.length; i++) {
    const src = imgs[i].getAttribute('src') || '';
    // Only use if not a data URI and is not clearly a spacer
    if (src && !src.startsWith('data:')) {
      img = imgs[i];
      break;
    }
  }

  // Find the content section (could be empty)
  const bannerContent = element.querySelector('.banner-content');

  // Compose the rows as per spec: header, image, content
  const cells = [];
  cells.push(['Hero (hero27)']);
  cells.push([img ? img : '']);
  cells.push([bannerContent ? bannerContent : '']);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
