/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extracts only visible and meaningful content from a node
  function extractRelevantContent(node) {
    const out = [];
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.trim()) {
          out.push(document.createTextNode(child.textContent));
        }
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        // ignore empty divs, overlays, clearfixes, containers with no visible content
        !(
          child.tagName === 'DIV' &&
          child.classList.contains('clearfix') &&
          !child.textContent.trim()
        ) &&
        !(
          child.tagName === 'DIV' &&
          child.classList.contains('container') &&
          !child.textContent.trim()
        )
      ) {
        // Recursively flatten if the element is a wrapper div with only one child
        if (
          child.tagName === 'DIV' &&
          child.childNodes.length === 1 &&
          child.children.length === 1
        ) {
          out.push(...extractRelevantContent(child));
        } else {
          out.push(child);
        }
      }
    });
    return out.length === 1 ? out[0] : (out.length ? out : '');
  }

  // Find the 3 main accordion columns
  const accordion = element.querySelector('.ig-footer-accordion');
  let col1 = '', col2 = '', col3 = '';
  if (accordion) {
    const cols = accordion.querySelectorAll('.col-12.col-md-3.ig-acc-sitemap');
    if (cols[0]) col1 = extractRelevantContent(cols[0]);
    if (cols[1]) col2 = extractRelevantContent(cols[1]);
    if (cols[2]) col3 = extractRelevantContent(cols[2]);
  }

  // Find the right-most column: social, downloads, awards
  const rightCol = element.querySelector('.social-downloads');
  let rightColContent = '';
  if (rightCol) {
    rightColContent = extractRelevantContent(rightCol);
  }

  // Copyright row: left-most cell
  let copyrightCell = '';
  const copyrightContent = element.querySelector('.copyright-content');
  if (copyrightContent) {
    copyrightCell = extractRelevantContent(copyrightContent);
  }

  // Compose the table, header row must be a single cell
  const headerRow = ['Columns (columns21)'];
  const mainRow = [col1, col2, col3, rightColContent];
  const copyrightRow = [copyrightCell, '', '', ''];

  const cells = [
    headerRow,
    mainRow,
    copyrightRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Ensure the header row has only one <th> and spans all columns
  const firstRow = table.querySelector('tr:first-child');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.firstElementChild.setAttribute('colspan', '4');
  }
  element.replaceWith(table);
}
