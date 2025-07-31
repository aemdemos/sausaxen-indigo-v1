/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: required by spec
  const headerRow = ['Cards (cards18)'];
  const rows = [];

  // Find the carousel slides section
  const promoSlide = element.querySelector('.promotional-slide');
  if (!promoSlide) return;

  // Get all card slides (each .slick-slide)
  const slideEls = promoSlide.querySelectorAll('.slick-slide');
  slideEls.forEach((slide) => {
    const cardCol = slide.querySelector('.promotional-slide--carosuel--item');
    if (!cardCol) return;
    // Get the image (required)
    const img = cardCol.querySelector('img');
    const imgCell = img;
    // Get the card link (CTA)
    const cardLink = cardCol.querySelector('a.promotional-slide--redirection');
    // Try to find all text content associated with this card, including any text under the link, image alt, and any additional visible text
    let cardTextContent = [];

    // 1. Gather all descendant text nodes in cardCol except those inside buttons or images
    function gatherTextNodes(node) {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent.trim();
          if (text) cardTextContent.push(document.createTextNode(text));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (!['IMG', 'BUTTON', 'SVG'].includes(child.tagName)) {
            gatherTextNodes(child);
          }
        }
      });
    }
    gatherTextNodes(cardCol);

    // 2. Always use image alt as heading if present (first, above any other text)
    if (img && img.alt) {
      const heading = document.createElement('strong');
      heading.textContent = img.alt;
      cardTextContent.unshift(heading);
    }
    // 3. Add CTA link
    if (cardLink && cardLink.href) {
      if (cardTextContent.length > 0) cardTextContent.push(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = cardLink.href;
      cta.target = '_blank';
      cta.textContent = 'Instagram Reel';
      cardTextContent.push(cta);
    }
    // Remove empty content
    cardTextContent = cardTextContent.filter(Boolean);
    // Compose the row
    const contentCell = cardTextContent.length === 1 ? cardTextContent[0] : cardTextContent;
    rows.push([imgCell, contentCell]);
  });
  // Compose and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
