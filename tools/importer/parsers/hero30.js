/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows
  // 1st row: Header
  const headerRow = ['Hero (hero30)'];

  // 2nd row: Background Image (the main image, desktop preferred, else mobile)
  // Reference the entire image block (the .carousel-image--desktop div if present, else .carousel-image--mob)
  let imageDiv = element.querySelector('.carousel-image--desktop');
  if (!imageDiv) {
    imageDiv = element.querySelector('.carousel-image--mob');
  }

  // 3rd row: Text elements (none in this HTML, so empty string)
  const textRow = [''];

  const rows = [headerRow, [imageDiv || ''], textRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
