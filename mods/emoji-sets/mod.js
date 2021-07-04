/*
 * emoji sets
 * (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * under the MIT license
 */

'use strict';

module.exports = {
  id: 'a2401ee1-93ba-4b8c-9781-7f570bf5d71e',
  tags: ['extension'],
  name: 'emoji sets',
  desc: 'pick from a variety of emoji styles to use.',
  version: '0.3.0',
  author: 'dragonwocky',
  options: [
    {
      key: 'style',
      label: '',
      type: 'select',
      value: [
        'twitter',
        'apple',
        'google',
        'microsoft',
        'samsung',
        'whatsapp',
        'facebook',
        'messenger',
        'joypixels',
        'openmoji',
        'emojidex',
        'lg',
        'htc',
        'mozilla',
      ],
    },
  ],
  hacks: {
    'renderer/preload.js'(store, __exports) {
      let tweaked = false;

      document.addEventListener('readystatechange', (event) => {
        if (document.readyState !== 'complete') return false;
        let queue = [];
        const observer = new MutationObserver((list, observer) => {
          if (!queue.length) requestAnimationFrame(handle);
          queue.push(...list);
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
        function handle() {
          queue = [];
          const isMac = process.platform === 'darwin',
            native =
              (store().style === 'microsoft' && process.platform === 'win32') ||
              (store().style === 'apple' && isMac);
          if (store().style !== (isMac ? 'apple' : 'twitter') || tweaked) {
            if (isMac) {
              if (native) {
                document
                  .querySelectorAll('span[role="image"][aria-label]')
                  .forEach((el) => {
                    el.style.background = '';
                    el.style.color = 'currentColor';
                  });
              } else {
                document
                  .querySelectorAll('span[role="image"][aria-label]')
                  .forEach((el) => {
                    if (!el.style.background.includes(store().style)) {
                      el.style.background = `url(https://emojicdn.elk.sh/${el.getAttribute(
                        'aria-label'
                      )}?style=${store().style})`;
                      el.style.width = el.parentElement.style.fontSize;
                      el.style.backgroundSize = 'contain';
                      el.style.backgroundRepeat = 'no-repeat';
                      el.style.color = 'transparent';
                    }
                  });
              }
            } else {
              document
                .querySelectorAll(
                  '[src*="notion-emojis.s3"]:not(.notion-emoji)'
                )
                .forEach((el) => el.remove());
              if (native) {
                document.querySelectorAll('.notion-emoji').forEach((el) => {
                  if (
                    el.parentElement.querySelectorAll(
                      'span[role="image"][aria-label]'
                    ).length !==
                    el.parentElement.querySelectorAll('.notion-emoji').length
                  ) {
                    el.insertAdjacentHTML(
                      'beforebegin',
                      `<span
                        role="image"
                        aria-label="${el.getAttribute('alt')}"
                        style='font-family: "Apple Color Emoji", "Segoe UI Emoji",
                        NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol",
                        "Android Emoji", EmojiSymbols; line-height: 1em;'
                      >${el.getAttribute('alt')}</span>`
                    );
                    el.style.display = 'none';
                    if (el.parentElement.getAttribute('contenteditable'))
                      el.remove();
                  } else if (
                    el.previousElementSibling.matches(
                      'span[role="image"][aria-label]'
                    )
                  ) {
                    el.previousElementSibling.innerText = el.getAttribute(
                      'alt'
                    );
                    el.setAttribute('aria-label', el.getAttribute('alt'));
                  }
                });
              } else {
                document.querySelectorAll('.notion-emoji').forEach((el) => {
                  el.parentElement
                    .querySelectorAll('span[role="image"][aria-label]')
                    .forEach((text) => text.remove());
                  el.style.display = 'inline-block';
                  if (!el.style.background.includes(store().style)) {
                    el.style.background = `url(https://emojicdn.elk.sh/${el.getAttribute(
                      'aria-label'
                    )}?style=${store().style})`;
                    el.style.backgroundSize = 'contain';
                    el.style.backgroundRepeat = 'no-repeat';
                    el.style.opacity = 1;
                  }
                });
              }
            }
            tweaked = true;
          }
        }
      });
    },
  },
};
