/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to reference original image element
  function getReferencedImg(img) {
    return img;
  }

  // Find all slides (siblings with getinspiredbanner, or just the element)
  let allSlides = [];
  if (element.classList.contains('getinspiredbanner')) {
    const parent = element.parentNode;
    if (parent) {
      const siblings = Array.from(parent.children).filter(e => e.classList && e.classList.contains('getinspiredbanner'));
      if (siblings.length > 1) {
        allSlides = siblings;
      } else {
        allSlides = [element];
      }
    } else {
      allSlides = [element];
    }
  } else {
    allSlides = [element];
  }

  const slides = [];
  for (const slideElem of allSlides) {
    // First column: image (mandatory)
    const picture = slideElem.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    const imgEl = getReferencedImg(img);

    // Second column: text content
    // Title from .dest-basic h2 (use the original h2 if exists)
    const h2 = slideElem.querySelector('.dest-basic h2');
    // Description from .info-container .text-pagination p
    const descP = slideElem.querySelector('.info-container .text-pagination p');
    // CTA from .getinspired-blck a.booknow-getins (use data-path as href)
    let ctaEl = null;
    const bookNowBtn = slideElem.querySelector('.getinspired-blck a.booknow-getins');
    if (bookNowBtn && bookNowBtn.getAttribute('data-path')) {
      ctaEl = document.createElement('a');
      ctaEl.href = bookNowBtn.getAttribute('data-path');
      ctaEl.textContent = bookNowBtn.textContent.trim();
    }
    const contentParts = [];
    if (h2) contentParts.push(h2);
    if (descP) contentParts.push(descP);
    if (ctaEl) contentParts.push(ctaEl);
    slides.push([
      imgEl,
      contentParts.length > 0 ? contentParts : ''
    ]);
  }

  // Header row: single cell, must match example (spans two columns in rendering, but is a single cell)
  const cells = [
    ['Carousel'],
    ...slides
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace all slides with the new table
  if (allSlides.length > 1) {
    allSlides[0].parentNode.insertBefore(table, allSlides[0]);
    allSlides.forEach(slide => slide.remove());
  } else {
    element.replaceWith(table);
  }
}
