/*
 * mousewheel zoom
 * (c) 2020 younes0 <younes.bieche@gmail.com>
 * under the MIT license
 */

'use strict'

module.exports = {
  id: 'a4032ee9-2cfe-4c5c-b1b7-6606d5836acc',
  tags: ['extension'],
  name: 'mousewheel zoom',
  desc: 'allows Ctrl + Mousewheel zoom',
  version: '1.0.0',
  author: 'younes0',
  hacks: {
    'renderer/preload.js' (store, __exports) {
      const electron = require('electron')
      const isScrollDirectionUp = e =>
        e.wheelDelta ? e.wheelDelta > 0 : e.deltaY < 0

      document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'complete') {
          return false
        }

        const webContents = electron.remote.getCurrentWindow().webContents

        document.addEventListener('wheel', e => {
          if (e.ctrlKey) {
            const zoomFactor = webContents.getZoomFactor()

            webContents.setZoomFactor(
              isScrollDirectionUp(e) ? zoomFactor + 0.1 : zoomFactor - 0.1
            )
          }
        })
      })
    }
  }
}
