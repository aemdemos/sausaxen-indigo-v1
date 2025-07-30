/* global WebImporter */
export default function parse(element, { document }) {
  // Combine all left navigation blocks into a single array for one cell
  function getLeftColumn(element) {
    const accordion = element.querySelector('.ig-footer-accordion');
    if (!accordion) return '';
    // Get first three nav columns
    const navCols = Array.from(accordion.querySelectorAll('.col-12.col-md-3.ig-acc-sitemap')).slice(0, 3);
    const leftCellContent = [];
    navCols.forEach(col => {
      Array.from(col.children).forEach(child => {
        if (child.textContent.trim() !== '' || child.querySelector('ul, button, .footer-links.section')) {
          leftCellContent.push(child);
        }
      });
    });
    // Fallback
    if (leftCellContent.length === 0) return '';
    return leftCellContent;
  }

  // Combine all right-side content into a single array for one cell
  function getRightColumn(element) {
    const mainRow = element.querySelector('.row');
    if (!mainRow) return '';
    const rightCol = mainRow.querySelector('.col-lg-3.social-downloads');
    if (!rightCol) return '';
    const rightCellContent = [];
    Array.from(rightCol.children).forEach(child => {
      if (child.textContent.trim() !== '' || child.querySelector('img,ul,h6,div')) {
        rightCellContent.push(child);
      }
    });
    // Also aggregate all .footer-links.section (awards) inside rightCol if not already in content
    Array.from(rightCol.querySelectorAll('.footer-links.section')).forEach(section => {
      if (!rightCellContent.includes(section)) rightCellContent.push(section);
    });
    return rightCellContent;
  }

  const headerRow = ['Columns (columns22)'];
  const leftCol = getLeftColumn(element);
  const rightCol = getRightColumn(element);
  const tableRows = [headerRow, [leftCol, rightCol]];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
