/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slick-track containing all cards
  const slickTrack = element.querySelector('.promotional-slide .slick-track');
  if (!slickTrack) return;
  const slides = Array.from(slickTrack.querySelectorAll('.slick-slide'));
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    const item = slide.querySelector('.promotional-slide--carosuel--item');
    if (!item) return;
    const link = item.querySelector('a.promotional-slide--redirection');
    const img = item.querySelector('img');
    if (!img) return;

    // Attempt to extract all text content that may be present in the card
    let textContentNodes = [];
    // 1. Collect text from the surrounding card area (outside image wrapper)
    // We'll look inside the link, but outside the image wrapper
    // Also, sometimes there may be elements with text content directly
    const imageContainer = item.querySelector('.get-inspired-carausel--picture');
    if (link) {
      // For each element or text node in the link, if it is not inside imageContainer, extract text
      Array.from(link.childNodes).forEach((node) => {
        if (imageContainer && imageContainer.contains(node)) return; // skip image
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textContentNodes.push(document.createTextNode(node.textContent.trim()));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Check for textContent of element if not image container
          if (node !== imageContainer && node.textContent.trim()) {
            textContentNodes.push(document.createTextNode(node.textContent.trim()));
          }
        }
      });
    }
    // Also, scan for any text nodes directly under the card item but outside link or image container
    Array.from(item.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textContentNodes.push(document.createTextNode(node.textContent.trim()));
      }
    });
    // 2. Always add CTA link to Instagram reel
    if (link && link.href) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = 'View Instagram Reel';
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      textContentNodes.push(cta);
    }
    // Row: image | [title/desc/text, CTA] (combine as array in second cell)
    rows.push([
      img,
      textContentNodes.length ? textContentNodes : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
