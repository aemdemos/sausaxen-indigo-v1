/* global WebImporter */
export default function parse(element, { document }) {
  // The filter bar visually corresponds to a 2x2 column block for columns25
  // We'll group the main child divs of the filter bar into two columns per row (grid 2x2)

  // Get direct children that are columns
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: ensure enough columns; fill with empty div if not
  while (children.length < 4) {
    const emptyDiv = document.createElement('div');
    children.push(emptyDiv);
  }

  // columns[0]: One Way
  // columns[1]: Pax select
  // columns[2]: Special Fare
  // columns[4]: Currency
  // (columns[3] is promocode and is empty in sample, we'll skip)
  const col1 = children[0];
  const col2 = children[1];
  const col3 = children[2];
  const col4 = children[4] || document.createElement('div');

  // 2x2 grid
  const headerRow = ['Columns (columns25)'];
  const row1 = [col1, col2];
  const row2 = [col3, col4];

  const cells = [headerRow, row1, row2];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
