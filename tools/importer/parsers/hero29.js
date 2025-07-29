/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero29)'];

  // Get the container with the main content
  const container = element.querySelector(':scope > .container');

  // 2nd row: background image (could be wrapped in a link)
  let bgCell = '';
  if (container) {
    // Look for a <p> containing an <img>
    const imgP = Array.from(container.children).find(child => child.querySelector && child.querySelector('img'));
    if (imgP) {
      // If image is wrapped in a link, use the <a>, else just the <img>
      const imgLink = imgP.querySelector('a');
      bgCell = imgLink || imgP.querySelector('img');
    }
  }

  // 3rd row: all other content from the container except the image paragraph
  let contentCell = '';
  if (container) {
    const contentEls = [];
    Array.from(container.children).forEach(child => {
      // skip paragraph containing image
      if (child.querySelector && child.querySelector('img')) return;
      // ignore empty <p> (e.g. <p>&nbsp;</p>)
      if (child.tagName === 'P' && !child.textContent.trim()) return;
      contentEls.push(child);
    });
    // If any content, add it as an array; else blank
    if (contentEls.length) {
      contentCell = contentEls;
    }
  }

  if (!bgCell) bgCell = '';
  if (!contentCell) contentCell = '';

  const rows = [
    headerRow,
    [bgCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
