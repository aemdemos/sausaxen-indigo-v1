/* global WebImporter */
export default function parse(element, { document }) {
  function getFirstDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }
  const linksContainer = getFirstDirectChildByClass(element, 'container__links');
  const columnDivs = linksContainer ? Array.from(linksContainer.children).filter(div => div.classList.contains('accordion')) : [];
  function extractAccordionContent(accordion) {
    if (!accordion) return null;
    const item = accordion.querySelector('.cmp-accordion__item');
    if (!item) return null;
    const panel = item.querySelector('.cmp-accordion__panel');
    if (!panel) return null;
    const grid = panel.querySelector('.aem-Grid');
    if (!grid) return null;
    const textBlock = grid.querySelector('.text');
    if (!textBlock) return null;
    return textBlock.firstElementChild;
  }
  const col1 = extractAccordionContent(columnDivs[0]);
  const col2 = extractAccordionContent(columnDivs[1]);
  const col3 = extractAccordionContent(columnDivs[2]);
  const socialDiv = Array.from(element.children).find(el => el.classList.contains('social-links'));
  const tableRow = [col1, col2, col3, socialDiv];
  // Header row: single cell as in example
  const headerRow = ['Columns (columns11)'];
  const cells = [headerRow, tableRow];
  // Patch: make sure thead row has only one th spanning all columns
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Fix: set colspan for header row to match data row length
  const thead = table.querySelector('thead');
  if (thead) {
    const ths = thead.querySelectorAll('th');
    if (ths.length === 1 && tableRow.length > 1) {
      ths[0].setAttribute('colspan', tableRow.length);
    }
  }
  element.replaceWith(table);
}
