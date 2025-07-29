/* global WebImporter */
export default function parse(element, { document }) {
  // According to the example, the block is a single column table with the header 'Columns (columns36)'
  // The content row should include the content block (the heading in this case)

  // Find the inner content (the .cmp-text container)
  // Reference the existing element, not clone
  let contentElem = element.querySelector('.cmp-text');
  // Fallback if .cmp-text is missing: use the whole element
  if (!contentElem) contentElem = element;

  const headerRow = ['Columns (columns36)'];
  const contentRow = [contentElem];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}