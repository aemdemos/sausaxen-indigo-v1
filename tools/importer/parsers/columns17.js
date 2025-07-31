/* global WebImporter */
export default function parse(element, { document }) {
  // Get all carousel slides (image+link blocks)
  const slides = Array.from(element.querySelectorAll('.slick-slide'));

  // Each column is the <a> tag wrapping the image
  const columns = slides.map(slide => {
    const a = slide.querySelector('a');
    return a || '';
  });

  // If there are no columns, don't do anything
  if (!columns.length) return;

  // Build the block table. First row is header (1 column), second row is the images (n columns)
  const cells = [
    ['Columns (columns17)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
