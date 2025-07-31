/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract text from a node, ignoring <i> icons
  function getTitleText(node) {
    let text = '';
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent.trim() + ' ';
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'I') {
        text += child.textContent.trim() + ' ';
      }
    });
    return text.trim();
  }

  // Helper: Remove dummy 'Read more' links from a container
  function cleanContent(contentEl) {
    if (!contentEl) return '';
    // Remove dummy links
    contentEl.querySelectorAll('a[href="javascript:void(0)"]').forEach(a => a.remove());
    // Remove empty paragraphs
    contentEl.querySelectorAll('p').forEach(p => {
      if (!p.textContent.trim()) p.remove();
    });
    // If only one child, return that child; otherwise, return the container itself
    if (contentEl.childNodes.length === 1) {
      return contentEl.firstChild;
    }
    return contentEl;
  }

  // Main extraction: get all accordion items in order
  const rows = [];

  // 1. FAQ sidebar accordion groups (categories)
  const sidebar = element.querySelector('.faq-sidebar-iframe');
  if (sidebar) {
    // Handle all category accordion groups
    sidebar.querySelectorAll('.faq-sb-acc-group').forEach(group => {
      // Each group may have multiple .faq-sb-acc-content (one per item)
      group.querySelectorAll('.faq-sb-acc-content').forEach(acc => {
        // Title: inside .faq-sb-inner-content > a.faq-sb-acc-heading
        const accInner = acc.querySelector('.faq-sb-inner-content > a.faq-sb-acc-heading');
        let title = '';
        if (accInner) {
          title = getTitleText(accInner);
        }
        // Content: .faq-acc-inner-content (as element, cleaned)
        const contentDiv = acc.querySelector('.faq-acc-inner-content');
        let content = null;
        if (contentDiv) {
          // Reference the existing element (don't clone) by moving it out
          content = cleanContent(contentDiv);
        }
        // Only push if there is a title
        if (title) {
          rows.push([title, content]);
        }
      });
    });

    // 2. Top Questions (in .faq-sb-acc-group.faq-top-queries)
    const topQueries = sidebar.querySelector('.faq-sb-acc-group.faq-top-queries');
    if (topQueries) {
      topQueries.querySelectorAll('.faq-sb-heading').forEach(hd => {
        const a = hd.querySelector('a.faq-sb-acc-heading');
        let title = '';
        if (a) title = getTitleText(a);
        const contentDiv = hd.querySelector('.faq-acc-inner-content');
        let content = null;
        if (contentDiv) {
          content = cleanContent(contentDiv);
        }
        if (title) {
          rows.push([title, content]);
        }
      });
    }
  }

  // Compose table for Accordion (accordion20)
  const header = ['Accordion (accordion20)'];
  const table = [header, ...rows];
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
