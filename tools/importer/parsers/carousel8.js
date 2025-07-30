/* global WebImporter */
export default function parse(element, { document }) {
  // Find all slides in the carousel (one or more destination-trip-details blocks)
  const details = element.querySelectorAll('.destination-trip-details');

  // Prepare table rows
  const rows = [['Carousel']]; // Header row, exactly matching example

  details.forEach((detail) => {
    // --- IMAGE CELL ---
    let img = null;
    const picture = detail.querySelector('picture');
    if (picture) {
      img = picture.querySelector('img');
    }
    const imageCell = img || '';

    // --- TEXT CELL ---
    const textCellContent = [];

    // 1. TITLE (h2 in .dest-basic)
    const title = detail.querySelector('.dest-basic h2');
    if (title) {
      textCellContent.push(title);
    }

    // 2. DESCRIPTION (paragraph in .dest-city-info .textblock .clearfix.text-pagination p)
    const descP = detail.querySelector('.dest-city-info .textblock .clearfix.text-pagination p');
    if (descP) {
      textCellContent.push(descP);
    }

    // 3. CTA (Book Now link, from a.booknow-getins[data-path])
    const bookNow = detail.querySelector('a.booknow-getins[data-path]');
    if (bookNow) {
      // Use only the existing element, but ensure it's an <a> with href taken from data-path
      // We should not clone it or create a new one, but update the href attribute on the actual element
      bookNow.setAttribute('href', bookNow.getAttribute('data-path'));
      textCellContent.push(bookNow);
    }

    // Compose text cell
    let textCell = '';
    if (textCellContent.length === 1) {
      textCell = textCellContent[0];
    } else if (textCellContent.length > 1) {
      textCell = textCellContent;
    } // else remains ''

    rows.push([imageCell, textCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
