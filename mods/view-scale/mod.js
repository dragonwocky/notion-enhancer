/*
 * view-scale
 * (c) 2020 SP12893678 (https://github.com/SP12893678)
 * under the MIT license
 */

'use strict';
const electron = require('electron');
const { createElement } = require('../../pkg/helpers.js');

module.exports = {
  id: 'e71ce1e0-024c-435e-a25e-7dd50448d1df',
  tags: ['extension'],
  name: 'view-scale',
  desc: 'scale the notion view',
  version: '1.0.0',
  author: 'SP12893678',
  options: [
    {
      key: 'show_ui',
      label: 'show scale ui',
      type: 'toggle',
      value: true,
    },
    {
        key: 'offset',
        label: 'set scale plus and minus offset',
        type: 'input',
        value: 10,
    },
    {
          key: 'zoom',
          label: 'set scale default value',
          type: 'input',
          value: 100,
    },
    {
        key: 'can_hotkey',
        label: 'use keyboard hotkey to scale',
        type: 'toggle',
        value: true,
    },
    {
        key: 'keyboard_select_modifier',
        label:
          'keyboard hotkey select modifier',
        type: 'select',
        value: [
            'Control',
            'Alt',
        ],
    },
    {
        key: 'can_mouse_wheel',
        label: 'use mouse wheel to scale',
        type: 'toggle',
        value: true,
    },
    {
        key: 'mouse_wheel_select_modifier',
        label:
          'mouse wheel select modifier',
        type: 'select',
        value: [
            'Control',
            'Alt',
            'Command',
            'Shift',
        ],
    },
  ],
  hacks: {
    'renderer/preload.js'(store, __exports) {
        document.addEventListener('readystatechange', (event) => {
            if (document.readyState !== 'complete') return false;
            
            const attempt_interval = setInterval(enhance, 500);
            function enhance() {
                if (!document.querySelector('.notion-frame')) return;
                if (!document.querySelector('.notion-topbar-actions')) return;
                clearInterval(attempt_interval);

                electron.webFrame.setZoomFactor(store().zoom / 100) 
                let zoom = store().zoom / 100
                let offset = store().offset / 100
                let minZoom = 0.5
                let maxZoom = 2

                const $topBarActionShareMenu = document.querySelector('.notion-topbar-share-menu');
                const $scaleSet = createElement('<div class="notion-scale-container"></div>');
                const $scaleSilder = createElement('<input class="notion-scale-slider" type="range" min="50" max="200" value="100"></input>');
                const $scaleView = createElement('<div class="notion-scale-view">100%</div>');
                const $scalePlusButton = createElement('<div class="notion-scale-button">＋</div>');
                const $scaleMinusButton = createElement('<div class="notion-scale-button">－</div>');


                if(store().show_ui){
                    $scaleSilder.addEventListener('input',()=>{
                        zoom = $scaleSilder.value/100
                        changeScaleViewUIValue()
                    })
                    $scaleSilder.addEventListener('change',()=> electron.webFrame.setZoomFactor(zoom))
                    $scalePlusButton.addEventListener('click',()=> zoomPlus())
                    $scaleMinusButton.addEventListener('click',()=> zoomMinus())
    
                    $scaleSet.append($scaleSilder)
                    $scaleSet.append($scaleView)
                    $scaleSet.append($scalePlusButton)
                    $scaleSet.append($scaleMinusButton)
                    
                    $topBarActionShareMenu.before($scaleSet);
                    changeScaleViewUIValue()
                }

                if(store().can_mouse_wheel){
                    document.defaultView.addEventListener('wheel', (event)=>{
                        let key = getSelectModifierInKeyBoradKey(store().mouse_wheel_select_modifier)
                        if (event[key] && event.deltaY < 0) zoomPlus()
                        if (event[key] && event.deltaY > 0) zoomMinus()
                    });
                }

                if(store().can_hotkey){
                    document.defaultView.addEventListener('keyup', (event) => {
                        let key = getSelectModifierInKeyBoradKey(store().keyboard_select_modifier)
                        if (event[key] && event.key == '+') zoomPlus()
                        if (event[key] && event.key == '-') zoomMinus()
                    })
                }

                document.defaultView.addEventListener('resize',(event) =>{
                    zoom = electron.webFrame.getZoomFactor()
                    if(store().show_ui) changeScaleViewUIValue()
                });
                
                const observer = new MutationObserver((list, observer) => {
                    electron.webFrame.setZoomFactor(zoom)
                });

                observer.observe(document.querySelector('.notion-frame'), {
                    childList: true
                });

                function zoomPlus() {
                    zoom = electron.webFrame.getZoomFactor()
                    if(zoom + offset > maxZoom) return
                    zoom += offset
                    electron.webFrame.setZoomFactor(zoom)
                }
        
                function zoomMinus() {
                    zoom = electron.webFrame.getZoomFactor()
                    if(zoom + offset < minZoom) return
                    zoom -= offset
                    electron.webFrame.setZoomFactor(zoom)    
                }

                function changeScaleViewUIValue() {
                    $scaleView.innerHTML = Math.round(zoom * 100) + "%"
                }

                function getSelectModifierInKeyBoradKey(select_modifier) {
                    let key = 'ctrlKey'
                    switch (select_modifier) {
                        case 'Control':
                            key = 'ctrlKey'
                            break;
                        case 'Alt':
                            key = 'altKey'
                            break;
                        case 'Command':
                            key = 'metaKey'
                            break;
                        case 'Shift':
                            key = 'shiftKey'
                            break;
                        default:
                            break;
                    }
                    return key
                }
            }
        })
    },
  },
};
