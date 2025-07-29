/* global WebImporter */
export default function parse(element, { document }) {
  // Get the only direct child content div
  const contentDiv = element.querySelector(':scope > div');

  // Prepare the header row
  const headerRow = ['Columns (columns35)'];
  // Prepare the content row
  // Edge case: if contentDiv is missing, use an empty string
  const row = [contentDiv || ''];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);

  // Replace the element
  element.replaceWith(table);
}
