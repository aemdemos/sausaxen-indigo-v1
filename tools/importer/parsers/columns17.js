/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slide track containing the slides
  const slideTrack = element.querySelector('.slick-track');
  if (!slideTrack) return;

  // Find all direct child slides
  const slides = Array.from(slideTrack.children).filter(child => child.classList.contains('slick-slide'));

  // For each slide, extract the main <a> (with image inside), if available
  const columns = slides.map(slide => {
    // Each slide contains a div > div > .ig-slide-item
    // Go down two levels to reach .ig-slide-item
    let item = slide.firstElementChild;
    if (item) item = item.firstElementChild;
    if (!item) return null;
    // The main <a> that wraps the content
    const link = item.querySelector('a');
    if (link) {
      return link;
    } else {
      // fallback: just return the image
      const img = item.querySelector('img');
      return img || null;
    }
  }).filter(Boolean);

  // Only build table if we actually found slides
  if (columns.length === 0) return;

  // Table structure: header is SINGLE cell, second row has N columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns17)'],
    columns
  ], document);

  element.replaceWith(table);
}
