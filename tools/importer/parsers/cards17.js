/* global WebImporter */
export default function parse(element, { document }) {
  const track = element.querySelector('.slick-track');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll(':scope > .slick-slide'));
  const cells = [];
  cells.push(['Cards (cards17)']);
  slides.forEach(slide => {
    // Find the card anchor (may contain both image and text)
    const anchor = slide.querySelector('a');
    let imgCell = '';
    let textCell = '';
    if (anchor) {
      // Find the image
      const img = anchor.querySelector('img');
      if (img) imgCell = img;
      // Try to find text inside the card
      // Look for possible text content containers
      const desc = anchor.querySelector('.ig-common-desc-top');
      if (desc && desc.textContent.trim()) {
        textCell = desc;
      } else {
        // If not, check for any text nodes
        // Try all text content in anchor except alt/title of img
        const textParts = [];
        Array.from(anchor.childNodes).forEach(node => {
          if (node.nodeType === 3 && node.textContent.trim()) {
            textParts.push(node.textContent.trim());
          }
        });
        if (textParts.length) {
          textCell = textParts.join(' ');
        }
      }
    }
    cells.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
