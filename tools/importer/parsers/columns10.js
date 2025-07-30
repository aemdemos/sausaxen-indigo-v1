/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first desktop image inside a .carousel-image block
  function getFirstDesktopImg(container) {
    const desktopImgBlock = container.querySelector('.carousel-image--desktop img');
    if (desktopImgBlock) return desktopImgBlock;
    // fallback: first image in .carousel-image
    const anyImg = container.querySelector('.carousel-image img');
    return anyImg || null;
  }

  // Get left and right column containers
  const mainGrid = element.querySelector('.mokobara-days-three > .aem-Grid');
  if (!mainGrid) return;
  const mainCols = mainGrid.querySelectorAll(':scope > .aem-GridColumn');
  if (mainCols.length < 2) return;

  // LEFT COLUMN (big vertical image)
  // Find first .carousel-image--desktop img in left column
  const leftColImgs = mainCols[0].querySelectorAll('.carousel-image');
  let leftImg = null;
  for (const carousel of leftColImgs) {
    const img = getFirstDesktopImg(carousel);
    if (img) {
      leftImg = img;
      break;
    }
  }
  // left column cell: if image found, use it, else empty div
  const leftCell = document.createElement('div');
  if (leftImg) leftCell.appendChild(leftImg);

  // RIGHT COLUMN (2x2 grid of images)
  // The structure is 2 inner .aem-GridColumn > .aem-Grid > .aem-GridColumn each has a full-width-widget imagevideo
  // We want to get the two images (top right and bottom right) in order
  let rightImgs = [];
  // Right column has two main .aem-GridColumn children
  const rightOuterGrid = mainCols[1].querySelector(':scope > div > .aem-Grid');
  if (rightOuterGrid) {
    const rightRows = rightOuterGrid.querySelectorAll(':scope > .aem-GridColumn');
    for (const rowCol of rightRows) {
      // Each rowCol should have a .imagevideo .carousel-image
      const carouselBlocks = rowCol.querySelectorAll('.carousel-image');
      for (const carousel of carouselBlocks) {
        const img = getFirstDesktopImg(carousel);
        if (img) {
          rightImgs.push(img);
          break;
        }
      }
    }
  }
  // Defensive: only take up to 2 images
  rightImgs = rightImgs.slice(0,2);

  // Create a table for the block
  // Only one table is defined in the example, with a header: 'Columns (columns10)'
  // The main row is two columns: left big image, right two stacked images
  // We will stack the right images vertically in a div
  const rightCell = document.createElement('div');
  rightImgs.forEach(img => {
    rightCell.appendChild(img);
  });

  const cells = [
    ['Columns (columns10)'],
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
