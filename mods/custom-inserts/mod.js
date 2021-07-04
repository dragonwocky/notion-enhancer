/*
 * custom inserts
 * (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * under the MIT license
 */

'use strict';

const { createElement } = require('../../pkg/helpers.js');

module.exports = {
  id: 'b4b0aced-2059-43bf-8d1d-ccd757ee5ebb',
  tags: ['extension'],
  name: 'custom inserts',
  desc: `link files for small client-side tweaks. (not sure how to do something? check out the
      [tweaks](https://github.com/notion-enhancer/tweaks) collection.)`,
  version: '0.1.3',
  author: 'dragonwocky',
  options: [
    {
      key: 'css',
      label: 'css insert',
      type: 'file',
      extensions: ['css'],
    },
    {
      key: 'js',
      label: 'client-side js insert',
      type: 'file',
      extensions: ['js'],
    },
  ],
  hacks: {
    'renderer/preload.js'(store, __exports) {
      const fs = require('fs-extra');
      document.addEventListener('readystatechange', (event) => {
        if (document.readyState !== 'complete') return false;
        if (store().css) {
          try {
            document
              .querySelector('head')
              .appendChild(
                createElement(
                  `<style type="text/css">${fs.readFileSync(
                    store().css
                  )}</style>`
                )
              );
          } catch (err) {
            console.warn('<custom-inserts> invalid css file... unsetting.');
            store().css = '';
          }
        }
        if (store().js) {
          try {
            require(store().js);
          } catch (err) {
            console.warn('<custom-inserts> invalid js file... unsetting.');
            store().js = '';
          }
        }
      });
    },
  },
};
