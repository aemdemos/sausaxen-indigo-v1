/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match the block name exactly
  const headerRow = ['Hero (hero26)'];

  // Row 2: Background image (none present in this example)
  const backgroundRow = [''];

  // Row 3: Content (title, subheading, CTA)
  // Find all direct children columns
  const cols = element.querySelectorAll(':scope > div');

  let content = [];
  // Get column with h2 and subheading (generally col-md-10 or col-9)
  let textCol = null;
  for (const col of cols) {
    if (col.querySelector('h2')) {
      textCol = col;
      break;
    }
  }
  if (textCol) {
    const h2 = textCol.querySelector('h2');
    if (h2 && h2.textContent.trim()) {
      content.push(h2);
    }
    // subheading: in this HTML it's a <p> inside an <a>, but is empty in this example
    const subhead = textCol.querySelector('a > p');
    if (subhead && subhead.textContent.trim()) {
      content.push(subhead);
    }
  }

  // Get CTA if present (typically in col-md-2)
  let ctaCol = null;
  for (const col of cols) {
    if (col.querySelector('a.view-all-cta')) {
      ctaCol = col;
      break;
    }
  }
  if (ctaCol) {
    const cta = ctaCol.querySelector('a.view-all-cta');
    if (cta && cta.textContent.trim()) {
      content.push(cta);
    }
  }

  // Always provide a single cell (can be empty if no content)
  const contentRow = [content];

  // Assemble table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
