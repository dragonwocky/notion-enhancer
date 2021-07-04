/*
 * notion-enhancer
 * (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (c) 2020 TarasokUA
 * under the MIT license
 */

'use strict';

module.exports = (store, __exports) => {
  const electron = require('electron'),
    helpers = require('../../pkg/helpers.js'),
    notionIpc = require(`${helpers
      .getNotionResources()
      .replace(/\\/g, '/')}/app/helpers/notionIpc.js`),
    { toKeyEvent } = require('keyboardevent-from-electron-accelerator'),
    tabsEnabled = (store('mods')['e1692c29-475e-437b-b7ff-3eee872e1a42'] || {})
      .enabled;

  document.defaultView.addEventListener('keyup', (event) => {
    // additional hotkeys
    if (event.key === 'F5') location.reload();
    // open menu on hotkey toggle
    if (store().menu_toggle) {
      const hotkey = {
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        ...toKeyEvent(store().menu_toggle),
      };
      let triggered = true;
      for (let prop in hotkey)
        if (
          hotkey[prop] !== event[prop] &&
          !(prop === 'key' && event[prop] === 'Dead')
        )
          triggered = false;
      if (triggered) electron.ipcRenderer.send('enhancer:open-menu');
    }
    if (tabsEnabled) {
      const tabStore = () => store('e1692c29-475e-437b-b7ff-3eee872e1a42');
      if (tabStore().select_modifier) {
        // switch between tabs via key modifier
        const select_tab_modifier = {
          ctrlKey: false,
          metaKey: false,
          altKey: false,
          shiftKey: false,
          ...toKeyEvent(tabStore().select_modifier),
        };
        let triggered = true;
        for (let prop in select_tab_modifier)
          if (select_tab_modifier[prop] !== event[prop]) triggered = false;
        if (
          triggered &&
          [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'ArrowRight',
            'ArrowLeft',
          ].includes(event.key)
        )
          electron.ipcRenderer.sendToHost('enhancer:select-tab', event.key);
      }
      if (tabStore().new_tab) {
        // create/close tab keybindings
        const new_tab_keybinding = {
          ctrlKey: false,
          metaKey: false,
          altKey: false,
          shiftKey: false,
          ...toKeyEvent(tabStore().new_tab),
        };
        let triggered = true;
        for (let prop in new_tab_keybinding)
          if (new_tab_keybinding[prop] !== event[prop]) triggered = false;
        if (triggered) electron.ipcRenderer.sendToHost('enhancer:new-tab');
      }
      if (tabStore().close_tab) {
        const close_tab_keybinding = {
          ctrlKey: false,
          metaKey: false,
          altKey: false,
          shiftKey: false,
          ...toKeyEvent(tabStore().close_tab),
        };
        let triggered = true;
        for (let prop in close_tab_keybinding)
          if (close_tab_keybinding[prop] !== event[prop]) triggered = false;
        if (triggered) electron.ipcRenderer.sendToHost('enhancer:close-tab');
      }
    }
  });

  const attempt_interval = setInterval(enhance, 500);
  async function enhance() {
    if (
      !document.querySelector('.notion-frame') ||
      !document.querySelector('.notion-sidebar') ||
      !document.querySelector('.notion-topbar > div[style*="display: flex"]')
    )
      return;
    clearInterval(attempt_interval);

    // frameless
    if (store().frameless && !store().tiling_mode && !tabsEnabled) {
      document.body.classList.add('frameless');
      // draggable area
      document
        .querySelector('.notion-topbar')
        .prepend(helpers.createElement('<div class="window-dragarea"></div>'));
    }

    // window buttons
    if (!tabsEnabled) {
      const buttons = require('./buttons.js')(store);
      document
        .querySelector('.notion-topbar > div[style*="display: flex"]')
        .appendChild(buttons.element);
    }
    document
      .querySelector('.notion-history-back-button')
      .parentElement.nextElementSibling.classList.add(
        'notion-topbar-breadcrumb'
      );
    document
      .querySelector('.notion-topbar-share-menu')
      .parentElement.classList.add('notion-topbar-actions');

    const getStyle = (prop) =>
      getComputedStyle(
        document.querySelector('.notion-app-inner')
      ).getPropertyValue(prop);

    // external theming
    document.defaultView.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        notionIpc.sendNotionToIndex('search:set-theme', {
          'mode': document.querySelector('.notion-dark-theme')
            ? 'dark'
            : 'light',
          'colors': {
            'white': getStyle('--theme--option_active-color'),
            'blue': getStyle('--theme--option_active-background'),
          },
          'borderRadius': 3,
          'textColor': getStyle('--theme--text'),
          'popoverBackgroundColor': getStyle('--theme--card'),
          'popoverBoxShadow': getStyle('--theme--box-shadow_strong'),
          'inputBoxShadow': `box-shadow: ${getStyle(
            `--theme--primary`
          )} 0px 0px 0px 1px inset, ${getStyle(
            `--theme--primary_hover`
          )} 0px 0px 0px 2px !important`,
          'inputBackgroundColor': getStyle('--theme--main'),
          'dividerColor': getStyle('--theme--table-border'),
          'shadowOpacity': 0.2,
        });
      }
    });

    function setAppTheme() {
      const theme = document.querySelector('.notion-dark-theme')
        ? 'dark'
        : 'light';
      electron.ipcRenderer.send('enhancer:set-app-theme', theme);
    }
    setAppTheme();
    new MutationObserver(setAppTheme).observe(
      document.querySelector('.notion-app-inner'),
      { attributes: true }
    );
    electron.ipcRenderer.on('enhancer:get-app-theme', setAppTheme);

    if (tabsEnabled) {
      let tab_title = { img: '', emoji: '', text: '' };
      if (process.platform === 'darwin')
        document
          .querySelector('.notion-sidebar [style*="37px"]:empty')
          .remove();
      const TITLE_OBSERVER = new MutationObserver(() =>
        __electronApi.setWindowTitle('notion.so')
      );
      __electronApi.setWindowTitle = (title) => {
        const $container =
            document.querySelector(
              '.notion-peek-renderer [style="padding-left: calc(126px + env(safe-area-inset-left)); padding-right: calc(126px + env(safe-area-inset-right)); max-width: 100%; width: 100%;"]'
            ) ||
            document.querySelector(
              '.notion-frame [style="padding-left: calc(96px + env(safe-area-inset-left)); padding-right: calc(96px + env(safe-area-inset-right)); max-width: 100%; margin-bottom: 8px; width: 100%;"]'
            ) ||
            document.querySelector('.notion-peek-renderer') ||
            document.querySelector('.notion-frame'),
          icon = $container.querySelector(
            '.notion-record-icon img:not([src^="data:"])'
          ),
          img =
            icon && icon.getAttribute('src')
              ? `<img src="${
                  icon.getAttribute('src').startsWith('/')
                    ? 'notion://www.notion.so'
                    : ''
                }${icon.getAttribute('src')}">`
              : '',
          emoji = icon ? icon.getAttribute('aria-label') : '';
        let text = $container.querySelector('[placeholder="Untitled"]');
        text = text
          ? text.innerText || 'Untitled'
          : [
              setTimeout(() => __electronApi.setWindowTitle(title), 250),
              title,
            ][1];
        TITLE_OBSERVER.disconnect();
        TITLE_OBSERVER.observe($container, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
        });
        if (
          tab_title.img !== img ||
          tab_title.emoji !== emoji ||
          tab_title.text !== text
        ) {
          tab_title = {
            img,
            emoji,
            text,
          };
          electron.ipcRenderer.sendToHost('enhancer:set-tab-title', tab_title);
        }
      };
      __electronApi.openInNewWindow = (urlPath) => {
        electron.ipcRenderer.sendToHost(
          'enhancer:new-tab',
          `notion://www.notion.so${urlPath}`
        );
      };
    } else if (store().frameless && !store().tiling_mode) {
      let sidebar_width;
      function setSidebarWidth(list) {
        const new_sidebar_width =
          list[0].target.style.height === 'auto'
            ? '0px'
            : list[0].target.style.width;
        if (new_sidebar_width !== sidebar_width) {
          sidebar_width = new_sidebar_width;
          electron.ipcRenderer.sendToHost(
            'enhancer:sidebar-width',
            sidebar_width
          );
        }
      }
      new MutationObserver(setSidebarWidth).observe(
        document.querySelector('.notion-sidebar'),
        { attributes: true }
      );
      setSidebarWidth([{ target: document.querySelector('.notion-sidebar') }]);
    }
  }
};
