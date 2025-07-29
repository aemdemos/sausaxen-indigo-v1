/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the main .cmp-embed block inside the parent element
  const embedDiv = element.querySelector('.cmp-embed');

  // Table rows: header, background image (empty), content (embed block)
  const rows = [
    ['Hero (hero23)'],      // Header row must match exactly
    [''],                  // Background image row, left empty (no image in source)
    [embedDiv]             // Content row: reference to the .cmp-embed element itself
  ];

  // Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
