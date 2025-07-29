/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row with EXACTLY one column as per requirements
  const headerRow = ['Columns (columns34)'];

  // Defensive: find the .carousel-image wrapper
  const carouselImage = element.querySelector('.carousel-image');
  if (!carouselImage) return;

  // Extract distinct images
  const imgs = [];
  const seen = new Set();
  carouselImage.querySelectorAll('img').forEach(img => {
    // Only push unique images by src
    if (img.src && !seen.has(img.src)) {
      imgs.push(img);
      seen.add(img.src);
    }
  });
  if (imgs.length === 0) return;

  // The second row may have multiple columns (each image)
  const contentRow = imgs;

  // WebImporter.DOMUtils.createTable expects each row as an array;
  // The header row MUST be an array of length 1 (one single th cell),
  // the content row can be any length (n columns)
  const table = WebImporter.DOMUtils.createTable([
    headerRow, // [ 'Columns (columns34)' ] => 1 column in header row
    contentRow // [ img1, img2, ... ] => n columns in second row
  ], document);
  element.replaceWith(table);
}
