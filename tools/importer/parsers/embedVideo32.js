/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header
  const headerRow = ['Embed (embedVideo32)'];

  // Find the iframe (embed) and any text content to include in the cell
  let iframe = element.querySelector('iframe');

  // Gather all text nodes (not inside an iframe) including in wrappers
  function extractTextNodes(node) {
    let texts = [];
    for (const child of node.childNodes) {
      // If it's an iframe, skip
      if (child.nodeType === 1 && child.tagName === 'IFRAME') continue;
      if (child.nodeType === 3) {
        const val = child.textContent.trim();
        if (val) texts.push(val);
      } else if (child.nodeType === 1) {
        texts = texts.concat(extractTextNodes(child));
      }
    }
    return texts;
  }
  const textContents = extractTextNodes(element);

  // Build cell content: text, then link to iframe
  const cellContent = [];
  textContents.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    cellContent.push(p);
  });
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    cellContent.push(link);
  }

  const cells = [
    headerRow,
    [cellContent.length === 1 ? cellContent[0] : cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
