/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required, always a single column
  const cells = [
    ['Cards (cards30)']
  ];
  // Find the main card container
  const container = element.querySelector('.container.container-mob');
  if (container) {
    let imgEl = null;
    let textCol = [];
    // Look for all immediate children (could be <p> or text nodes)
    const children = Array.from(container.childNodes);
    for (const child of children) {
      if (child.nodeType === 1) {
        // If this is a <p> containing an image
        const maybeImg = child.querySelector('img');
        if (maybeImg && !imgEl) {
          imgEl = maybeImg;
        } else if (child.tagName === 'P' && child.innerHTML.replace(/\s|&nbsp;/g, '') !== '') {
          // If this <p> isn't just whitespace or &nbsp;, include it
          textCol.push(child);
        } else if (child.tagName === 'P' && child.innerHTML.replace(/\s|&nbsp;/g, '') === '' && child.innerHTML.includes('&nbsp;')) {
          // If it is only a &nbsp;, preserve as nonbreaking space
          const nbspSpan = document.createElement('span');
          nbspSpan.innerHTML = '&nbsp;';
          textCol.push(nbspSpan);
        }
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        // Text node outside <p>
        const span = document.createElement('span');
        span.textContent = child.textContent.trim();
        textCol.push(span);
      }
    }
    // Compose the card row
    cells.push([
      imgEl ? imgEl : '',
      textCol.length ? textCol : ''
    ]);
  }
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
