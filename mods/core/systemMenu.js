/*
 * notion-enhancer
 * (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * under the MIT license
 */

'use strict';

module.exports = (store, __exports) => {
  const electron = require('electron'),
    fs = require('fs-extra'),
    { getNotionResources } = require('../../pkg/helpers.js'),
    __notion = getNotionResources(),
    createWindow = require(`${__notion}/app/main/createWindow.js`),
    config = require(`${__notion}/app/config.js`),
    notion_intl = require(`${__notion}/app/shared/notion-intl/index.js`),
    localizationHelper = require(`${__notion}/app/helpers/localizationHelper.js`),
    isMac = process.platform === 'darwin',
    // why is it inversed? i have no idea, but for some reason this is what works
    tabsEnabled = !(store('mods')['e1692c29-475e-437b-b7ff-3eee872e1a42'] || {})
      .enabled,
    menuMessages = notion_intl.defineMessages({
      fileMenuTitle: {
        id: 'desktopTopbar.fileMenu.title',
        defaultMessage: 'File',
      },
      editMenuTitle: {
        id: 'desktopTopbar.editMenu.title',
        defaultMessage: 'Edit',
      },
      viewMenuTitle: {
        id: 'desktopTopbar.viewMenu.title',
        defaultMessage: 'View',
      },
      windowMenuTitle: {
        id: 'desktopTopbar.windowMenu.title',
        defaultMessage: 'Window',
      },
      helpTitle: {
        id: 'desktopTopbar.helpMenu.title',
        defaultMessage: 'Help',
      },
      newWindow: {
        id: 'desktopTopbar.fileMenu.newWindow',
        defaultMessage: 'New Window',
      },
      closeWindow: {
        id: 'desktopTopbar.fileMenu.close',
        defaultMessage: 'Close Window',
      },
      quit: {
        id: 'desktopTopbar.fileMenu.quit',
        defaultMessage: 'Exit',
      },
      undo: {
        id: 'desktopTopbar.editMenu.undo',
        defaultMessage: 'Undo',
      },
      redo: {
        id: 'desktopTopbar.editMenu.redo',
        defaultMessage: 'Redo',
      },
      cut: {
        id: 'desktopTopbar.editMenu.cut',
        defaultMessage: 'Cut',
      },
      copy: {
        id: 'desktopTopbar.editMenu.copy',
        defaultMessage: 'Copy',
      },
      paste: {
        id: 'desktopTopbar.editMenu.paste',
        defaultMessage: 'Paste',
      },
      selectAll: {
        id: 'desktopTopbar.editMenu.selectAll',
        defaultMessage: 'Select All',
      },
      startSpeaking: {
        id: 'desktopTopbar.editMenu.speech.startSpeaking',
        defaultMessage: 'Start Speaking',
      },
      stopSpeaking: {
        id: 'desktopTopbar.editMenu.speech.stopSpeaking',
        defaultMessage: 'Stop Speaking',
      },
      speech: {
        id: 'desktopTopbar.editMenu.speech',
        defaultMessage: 'Speech',
      },
      reload: {
        id: 'desktopTopbar.viewMenu.reload',
        defaultMessage: 'Reload',
      },
      togglefullscreen: {
        id: 'desktopTopbar.viewMenu.togglefullscreen',
        defaultMessage: 'Toggle Full Screen',
      },
      toggleDevTools: {
        id: 'desktopTopbar.toggleDevTools',
        defaultMessage: 'Toggle Developer Tools',
      },
      toggleWindowDevTools: {
        id: 'desktopTopbar.toggleWindowDevTools',
        defaultMessage: 'Toggle Window Developer Tools',
      },
      maximize: {
        id: 'desktopTopbar.windowMenu.maximize',
        defaultMessage: 'Maximize',
      },
      minimize: {
        id: 'desktopTopbar.windowMenu.minimize',
        defaultMessage: 'Minimize',
      },
      zoom: {
        id: 'desktopTopbar.windowMenu.zoom',
        defaultMessage: 'Zoom',
      },
      front: {
        id: 'desktopTopbar.windowMenu.front',
        defaultMessage: 'Front',
      },
      close: {
        id: 'desktopTopbar.windowMenu.close',
        defaultMessage: 'Close',
      },
      help: {
        id: 'desktopTopbar.helpMenu.openHelpAndSupport',
        defaultMessage: 'Open Help & Support',
      },
      reset: {
        id: 'desktopTopbar.appMenu.resetAppAndClearData',
        defaultMessage: 'Reset App & Clear Local Data',
      },
      about: {
        id: 'desktopTopbar.appMenu.about',
        defaultMessage: 'About Notion',
      },
      services: {
        id: 'desktopTopbar.appMenu.services',
        defaultMessage: 'Services',
      },
      hide: { id: 'desktopTopbar.appMenu.hide', defaultMessage: 'Hide Notion' },
      hideOthers: {
        id: 'desktopTopbar.appMenu.hideOthers',
        defaultMessage: 'Hide Others',
      },
      unhide: {
        id: 'desktopTopbar.appMenu.unhide',
        defaultMessage: 'Show All',
      },
      quitMac: { id: 'desktopTopbar.appMenu.quit', defaultMessage: 'Quit' },
    }),
    escapeAmpersand = (message) => message.replace(/&/g, '&&');
  __exports.setupSystemMenu = (locale) => {
    const intl = localizationHelper.createIntlShape(locale),
      fileMenu = {
        role: 'fileMenu',
        label: escapeAmpersand(intl.formatMessage(menuMessages.fileMenuTitle)),
        submenu: isMac
          ? [
              {
                label: escapeAmpersand(
                  intl.formatMessage(menuMessages.newWindow)
                ),
                accelerator: 'CmdOrCtrl+Shift+N',
                click: () => createWindow.createWindow('', '', true),
              },
              ...(tabsEnabled
                ? [
                    {
                      role: 'close',
                      label: escapeAmpersand(
                        intl.formatMessage(menuMessages.closeWindow)
                      ),
                    },
                  ]
                : []),
            ]
          : [
              {
                label: escapeAmpersand(
                  intl.formatMessage(menuMessages.newWindow)
                ),
                accelerator: 'CmdOrCtrl+Shift+N',
                click: () => createWindow.createWindow(),
              },
              ...(tabsEnabled
                ? [
                    {
                      role: 'quit',
                      label: escapeAmpersand(
                        intl.formatMessage(menuMessages.quit)
                      ),
                    },
                  ]
                : []),
            ],
      },
      editMenu = {
        role: 'editMenu',
        label: escapeAmpersand(intl.formatMessage(menuMessages.editMenuTitle)),
        submenu: isMac
          ? [
              {
                role: 'undo',
                label: escapeAmpersand(intl.formatMessage(menuMessages.undo)),
              },
              {
                role: 'redo',
                label: escapeAmpersand(intl.formatMessage(menuMessages.redo)),
              },
              { type: 'separator' },
              {
                role: 'cut',
                label: escapeAmpersand(intl.formatMessage(menuMessages.cut)),
              },
              {
                role: 'copy',
                label: escapeAmpersand(intl.formatMessage(menuMessages.copy)),
              },
              {
                role: 'paste',
                label: escapeAmpersand(intl.formatMessage(menuMessages.paste)),
              },
              {
                role: 'selectAll',
                label: escapeAmpersand(
                  intl.formatMessage(menuMessages.selectAll)
                ),
              },
              { type: 'separator' },
              {
                label: escapeAmpersand(intl.formatMessage(menuMessages.speech)),
                submenu: [
                  {
                    role: 'startSpeaking',
                    label: escapeAmpersand(
                      intl.formatMessage(menuMessages.startSpeaking)
                    ),
                  },
                  {
                    role: 'stopSpeaking',
                    label: escapeAmpersand(
                      intl.formatMessage(menuMessages.stopSpeaking)
                    ),
                  },
                ],
              },
            ]
          : [
              {
                role: 'undo',
                label: escapeAmpersand(intl.formatMessage(menuMessages.undo)),
              },
              {
                role: 'redo',
                label: escapeAmpersand(intl.formatMessage(menuMessages.redo)),
              },
              { type: 'separator' },
              {
                role: 'cut',
                label: escapeAmpersand(intl.formatMessage(menuMessages.cut)),
              },
              {
                role: 'copy',
                label: escapeAmpersand(intl.formatMessage(menuMessages.copy)),
              },
              {
                role: 'paste',
                label: escapeAmpersand(intl.formatMessage(menuMessages.paste)),
              },
              { type: 'separator' },
              {
                role: 'selectAll',
                label: escapeAmpersand(
                  intl.formatMessage(menuMessages.selectAll)
                ),
              },
            ],
      },
      viewMenu = {
        role: 'viewMenu',
        label: escapeAmpersand(intl.formatMessage(menuMessages.viewMenuTitle)),
        submenu: [
          {
            label: escapeAmpersand(intl.formatMessage(menuMessages.reload)),
            accelerator: 'CmdOrCtrl+R',
            click() {
              const focusedWebContents = electron.webContents.getFocusedWebContents();
              if (focusedWebContents) {
                if (focusedWebContents.hostWebContents) {
                  for (const webContentsInstance of electron.webContents.getAllWebContents()) {
                    if (
                      webContentsInstance.hostWebContents ===
                      focusedWebContents.hostWebContents
                    ) {
                      webContentsInstance.reload();
                    }
                  }
                } else {
                  focusedWebContents.reload();
                }
              }
            },
          },
          {
            label: escapeAmpersand(
              intl.formatMessage(menuMessages.toggleDevTools)
            ),
            accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click() {
              let focusedWebContents = electron.webContents.getFocusedWebContents();
              if (focusedWebContents) {
                const focusedWebContentsUrl = focusedWebContents.getURL();
                if (
                  focusedWebContentsUrl.startsWith('file://') &&
                  focusedWebContentsUrl.endsWith('/search.html')
                ) {
                  const notionWebviewWebContents = electron.webContents
                    .getAllWebContents()
                    .find(
                      (webContentsInstance) =>
                        webContentsInstance.hostWebContents ===
                          focusedWebContents.hostWebContents &&
                        webContentsInstance !== focusedWebContents
                    );
                  if (notionWebviewWebContents) {
                    focusedWebContents = notionWebviewWebContents;
                  }
                }
                focusedWebContents.toggleDevTools();
              }
            },
          },
          {
            label: escapeAmpersand(
              intl.formatMessage(menuMessages.toggleWindowDevTools)
            ),
            accelerator: isMac ? 'Shift+Alt+Command+I' : 'Alt+Ctrl+Shift+I',
            visible: false,
            click(menuItem, focusedWindow) {
              if (focusedWindow) {
                focusedWindow.webContents.toggleDevTools();
              }
            },
          },
          { type: 'separator' },
          {
            role: 'togglefullscreen',
            label: escapeAmpersand(
              intl.formatMessage(menuMessages.togglefullscreen)
            ),
          },
        ],
      },
      windowMenu = {
        role: 'windowMenu',
        label: escapeAmpersand(
          intl.formatMessage(menuMessages.windowMenuTitle)
        ),
        submenu: isMac
          ? [
              {
                role: 'minimize',
                label: escapeAmpersand(
                  intl.formatMessage(menuMessages.minimize)
                ),
              },
              {
                role: 'zoom',
                label: escapeAmpersand(intl.formatMessage(menuMessages.zoom)),
              },
              { type: 'separator' },
              {
                role: 'front',
                label: escapeAmpersand(intl.formatMessage(menuMessages.front)),
              },
            ]
          : [
              {
                role: 'minimize',
                label: escapeAmpersand(
                  intl.formatMessage(menuMessages.minimize)
                ),
              },
              {
                label: escapeAmpersand(
                  intl.formatMessage(menuMessages.maximize)
                ),
                click(item, focusedWindow) {
                  if (focusedWindow) {
                    if (focusedWindow.isMaximized()) {
                      focusedWindow.unmaximize();
                    } else {
                      focusedWindow.maximize();
                    }
                  }
                },
              },
              ...(tabsEnabled
                ? [
                    {
                      role: 'close',
                      label: escapeAmpersand(
                        intl.formatMessage(menuMessages.close)
                      ),
                    },
                  ]
                : []),
            ],
      },
      helpMenu = {
        role: 'help',
        label: escapeAmpersand(intl.formatMessage(menuMessages.helpTitle)),
        submenu: [
          {
            label: escapeAmpersand(intl.formatMessage(menuMessages.help)),
            click() {
              electron.shell.openExternal(config.default.baseURL + '/help');
            },
          },
        ],
      },
      appMenu = {
        role: 'appMenu',
        submenu: [
          {
            role: 'about',
            label: escapeAmpersand(intl.formatMessage(menuMessages.about)),
          },
          { type: 'separator' },
          {
            label: escapeAmpersand(intl.formatMessage(menuMessages.reset)),
            async click(item, focusedWindow) {
              await fs.remove(electron.app.getPath('userData'));
              electron.app.relaunch();
              electron.app.exit();
            },
          },
          { type: 'separator' },
          {
            role: 'services',
            label: escapeAmpersand(intl.formatMessage(menuMessages.services)),
          },
          { type: 'separator' },
          {
            role: 'hide',
            label: escapeAmpersand(intl.formatMessage(menuMessages.hide)),
          },
          {
            role: 'hideOthers',
            label: escapeAmpersand(intl.formatMessage(menuMessages.hideOthers)),
          },
          {
            role: 'unhide',
            label: escapeAmpersand(intl.formatMessage(menuMessages.unhide)),
          },
          ...(tabsEnabled
            ? [
                { type: 'separator' },
                {
                  role: 'quit',
                  label: escapeAmpersand(
                    intl.formatMessage(menuMessages.quitMac)
                  ),
                },
              ]
            : []),
        ],
      },
      template = [fileMenu, editMenu, viewMenu, windowMenu, helpMenu];
    if (isMac) template.unshift(appMenu);
    const menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);
  };
};
