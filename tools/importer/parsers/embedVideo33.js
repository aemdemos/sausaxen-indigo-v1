/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as required by block spec
  const headerRow = ['Embed (embedVideo33)'];

  // For this embed block, we want to:
  // - Include any text content from the container
  // - Include the embed iframe as a link below any text

  // Collect all direct text nodes of the element
  const contentEls = [];
  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      contentEls.push(document.createTextNode(node.textContent));
    }
  });

  // Look for an iframe anywhere inside (direct or deeper child)
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    // Add a link to the src as required in the block example
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    contentEls.push(link);
  }

  // If there are other significant elements (text, fallback, etc.), include those too
  // In this structure, we already account for text and embed
  // Compose table: 2 rows, 1 col: header, then content cell
  const cells = [headerRow, [contentEls]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
