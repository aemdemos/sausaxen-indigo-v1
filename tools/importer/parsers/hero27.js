/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the static-banner-section (robust to wrappers)
  const section = element.querySelector('section.static-banner-section');
  if (!section) return;
  
  // 2. Find the bckgrd-tupple (contains images and banner text)
  const tuple = section.querySelector('.bckgrd-tupple');
  if (!tuple) return;

  // 3. Get the first non-data:src image for background
  let bgImg = null;
  const imgs = tuple.querySelectorAll('img');
  for (const img of imgs) {
    if (img.src && !img.src.startsWith('data:')) {
      bgImg = img;
      break;
    }
  }

  // 4. Get .banner-content (contains headings, paragraph, cta, etc.)
  const bannerContent = tuple.querySelector('.banner-content');
  let contentCell;
  if (bannerContent) {
    // Only include children that have visible content
    let fragment = document.createDocumentFragment();
    for (const child of Array.from(bannerContent.children)) {
      if (child.textContent && child.textContent.trim().length > 0) {
        fragment.appendChild(child);
      }
    }
    contentCell = fragment.childNodes.length > 0 ? fragment : '';
  } else {
    contentCell = '';
  }

  // 5. Build the table rows per block spec
  const rows = [];
  rows.push(['Hero (hero27)']); // header row as in example
  rows.push([bgImg ? bgImg : '']); // image row
  rows.push([contentCell]); // content row (may be empty string)

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
