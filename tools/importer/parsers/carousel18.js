/* global WebImporter */
export default function parse(element, { document }) {
  // The first row must be a single cell with the exact header
  const rows = [['Carousel (carousel18)']];

  // Find the carousel container
  const carousel = element.querySelector('.promotional-slide--carosuel.slick-slider');
  if (!carousel) return;

  // Find all slides (accepts both active and inactive)
  const slides = carousel.querySelectorAll('.slick-slide');
  slides.forEach((slide) => {
    const item = slide.querySelector('.promotional-slide--carosuel--item');
    if (!item) return;
    const link = item.querySelector('a');
    const img = item.querySelector('img');

    // First column: always the image element
    const cell1 = img || '';

    // Second column: any text content (title, description, etc.), plus CTA if present
    const cell2Content = [];

    // Try to extract meaningful text content from inside the link or item
    if (link) {
      // Check for any element that could be a heading or description, not just the image
      // Include all elements (except image container) and text nodes
      link.childNodes.forEach((child) => {
        if (
          child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== ''
        ) {
          cell2Content.push(document.createTextNode(child.textContent));
        } else if (
          child.nodeType === Node.ELEMENT_NODE && !child.querySelector('img') && !child.classList.contains('get-inspired-carausel--picture')
        ) {
          cell2Content.push(child);
        }
      });
    }

    // Also check for text nodes or extra elements directly on item (outside link)
    item.childNodes.forEach((child) => {
      if (
        child !== link &&
        child.nodeType === Node.TEXT_NODE &&
        child.textContent.trim() !== ''
      ) {
        cell2Content.push(document.createTextNode(child.textContent));
      } else if (
        child !== link &&
        child.nodeType === Node.ELEMENT_NODE && !child.querySelector('img')
      ) {
        cell2Content.push(child);
      }
    });

    // Always append the CTA at the end if there is a link
    if (link && link.href) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      cta.textContent = 'View on Instagram';
      cell2Content.push(cta);
    }

    rows.push([cell1, cell2Content.length > 0 ? cell2Content : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
