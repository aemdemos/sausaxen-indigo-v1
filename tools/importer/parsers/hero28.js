/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as specified
  const headerRow = ['Hero (hero28)'];

  // Get the main container that holds image and possible overlay text
  const container = element.querySelector('.container');

  // --------- Background Image Row (row 2) ----------
  let bgContent = '';
  let overlayTextNodes = [];
  if (container) {
    // Find the image (usually in a link)
    const img = container.querySelector('img');
    if (img) {
      // If the image is wrapped in a link, use the link (with the img inside)
      if (img.parentElement && img.parentElement.tagName === 'A') {
        bgContent = img.parentElement;
      } else {
        bgContent = img;
      }
    }

    // For overlay text: search for absolutely positioned or visually overlaid siblings of the image
    // If there's only one child and it's the image/link, search for overlay siblings in the parent section
    // Common website patterns: overlays are siblings of the image/link
    let possibleOverlayParent = container;
    // If container only has the image/link and empty <p>, broaden search to parent (element)
    const containerChildren = Array.from(container.children).filter(
      (child) => child.tagName !== 'P' || child.textContent.trim() !== ''
    );
    if (containerChildren.length <= 1) {
      possibleOverlayParent = element;
    }
    // Collect overlay nodes: anything that's not (or does not contain) an img
    Array.from(possibleOverlayParent.children).forEach((child) => {
      if (child.querySelector && child.querySelector('img')) return;
      if (!child.textContent || !child.textContent.trim()) return;
      overlayTextNodes.push(child);
    });
    // If still empty, try to get all text nodes from container (could be direct text or non-image elements)
    if (overlayTextNodes.length === 0) {
      Array.from(container.childNodes).forEach((node) => {
        if (node.nodeType === 1 && node.querySelector && node.querySelector('img')) return;
        if (node.nodeType === 3 && !node.textContent.trim()) return;
        if (node.nodeType === 1 && !node.textContent.trim()) return;
        if (node.nodeType === 1 && node.tagName === 'P' && node.innerHTML.replace(/\s|&nbsp;/g, '') === '') return;
        overlayTextNodes.push(node);
      });
    }
  }

  // If no text, cell must still exist
  const contentRow = [overlayTextNodes.length ? overlayTextNodes : ''];

  // --------- Create Final Table ----------
  const cells = [
    headerRow,
    [bgContent],
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
