/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row: must be a single cell/column
  const rows = [['Cards (cards32)']];

  // Find the main card container
  const container = element.querySelector('.container');
  if (!container) return;

  // Get the image (first <img> inside the container)
  const img = container.querySelector('img');

  // Gather all <p> tags in the container except those containing <img> or just non-breaking space
  const textParas = Array.from(container.querySelectorAll('p')).filter(p => {
    // ignore paragraphs with only &nbsp; or whitespace
    if (p.textContent.replace(/\u00a0/g, '').trim() === '') return false;
    // ignore paragraphs containing the image
    if (p.querySelector('img')) return false;
    return true;
  });

  // Compose the text cell for the card
  let textCell = '';
  if (textParas.length > 0) {
    // If multiple paragraphs, include all as-is
    textCell = textParas.length === 1 ? textParas[0] : textParas;
  } else if (img) {
    // Fallback to alt or title if present
    textCell = img.getAttribute('alt') || img.getAttribute('title') || '';
  }

  // Only add a card row if there is either image or text
  if (img || textCell) {
    rows.push([img, textCell]);
  }

  // Only replace if there is a card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
