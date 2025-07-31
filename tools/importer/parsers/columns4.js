/* global WebImporter */
export default function parse(element, { document }) {
  // Find the '.row' containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all direct column divs
  const cols = Array.from(row.children).filter(child => child.classList.contains('col-12'));

  // For each column, extract the main content, preserving structure
  const cells = cols.map(col => {
    if (col.querySelector('.ig-content-blck.contact-phone-opt')) {
      const icon = col.querySelector('.ig-icon-blck');
      const content = col.querySelector('.ig-content-blck.contact-phone-opt');
      const callNum = col.querySelector('.callTonumber-block');
      const arr = [icon, content, callNum].filter(Boolean);
      return arr;
    }
    const feedback = col.querySelector('a.contact-email-opt');
    if (feedback) return feedback;
    const chat = col.querySelector('a.contact-us-contact-option-chat');
    if (chat) return chat;
    return col;
  });

  // Correct header row: a single cell (one column)
  const headerRow = ['Columns (columns4)'];
  // Compose block table: first row is header (1 cell), second is cells (N columns)
  const tableRows = [headerRow, cells];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
