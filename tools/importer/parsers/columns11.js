/* global WebImporter */
export default function parse(element, { document }) {
  // Find the three accordion columns
  const accordionColumns = Array.from(element.querySelectorAll('.container__links__item'));
  // Find the social links block (fourth column)
  const socialLinks = element.querySelector('.social-links');

  // Helper function to extract title and links from each accordion column
  function extractAccordionContent(accordion) {
    // The column title
    const button = accordion.querySelector('button.cmp-accordion__button');
    let titleText = '';
    if (button) {
      // Remove the chevron icon
      const btnClone = button.cloneNode(true);
      const icon = btnClone.querySelector('i');
      if (icon) btnClone.removeChild(icon);
      titleText = btnClone.textContent.trim();
    }
    // The child links list (ul)
    const ul = accordion.querySelector('ul.child-links');
    let linksUl = null;
    if (ul) {
      linksUl = ul;
    }
    // Combine title and links
    const container = document.createElement('div');
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      container.appendChild(heading);
    }
    if (linksUl) {
      container.appendChild(linksUl);
    }
    return container;
  }

  // Helper to build the Social column
  function extractSocialContent(socialLinks) {
    const col = document.createElement('div');
    // Social section
    const h3s = socialLinks.querySelectorAll('h3');
    const waBlocks = socialLinks.querySelectorAll('.social-links__whatsappSupport');
    const socialTitle = h3s[0];
    if (socialTitle) {
      const hTitle = document.createElement('strong');
      hTitle.textContent = socialTitle.textContent;
      col.appendChild(hTitle);
    }
    // Social icons
    const socialList = socialLinks.querySelector('ul.social-links__media');
    if (socialList) {
      col.appendChild(socialList);
    }
    // WhatsApp support (first)
    if (waBlocks.length > 0) {
      const wa1 = waBlocks[0].querySelector('ul');
      if (wa1) col.appendChild(wa1);
    }
    // Download section
    if (h3s[1]) {
      col.appendChild(document.createElement('br'));
      const hDownload = document.createElement('strong');
      hDownload.textContent = h3s[1].textContent;
      col.appendChild(hDownload);
    }
    if (waBlocks.length > 1) {
      const wa2 = waBlocks[1].querySelector('ul');
      if (wa2) col.appendChild(wa2);
    }
    // Our Awards section
    if (h3s[2]) {
      col.appendChild(document.createElement('br'));
      const hAwards = document.createElement('strong');
      hAwards.textContent = h3s[2].textContent;
      col.appendChild(hAwards);
    }
    if (waBlocks.length > 2) {
      const wa3 = waBlocks[2].querySelector('ul');
      if (wa3) col.appendChild(wa3);
    }
    return col;
  }

  // Build the columns array
  const contentRow = [
    ...accordionColumns.map(col => extractAccordionContent(col)),
    extractSocialContent(socialLinks)
  ];

  // Header row must have the same number of columns as columns, with only the first cell holding the header, others empty
  const headerRow = ["Columns (columns11)"];
  while (headerRow.length < contentRow.length) {
    headerRow.push("");
  }

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
