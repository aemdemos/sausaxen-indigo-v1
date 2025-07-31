/* global WebImporter */
export default function parse(element, { document }) {
  // The structure is a two-column layout:
  // Left: main content (title, bullets, button)
  // Right: a 2x2 grid of images
  // We'll build a 2-row, 2-column table, matching the example screenshot.

  // Find the main grid containing the two columns
  const mainGrid = element.querySelector('.mokobara-days-three > .aem-Grid');
  if (!mainGrid) return;

  // Get the immediate columns
  const gridCols = Array.from(mainGrid.querySelectorAll(':scope > div'));
  // Defensive: must be at least two columns
  const leftCol = gridCols[0];
  const rightCol = gridCols[1];

  // --- LEFT COLUMN (text content) ---
  // We extract all content blocks: title, bullet list, and button if present
  let leftContent = [];
  if (leftCol) {
    // Find nested grid: where the content blocks actually are
    const nestedGrid = leftCol.querySelector('.aem-Grid');
    if (nestedGrid) {
      // Typically: title, ul, button (assumption based on example)
      // Let's get all direct children (likely each is a block)
      const items = Array.from(nestedGrid.children);
      // We'll append all found meaningful content
      items.forEach((item) => {
        // If item contains <img>, skip (left side is text only)
        if (item.querySelector('img')) return;
        // For each item, append all its content nodes
        Array.from(item.childNodes).forEach((n) => {
          // Only keep significant nodes
          if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) {
            leftContent.push(n);
          }
        });
      });
    }
  }

  // Fallback: if nothing found, leave cell empty
  if (leftContent.length === 0) leftContent = [''];

  // --- RIGHT COLUMN (images) ---
  // We want a 2x2 grid of images, top: (img1, img2), bottom: (img3, img4)
  // The right column contains two main sub-columns: each of which contains one (or more) .imagevideo blocks with images
  let rightInnerCols = [];
  if (rightCol) {
    const rightGrid = rightCol.querySelector('.aem-Grid');
    if (rightGrid) {
      rightInnerCols = Array.from(rightGrid.querySelectorAll(':scope > div'));
    }
  }

  // For each right subcol, collect its images
  let rightImgs = [];
  rightInnerCols.forEach((subcol) => {
    // Each subcol has its own grid
    const subGrid = subcol.querySelector('.aem-Grid');
    if (subGrid) {
      // Get all .imagevideo blocks under this subcol
      const imgBlocks = Array.from(subGrid.querySelectorAll('.imagevideo'));
      imgBlocks.forEach((iv) => {
        // Prefer desktop version
        const desktop = iv.querySelector('.carousel-image--desktop img');
        if (desktop) rightImgs.push(desktop);
        else {
          // fallback to any image
          const anyImg = iv.querySelector('img');
          if (anyImg) rightImgs.push(anyImg);
        }
      });
    }
  });

  // Defensive: Only take 4 images; if less, fill with empty
  rightImgs = rightImgs.slice(0, 4);
  while (rightImgs.length < 4) rightImgs.push('');

  // Compose the table rows
  const headerRow = ['Columns (columns10)', ''];
  const row1 = [leftContent, [rightImgs[0], rightImgs[1]]];
  const row2 = ['', [rightImgs[2], rightImgs[3]]];

  // Make the table
  const cells = [headerRow, row1, row2];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
