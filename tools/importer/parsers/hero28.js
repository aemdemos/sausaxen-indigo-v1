/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero28)'];

  // Find the .container that holds the main hero content
  const container = element.querySelector('.container');
  let backgroundContent = '';
  let textContent = '';

  if (container) {
    // Gather all non-empty nodes from the container
    const nodes = Array.from(container.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    });
    // Assign all content (image, text, links, etc.) to backgroundContent
    backgroundContent = nodes.length === 1 ? nodes[0] : nodes;

    // Try to extract text content (e.g., CTA, heading) from within the container, if present
    // If there's a heading/cta-type element not in an <img> or <a>, include those in textContent
    // This is flexible for future variations
    const insideTextEls = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button')).filter(el => {
      // Not inside a link with an image only
      return !(el.querySelector('img')) && el.textContent.trim();
    });
    if (insideTextEls.length > 0) {
      textContent = insideTextEls.length === 1 ? insideTextEls[0] : insideTextEls;
    }
  }

  // If nothing was extracted for textContent within container, check for content after container and before .clearfix
  if (!textContent) {
    let next = container && container.nextSibling;
    const textNodes = [];
    while (next && !(next.classList && next.classList.contains('clearfix'))) {
      if (next.nodeType === Node.ELEMENT_NODE || (next.nodeType === Node.TEXT_NODE && next.textContent.trim())) {
        textNodes.push(next);
      }
      next = next.nextSibling;
    }
    if (textNodes.length === 1) textContent = textNodes[0];
    else if (textNodes.length > 1) textContent = textNodes;
  }

  const cells = [
    headerRow,
    [backgroundContent],
    [textContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
