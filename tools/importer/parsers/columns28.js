/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all non-empty children (text or element) from a parent
  function getNonEmptyChildren(parent) {
    return Array.from(parent.childNodes).filter(n => {
      if (n.nodeType === 3) return n.textContent.trim().length > 0;
      if (n.nodeType === 1) return n.textContent.trim().length > 0 || n.querySelector('img');
      return false;
    });
  }
  // Columns 1-3: Get nav columns from the accordion
  const accordion = element.querySelector('#footer-accordion');
  let columns = [];
  if (accordion) {
    const colDivs = Array.from(accordion.querySelectorAll(':scope > .col-md-3.ig-acc-sitemap')).slice(0, 3);
    colDivs.forEach(col => {
      // For each column, get all non-empty children (including headings, lists, buttons)
      const colChildren = getNonEmptyChildren(col);
      columns.push(colChildren.length === 1 ? colChildren[0] : colChildren);
    });
  }
  // Column 4: Social, download, awards
  const rightColParts = [];
  const socialDownloads = element.querySelector('.col-lg-3.social-downloads');
  if (socialDownloads) {
    // Grab all meaningful children for social/download section
    const socialBits = getNonEmptyChildren(socialDownloads);
    rightColParts.push(...socialBits);
    // Also grab .footer-links.section with heading "Our Awards" from same .row
    const row = socialDownloads.closest('.row');
    if (row) {
      const awardsSection = Array.from(row.querySelectorAll('.footer-links.section')).find(sec => sec.querySelector('h6') && sec.querySelector('h6').textContent.toLowerCase().includes('awards'));
      if (awardsSection) {
        const h6s = Array.from(awardsSection.querySelectorAll('h6')).filter(h6 => h6.textContent.trim());
        const awardsList = awardsSection.querySelector('ul');
        if (h6s.length) rightColParts.push(...h6s);
        if (awardsList) rightColParts.push(awardsList);
      }
    }
  }
  columns.push(rightColParts.length === 1 ? rightColParts[0] : rightColParts);
  // Compose the table with a one-cell header row, and a data row with N columns
  const header = ['Columns (columns28)'];
  const cells = [header, columns];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set correct colspan for the single th
  const thRow = table.querySelector('tr');
  const th = thRow ? thRow.querySelector('th') : null;
  if (th) {
    th.setAttribute('colspan', columns.length);
  }
  element.replaceWith(table);
}
