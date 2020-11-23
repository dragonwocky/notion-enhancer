/*
 * outliner
 * (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (c) 2020 CloudHill
 * under the MIT license
 */

'use strict';

const { createElement } = require("../../pkg/helpers");

module.exports = (store) => {    
  function initOutliner() {
    // Find headers when switching panels
    if (document.querySelector('.notion-page-content')) {
      startContentObserver();
    };

    // Observe for page changes
    const pageObserver = new MutationObserver((list, observer) => {
      for ( let { addedNodes } of list) {
        if (addedNodes[0]) {
          if (addedNodes[0].className === 'notion-page-content') {
            startContentObserver();
          }
          // Clear outline on database pages
          else if (addedNodes[0].className === 'notion-scroller') {
            contentObserver.disconnect();
            const outline = document.querySelector('.outliner');
            if (outline) outline.textContent = '';
          }
        } 
      }
    });
    pageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // Observe for header changes
    const contentObserver = new MutationObserver((list, observer) => {
      list.forEach(m => {
        if (
          (
            m.type === 'childList' &&
            (
              isHeaderElement(m.target) ||
              isHeaderElement(m.addedNodes[0]) ||
              isHeaderElement(m.removedNodes[0])
            )
          ) ||
          (
            m.type === 'characterData' &&
            isHeaderElement(m.target.parentElement)
          )
        ) findHeaders();
      })
    });
    function startContentObserver() {
      findHeaders();
      contentObserver.disconnect();
      contentObserver.observe(
        document.querySelector('.notion-page-content'),
        {
          childList: true,
          subtree: true,
          characterData: true,
        }
      );
    }
  }

  function findHeaders() {
    const outline = document.querySelector('.outliner');
    if (!outline) {
      pageObserver.disconnect();
      observer.disconnect();
    }
    outline.textContent = '';

    const pageContent = document.querySelector('.notion-page-content');
    const headerBlocks = pageContent.querySelectorAll('[class*="header-block"]');
    
    headerBlocks.forEach(block => {
      const blockId = block.dataset.blockId.replace(/-/g, '');
      const placeholder = block.querySelector('[placeholder]').getAttribute('placeholder');
      const header = createElement(`
        <div class="outline-header ${block.classList[1]}">
          <a href="${window.location.pathname}#${blockId}"
            placeholder="${placeholder}">${block.innerText}</a>
        </div>
      `);

      outline.append(header);
    })
  }

  function isHeaderElement(el) {
    let placeholder;
    if (el) {
      if (
        el.querySelector && 
        el.querySelector('[placeholder]')
      ) {
        placeholder = el.querySelector('[placeholder]').getAttribute('placeholder')
      } else if (el.getAttribute) {
        placeholder = el.getAttribute('placeholder');
      } 
    }
    if (!placeholder) placeholder = '';
    return placeholder.includes('Heading');
  }

  return initOutliner;
}