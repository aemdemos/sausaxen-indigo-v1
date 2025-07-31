/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const cells = [
    ['Cards (cards30)'],
  ];

  const container = element.querySelector('.container-mob');
  if (container) {
    // Find the first image in the card
    const img = container.querySelector('img') || '';
    // For text: gather ALL <p> that are NOT the one containing only the image
    const ps = Array.from(container.querySelectorAll(':scope > p'));
    // Filter out empty paragraphs (only whitespace or &nbsp;) and ignore <p> with just the image
    const textPs = ps.filter(p => {
      // Has only an image and no text
      if (p.querySelector('img') && p.textContent.replace(/\u00a0/g, '').trim() === '') return false;
      // Is empty or just &nbsp;
      if (p.textContent.replace(/\u00a0/g, '').trim() === '') return false;
      return true;
    });
    // If any, combine all such paragraphs (reference them directly)
    let textCell = '';
    if (textPs.length > 0) {
      textCell = textPs;
    }
    cells.push([img, textCell]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
