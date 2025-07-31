/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block as per instructions
  const cells = [['Cards (cards17)']];

  // Find card elements (each .slick-slide.slick-active)
  const slides = element.querySelectorAll('.slick-slide.slick-active');

  slides.forEach((slide) => {
    // Each .slick-slide > div > .col-md-3 > a > .picture-effects > img
    const img = slide.querySelector('img'); // Could be null
    // There is no visible card text content in these cards, so text cell is empty string
    cells.push([img, '']);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
