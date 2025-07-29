/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the first direct child of a tagName from a parent
  function getDirectChild(parent, tagName) {
    return Array.from(parent.children).find(child => child.tagName.toLowerCase() === tagName.toLowerCase());
  }

  // Helper to build the text cell for a slide
  function buildTextCell(el) {
    const textCell = [];

    // Title: .getinspired-blck .dest-basic h2
    const h2 = el.querySelector('.getinspired-blck .dest-basic h2');
    if (h2 && h2.textContent.trim()) {
      textCell.push(h2);
    }

    // Description: .dest-city-info .info-container .textblock.section p
    const descP = el.querySelector('.dest-city-info .info-container .textblock.section p');
    if (descP && descP.textContent.trim()) {
      textCell.push(descP);
    }

    // CTA: .getinspired-blck .booknow-getins
    const btn = el.querySelector('.getinspired-blck .booknow-getins');
    if (btn) {
      const ctaLink = document.createElement('a');
      ctaLink.textContent = btn.textContent.trim();
      // Get real href from data-path, fallback to href if needed
      ctaLink.href = btn.getAttribute('data-path') || btn.getAttribute('href') || '#';
      if (textCell.length > 0) textCell.push(document.createElement('br'));
      textCell.push(ctaLink);
    }

    return textCell.length > 0 ? textCell : '';
  }

  // Helper to build a slide row [img, textCell] from a .getinspiredbanner element
  function buildSlideRow(el) {
    // Get the img inside .getinspired-blck picture
    const img = el.querySelector('.getinspired-blck picture img');
    if (!img) return null; // skip if no image
    // Use existing img element in document
    return [img, buildTextCell(el)];
  }

  // Get all slides in this carousel by scanning all sibling .getinspiredbanner elements
  // Only select siblings if the parent contains multiple .getinspiredbanner
  let container = element.parentElement;
  let slideEls = [];
  if (container) {
    slideEls = Array.from(container.querySelectorAll(':scope > .getinspiredbanner'));
  }
  if (!slideEls.length) slideEls = [element];

  // Compose table rows
  const rows = [['Carousel (carousel11)']];
  for (const slideEl of slideEls) {
    const row = buildSlideRow(slideEl);
    if (row) {
      rows.push(row);
    }
  }

  // Create the carousel block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
