/* global WebImporter */
export default function parse(element, { document }) {
  // Find the desktop image as the background image
  let imgElement = null;
  const desktopImgDiv = element.querySelector('.carousel-image--desktop');
  if (desktopImgDiv) {
    imgElement = desktopImgDiv.querySelector('img');
  }
  // Fallback to any image if not found
  if (!imgElement) {
    imgElement = element.querySelector('img');
  }

  // Prepare the rows for the block
  const rows = [];

  // 1st row: header
  rows.push(['Hero (hero29)']);

  // 2nd row: background image (just the referenced image element)
  rows.push([imgElement ? imgElement : '']);

  // 3rd row: Text content (there is none in provided HTML, so empty)
  rows.push(['']);

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
