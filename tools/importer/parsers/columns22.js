/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid containing columns
  const grid = element.querySelector('.mokobara-days-three > .aem-Grid');
  if (!grid) return;
  
  // Get exactly two columns (left and right)
  const cols = Array.from(grid.querySelectorAll(':scope > .genericcontainer'));
  if (cols.length < 2) return;

  // -------- LEFT COLUMN ---------
  // Look for the first img in left column (desktop preferred)
  let leftImg = null;
  const leftImgWrap = cols[0].querySelector('.carousel-image');
  if (leftImgWrap) {
    const desktopImg = leftImgWrap.querySelector('.carousel-image--desktop img');
    leftImg = desktopImg ? desktopImg : leftImgWrap.querySelector('img');
  }

  // --------- RIGHT COLUMN (is a two-row stack of images) ---------
  // There are two genericcontainer children inside the right column
  const rightGenericContainers = Array.from(
    cols[1].querySelectorAll(':scope > div > .aem-Grid > .genericcontainer')
  );

  let rightImages = [];
  for (let rightCol of rightGenericContainers) {
    // Each rightCol should have one image
    const imgWrap = rightCol.querySelector('.carousel-image');
    if (imgWrap) {
      const desktopImg = imgWrap.querySelector('.carousel-image--desktop img');
      rightImages.push(desktopImg ? desktopImg : imgWrap.querySelector('img'));
    }
  }
  // Always ensure there are two columns in this row, so pad with null if missing
  while (rightImages.length < 2) rightImages.push('');

  // Compose the table: header row, then a single row with 3 columns
  const headerRow = ['Columns (columns22)', '', ''];
  const row = [leftImg, rightImages[0], rightImages[1]];
  const cells = [headerRow, row];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
