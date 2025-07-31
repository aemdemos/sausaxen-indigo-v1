/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the .getinspired-blck block (image/title/cta)
  const getinspiredBlck = element.querySelector('.getinspired-blck');
  // Helper: Find the .dest-city-info block (text/description)
  const destCityInfo = element.querySelector('.dest-city-info');

  // 1. IMAGE: always in .getinspired-blck > picture > img
  let img = null;
  if (getinspiredBlck) {
    const picture = getinspiredBlck.querySelector('picture');
    if (picture) {
      img = picture.querySelector('img');
    }
  }

  // 2. TITLE: in .getinspired-blck > .dest-basic > h2
  let titleEl = null;
  if (getinspiredBlck) {
    const basic = getinspiredBlck.querySelector('.dest-basic');
    if (basic) {
      const h2 = basic.querySelector('h2');
      if (h2) {
        // Use existing element reference
        titleEl = h2;
      }
    }
  }

  // 3. CTA: in .getinspired-blck > a.btn[data-path] (Book Now)
  let ctaEl = null;
  if (getinspiredBlck) {
    const cta = getinspiredBlck.querySelector('a.btn[data-path]');
    if (cta) {
      // Create a new link element with the correct href and text
      ctaEl = document.createElement('a');
      ctaEl.href = cta.getAttribute('data-path');
      ctaEl.textContent = cta.textContent.trim();
    }
  }

  // 4. DESCRIPTION: in .dest-city-info .textblock p (may contain links)
  let descEl = null;
  if (destCityInfo) {
    const desc = destCityInfo.querySelector('.textblock p');
    if (desc) {
      // Create a new <p> containing text and links, but remove any trailing "Read More" links
      const p = document.createElement('p');
      // Clone child nodes except any trailing link named "Read More"
      desc.childNodes.forEach(node => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName === 'A' &&
          /Read More/i.test(node.textContent)
        ) {
          // skip
        } else {
          p.appendChild(node.cloneNode(true)); // safe clone
        }
      });
      // Remove trailing whitespace or &nbsp; if present
      p.innerHTML = p.innerHTML.replace(/(&nbsp;|\s)+$/, '');
      // Only add if there's any content
      if (p.innerHTML.trim()) {
        descEl = p;
      }
    }
  }

  // Compose right cell content, in order: title, description, CTA
  const rightCell = [];
  if (titleEl) rightCell.push(titleEl);
  if (descEl) rightCell.push(descEl);
  if (ctaEl) rightCell.push(document.createElement('br'), ctaEl);

  // Build the table: Header, then [img, rightCell]
  const rows = [
    ['Carousel'],
    [img, rightCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
