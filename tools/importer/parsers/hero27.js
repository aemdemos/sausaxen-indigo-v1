/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the background image: prefer the visible desktop image
  let imgEl = null;
  const bckgrdTupple = element.querySelector('.bckgrd-tupple');
  if (bckgrdTupple) {
    imgEl = bckgrdTupple.querySelector('img.xs-hidden') || bckgrdTupple.querySelector('img');
  }

  // Locate the banner content
  let contentCell = '';
  if (bckgrdTupple) {
    const contentDiv = bckgrdTupple.querySelector('.banner-content');
    if (contentDiv) {
      // If there's any child with non-empty content, include all children in the cell
      const hasNonEmpty = Array.from(contentDiv.children).some(
        (child) => child.textContent.trim().length > 0
      );
      if (hasNonEmpty) {
        contentCell = Array.from(contentDiv.children);
      } else if (contentDiv.textContent && contentDiv.textContent.trim().length > 0) {
        // If there is non-element text inside contentDiv
        contentCell = contentDiv.textContent.trim();
      }
    }
  }

  // Prepare table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentCell];
  const cells = [headerRow, imageRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
