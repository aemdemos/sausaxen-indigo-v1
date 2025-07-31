/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the cards grid inside the block
  const cardsGrid = element.querySelector('.aem-Grid');
  if (!cardsGrid) return;

  // 2. Get all immediate grid columns (cards)
  const cardDivs = Array.from(cardsGrid.querySelectorAll(':scope > div'));
  if (!cardDivs.length) return;

  // 3. Helper: get the best image in a card
  function getImage(card) {
    // Prefer desktop image
    let img = card.querySelector('.carousel-image--desktop img');
    if (!img) img = card.querySelector('.carousel-image--mob img');
    if (!img) img = card.querySelector('img');
    return img;
  }

  // 4. Helper: get the text content for a card
  function getTextContent(card) {
    // Try to find title (often in a div, or as text)
    // In this example HTML, text is outside the carousel-image, but in the test HTML, there is no text, only images and prices/buttons
    // So: Try to extract all nodes that are not the image or its wrappers
    // But in the current HTML, there's no text nodes outside images in the card columns: the text is in the image (product name) or not present
    // So, for now, just return the entire column except the image wrappers (so prices, ctas, etc.)
    const textEls = [];
    // Exclude carousel-image blocks from collection
    Array.from(card.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.classList.contains('carousel-image')) {
        // skip, handled as image
      } else if (node.nodeType === 1) {
        textEls.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        textEls.push(document.createTextNode(node.textContent));
      }
    });
    // If nothing found (as in image-only columns), return an empty array
    return textEls;
  }

  // 5. Build the rows: [image, text content]
  const rows = cardDivs.map((col) => {
    const carousel = col.querySelector('.carousel-image');
    const img = carousel ? getImage(carousel) : getImage(col);
    if (!img) return null; // Only cards with images
    const textContent = getTextContent(col);
    return [img, textContent.length ? textContent : ''];
  }).filter(Boolean);

  // 6. Compose the table with header
  const table = WebImporter.DOMUtils.createTable([
    ['Cards (cards21)'],
    ...rows
  ], document);

  element.replaceWith(table);
}
