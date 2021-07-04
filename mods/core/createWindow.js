/*
 * notion-enhancer
 * (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (c) 2020 TarasokUA
 * under the MIT license
 */

'use strict';

module.exports = (store, __exports) => {
  const electron = require('electron'),
    allWindows = () =>
      electron.BrowserWindow.getAllWindows().filter(
        (win) => win.getTitle() !== 'notion-enhancer menu'
      ),
    // createWindow = __exports.createWindow,
    path = require('path'),
    helpers = require('../../pkg/helpers.js');
  
  __exports.getIndexUrl = require(`${helpers
      .getNotionResources()
      .replace(/\\/g, '/')}/app/helpers/urlHelpers.js`).getIndexUrl;
  
  __exports.createWindow = function (relativeUrl, focused_window) {
    if (!relativeUrl) relativeUrl = '';
    const window_state = require(`${helpers
        .getNotionResources()
        .replace(/\\/g, '/')}/app/node_modules/electron-window-state/index.js`)(
        {
          defaultWidth: 1320,
          defaultHeight: 860,
        }
      ),
      rect = {
        x: window_state.x,
        y: window_state.y,
        width: window_state.width,
        height: window_state.height,
      };
    focused_window =
      focused_window || electron.BrowserWindow.getFocusedWindow();
    if (focused_window && !focused_window.isMaximized()) {
      rect.x = focused_window.getPosition()[0] + 20;
      rect.y = focused_window.getPosition()[1] + 20;
      rect.width = focused_window.getSize()[0];
      rect.height = focused_window.getSize()[1];
    }
    let window = new electron.BrowserWindow({
      show: false,
      backgroundColor: '#ffffff',
      titleBarStyle: 'hiddenInset',
      frame: !store().frameless,
      webPreferences: {
        preload: path.resolve(
          `${helpers.getNotionResources()}/app/renderer/index.js`
        ),
        webviewTag: true,
        session: electron.session.fromPartition('persist:notion'),
        enableRemoteModule: true,
      },
      ...rect,
    });
    window.once('ready-to-show', function () {
      if (
        !store().openhidden ||
        allWindows().some((win) => win.isVisible() && win.id != window.id)
      ) {
        window.show();
        window.focus();
        if (store().maximized) window.maximize();
        if (
          (focused_window && focused_window.isFullScreen()) ||
          window_state.isFullScreen
        )
          window.setFullScreen(true);
      }
    });
    let intended_quit = false;
    window.on('close', (e) => {
      if (intended_quit || !store().close_to_tray || allWindows().length > 1) {
        window_state.saveState(window);
        window = null;
      } else {
        e.preventDefault();
        window.hide();
      }
    });
    electron.app.on('before-quit', () => (intended_quit = true));
    window.loadURL(__exports.getIndexUrl(relativeUrl));
    return window;
  };
  return __exports.createWindow;
};
