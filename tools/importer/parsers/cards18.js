/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row exactly as per example
  const headerRow = ['Cards (cards18)'];
  const cells = [headerRow];

  // 2. Find the carousel container with .slick-track for all slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // 3. Each card is a .slick-slide > div > div
  const slides = slickTrack.querySelectorAll('.slick-slide > div > div');

  slides.forEach((card) => {
    // First cell: image element (or null if missing)
    const img = card.querySelector('img');
    
    // Second cell: Compose all text content, including link if any
    let textElements = [];

    // If anchor exists, and has href
    const a = card.querySelector('a');
    if (a) {
      // If the anchor contains any text (after images), include it
      // First, collect all (non-img) child elements/text from the anchor
      const anchorTextNodes = Array.from(a.childNodes).filter(node => {
        // Only non-empty text nodes or non-img elements
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) return true;
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'img') return true;
        return false;
      });
      // If anchor has text, keep the anchor (with image removed)
      if (anchorTextNodes.length > 0) {
        // Remove all img from anchor (so only text remains)
        const imgsInA = Array.from(a.querySelectorAll('img'));
        imgsInA.forEach(imgEl => imgEl.remove());
        textElements.push(a);
      } else {
        // If anchor does not have text, but still has an href: include as a link
        const link = document.createElement('a');
        link.href = a.href;
        link.target = '_blank';
        link.textContent = a.href;
        textElements.push(link);
      }
    }
    // Also, include any text nodes directly under .promotional-slide--carosuel--item or its children
    // This ensures if there is text outside the anchor, we don't miss it
    const allTextNodes = [];
    function getDeepTextNodes(node) {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
          allTextNodes.push(child.textContent.trim());
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() !== 'img' && child.tagName.toLowerCase() !== 'a') {
          getDeepTextNodes(child);
        }
      }
    }
    getDeepTextNodes(card);
    // Add any new text nodes not already in anchor
    allTextNodes.forEach(txt => {
      // Only add if not already present in textElements
      if (!textElements.some(el => el.textContent && el.textContent.includes(txt))) {
        const p = document.createElement('p');
        p.textContent = txt;
        textElements.push(p);
      }
    });
    // If textElements is empty, provide an empty string for cell
    if (textElements.length === 0) textElements = [''];
    if (img || textElements.length > 0) {
      cells.push([
        img,
        textElements.length === 1 ? textElements[0] : textElements
      ]);
    }
  });

  // 4. Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
