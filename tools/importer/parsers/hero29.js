/* global WebImporter */
export default function parse(element, { document }) {
  // Get the desktop and mobile image sections
  const desktopDiv = element.querySelector('.carousel-image--desktop');
  const mobileDiv = element.querySelector('.carousel-image--mob');

  // Prefer desktop image for the hero block
  let imgElem = null;
  if (desktopDiv) {
    imgElem = desktopDiv.querySelector('img');
  }
  if (!imgElem && mobileDiv) {
    imgElem = mobileDiv.querySelector('img');
  }

  // If no image, leave the cell empty
  const headerRow = ['Hero (hero29)'];
  const imageRow = [imgElem || ''];
  const contentRow = ['']; // No headline/subheading/CTA in the given HTML

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
