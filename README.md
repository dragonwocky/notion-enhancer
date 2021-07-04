# <img src="./mods/core/icons/mac+linux.png" height="20px"> notion-enhancer

notion.so is a pretty awesome tool already, but there's always room for improvements.
it might just be a preference, it might be something crucial to your setup,
it might be something users have been asking for for a long time,
or it might even be something you haven't realised you need yet
\- there's something that would make your user experience a lot better.

this package is a mod-loader for the desktop app, with custom colour theming and extra feature enhancements.

want to contribute? check out the [contribution guidelines](CONTRIBUTING.md) and the [documentation](DOCUMENTATION.md).

for support, join the [discord server](https://discord.gg/sFWPXtA).

## Supported desktop clients

- the pre-enhanced builds available at [notion-repackaged](https://github.com/notion-enhancer/notion-repackaged). Built for Windows, Linux and Mac (Intel and M1)
- manually patching the [official windows/mac releases](https://notion.so/desktop)
- the pre-enhanced packages for by [notion-linux](https://github.com/davidbailey00/notion-linux)
- the pre-enhanced arch linux AUR package [notion-app-enhanced](https://aur.archlinux.org/packages/notion-app-enhanced/)

outdated notion versions (< 2.0.10) probably won't work.

mobile clients are not supported and due to system limitations/restrictions cannot be.

a chrome extension may be coming soon for web client support.

## Installation

### Installing notion-repackaged builds

> **if you are using Arch or derivatives like Manjaro**, you can install [notion-app-enhanced](https://aur.archlinux.org/packages/notion-app-enhanced/) which is pre-enhanced and doesn't require any additional steps to get working.
>

The [notion-enhancer/notion-repackaged](https://github.com/notion-enhancer/notion-repackaged) project provides prebuilt builds for Windows, Linux and Mac that are ready to install and use. These builds are pre-enhanced and aim to provide the fastest and easiest way to use notion-enhancer.

The [available release builds](https://github.com/notion-enhancer/notion-repackaged/releases/) include:

- Windows (`.exe` installer, only x64)
- Linux (`AppImage`, `deb`, `rpm`, `pacman` packages, only x64)
- Mac (`dmg` package, for Intel and Apple Silicon)

The builds are not signed, so your operating system might complain when installing even though the builds are completely safe to use.

For more information, please head over to [notion-repackaged's documentation](https://github.com/notion-enhancer/notion-repackaged)

### Patching manually

> **if you are updating from v0.7.0 or earlier,** things have changed, more information is available
> in this [update guide](UPDATING.md). please read that before following these instructions.

- ensure that no notion windows/processes are running by ending all Notion processes in your task manager.
  - `CMD + ALT + ESC` on mac and `CTRL + SHIFT + ESC` on windows/linux to open task manager.
- [install node.js](https://nodejs.org/en/download/)
  - you may need to restart your computer.
  - notion-enhancer will use node.js, you do not need to interact with it aside from downloading to install notion-enhancer.
- open your computer's terminal, **not the node.js command prompt.**
  - **windows 10:** search in your start menu (click windows key or icon in bottom left of screen) for _'cmd'_ or _'command prompt'_.
  - **mac:** search in spotlight (magnifying glass in top right of screen) for _'terminal'_.
- type and enter the following line(s) based on your operating system, if there are multiple lines, make sure to enter them _one by one_ .
  - **windows 10:**
    ```
    npm i -g notion-enhancer
    ```
  - **mac:** this may ask you to enter your password, instead of hiding your password with \*\*\* symbols, mac terminal hides it by making it invisible. simply type your password and click enter.
    ```
    sudo chmod -R a+wr /usr/local/lib/node_modules
    sudo chmod -R a+wr /usr/local/bin
    sudo chmod -R a+wr /Applications/Notion.app/Contents/Resources
    npm i -g notion-enhancer
    ```
  - **debian/ubuntu, chromeOS, wsl (to modify the win10 app):**
    ```
    bash curl -sL https://deb.nodesource.com setup_current.x | sudo -E bash -
    sudo apt-get install -y nodejs
    npm i -g notion-enhancer
    ```

- ⚠ important - on the notion desktop app version 2.0.13 and newer, a small fix is necessary to make notion enhancer work. follow the [steps here](https://www.notion.so/hack-notion-enhancer-v0-10-2-to-work-with-notion-s-v2-0-13-app-a4ab1267e67b4126b6448641ca4a0041) to fix notion. there's also a [video version](https://www.youtube.com/watch?v=vcwUpwpQ2sY) of the instructions.

#### Command-line interface

the enhancements should be automatically applied on installation
and automatically removed on uninstallation.

on some platforms this may throw errors if done without
elevated/admin permissions, though, so if it hasn't automatically
installed you will still need to use these commands.

```
Usage:
  $ notion-enhancer <command> [options]

Commands:
  apply   : add enhancements to the notion app
  remove  : return notion to its pre-enhanced/pre-modded state
  check   : check the current state of the notion app

For more info, run any command with the `--help` flag:
  $ notion-enhancer apply --help
  $ notion-enhancer remove --help
  $ notion-enhancer check --help

Options:
  -y, --yes      : skip prompts (may overwrite data)
  -n, --no       : skip prompts (may cause failures)
  -d, --dev      : show detailed error messages (for debug purposes)
  -h, --help     : display usage information
  -v, --version  : display version number
```

## Frequently asked questions

**when will the update be out?**
i code this in my free time, in-between my other commitments. there are no ETAs.

**the themes aren't working?**
if you pick a dark theme it will only be applied if notion is in dark mode,
and if you pick a light theme it will only work if notion is in light mode.
do `CMD/CTRL+SHIFT+L` to toggle between them.

**is this against notion's terms of service? can i get in trouble for using it?**
definitely not! i contacted their support team to check, and the response was awesome:

> "Thanks for taking the time to share this with us. Userscripts and userstyles are definitely
> cool ideas and would be helpful for many users! ... I'll also share this with the rest of the
> team to take to heart for future improvements."

**how do i uninstall the enhancer?**
run `npm remove -g notion-enhancer`.

## Features

most of the enhancer's functionality is split into configurable enhancement modules,
but some basic improvements necessary for things to work are built in by values:

- the notion:// url scheme/protocol is patched to work on linux.
- a tray/menubar icon: links relevant to the enhancer + buttons to manage notion windows.

once applied, modules can be configured via the graphical menu,
which is opened from the tray/menubar icon or with `OPTION/ALT+E`.

![](https://user-images.githubusercontent.com/16874139/97819046-34e8b600-1cfa-11eb-8fa6-a3ad5374cd0b.png)

currently all modules come pre-installed for technical reasons, security assurance, and ease-of-use.
these include:

### notion-enhancer core

**tags:** #core

**description:** the cli, modloader, menu, & tray.

**author:** [dragonwocky](https://github.com/dragonwocky/)

| option                        | extended description                                                                                                                                                                                                                      | type                                                                                          | values/defaults            | platform-specific details |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------- | ------------------------- |
| auto-resolve theme conflicts  | when a theme is enabled any other themes of the same mode (light/dark) will be disabled.                                                                                                                                                  | toggle                                                                                        | no                         |                           |
| hide app on open              | app can be made visible by clicking the tray icon or using the hotkey.                                                                                                                                                                    | toggle                                                                                        | no                         |                           |
| auto-maximise windows         | whenever a window is un-hidden or is created it will be maximised.                                                                                                                                                                        | toggle                                                                                        | no                         |                           |
| close window to the tray      | pressing the × close button will hide the app instead of quitting it. it can be re-shown by clicking the tray icon or using the hotkey.                                                                                                   | toggle                                                                                        | yes                        |                           |
| integrated titlebar           | replace the native titlebar with buttons inset into the app.                                                                                                                                                                              | toggle                                                                                        | yes                        | macOS: forced on          |
| tiling window manager mode    | completely remove the close/minimise/maximise buttons - this is for a special type of window manager. if you don't understand it, don't use it.                                                                                           | toggle                                                                                        | no                         | macOS: forced off         |
| window display hotkey         | used to toggle hiding/showing all app windows.                                                                                                                                                                                            | [accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md) input | `CommandOrControl+Shift+A` |                           |
| open enhancements menu hotkey | used to toggle opening/closing this menu while notion is focused.                                                                                                                                                                         | [accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md) input | `Alt+E`                    |                           |
| values/defaults page id/url   | every new tab/window that isn't opening a url via the notion:// protocol will load this page. to get a page link from within the app, go to the triple-dot menu and click "copy link". leave blank to just load the last page you opened. | text input                                                                                    | `Alt+E`                    |                           |

![](https://user-images.githubusercontent.com/16874139/97819249-7a59b300-1cfb-11eb-99fa-de945fe8e3d9.png)

### tabs

**tags:** #core #extension

**description:** have multiple notion pages open in a single window.

**author:** [dragonwocky](https://github.com/dragonwocky/)

| option                                                                | type                                                                                          | values/defaults                                                                                    |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| tab select modifier (key+1, +2, +3, ... +9 and key+left/right arrows) | select                                                                                        | `Alt`, `Command`, `Control`, `Super`, `Alt+Shift`, `Command+Shift`, `Control+Shift`, `Super+Shift` |
| new tab keybinding                                                    | [accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md) input | `CommandOrControl+T`                                                                               |
| close tab keybinding                                                  | [accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md) input | `CommandOrControl+W`                                                                               |

![](https://user-images.githubusercontent.com/16874139/97821456-9dd62b00-1d06-11eb-8c3a-e9f77bbd740e.png)

### tweaks

**tags:** #core #extension

**description:** common style/layout changes.

**author:** [dragonwocky](https://github.com/dragonwocky/)

| option                       | extended description                                                                                       | type         | values/defaults | platform-specific details |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ------------------------- |
| height of frameless dragarea | the rectangle added at the top of a window in "integrated titlebar" mode, used to drag/move the window.    | number input | 15              | macOS: forced to 0        |
| width to wrap columns at     | the size in pixels below which in-page columns are resized to appear full width so content isn't squished. | number input | 600             |                           |
| integrated scrollbars        | use scrollbars that fit better into notion's ui instead of the default chrome ones.                        | toggle       | yes             |                           |
| snappy transitions           |                                                                                                            | toggle       | no              |                           |
| thicker bold text            |                                                                                                            | toggle       | yes             |                           |
| more readable line spacing   |                                                                                                            | toggle       | no              |                           |
| hide help button             |                                                                                                            | toggle       | no              |                           |

![](https://user-images.githubusercontent.com/16874139/97819829-1638ee00-1cff-11eb-80c6-f270c2ba0f37.png)

### always on top

**tags:** #extension

**description:** add an arrow/button to show the notion window
on top of other windows even if it's not focused.

**author:** [dragonwocky](https://github.com/dragonwocky/)

![](https://user-images.githubusercontent.com/16874139/97820478-79784f80-1d02-11eb-9e32-caac4563d8f0.png)

### bracketed links

**tags:** #extension

**description:** render links surrounded with \[\[brackets]] instead of underlined.

**author:** [arecsu](https://github.com/arecsu/)

![](https://user-images.githubusercontent.com/16874139/97820501-9f9def80-1d02-11eb-8ad8-b1ddf1ed9599.png)

### bypass preview

**tags:** #extension

**description:** go straight to the normal full view when opening a page.

**author:** [dragonwocky](https://github.com/dragonwocky/)

### calendar scroll

**tags:** #extension

**description:** add a button to scroll down to the current week in fullpage/infinite-scroll calendars.

**author:** [dragonwocky](https://github.com/dragonwocky/)

![](https://user-images.githubusercontent.com/16874139/97820611-fe636900-1d02-11eb-8f78-0536103e25aa.png)

### cherry cola

**tags:** #theme #dark

**description:** a delightfully plummy, cherry cola flavored theme.

**author:** [runargs](https://github.com/runargs)

![](https://user-images.githubusercontent.com/16874139/97819898-9fe8bb80-1cff-11eb-846f-1a66e0302ebd.png)

### custom inserts

**tags:** #extension

**description:** link files for small client-side tweaks. (not sure how to do something? check out the
[tweaks](https://github.com/notion-enhancer/tweaks) collection.)

**author:** [dragonwocky](https://github.com/dragonwocky/)

| option                | type |
| --------------------- | ---- |
| css insert            | file |
| client-side js insert | file |

### dark+

**tags:** #theme #dark

**description:** a vivid-colour near-black theme.

**author:** [dragonwocky](https://github.com/dragonwocky/)

| option         | type  | values/defaults    |
| -------------- | ----- | ------------------ |
| primary colour | color | `rgb(177, 24, 24)` |

![](https://user-images.githubusercontent.com/16874139/97820632-19ce7400-1d03-11eb-85a9-87f6d957dc96.png)

### dracula

**tags:** #theme #dark

**description:** a theme based on the popular dracula color palette originally by zeno rocha and friends.

**author:** [dracula](https://github.com/dracula/)

![](https://user-images.githubusercontent.com/16874139/97820175-04f0e100-1d01-11eb-9ede-b6e033a28cbc.png)

### emoji sets

**tags:** #extension

**description:** pick from a variety of emoji styles to use.

**author:** [dragonwocky](https://github.com/dragonwocky/)

| option | type   | values/defaults                                                                                                            |
| ------ | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| style  | select | twitter, apple, google, microsoft, samsung, whatsapp, facebook, messenger, joypixels, openmoji, emojidex, lg, htc, mozilla |

![](https://user-images.githubusercontent.com/16874139/97820652-3f5b7d80-1d03-11eb-80a6-34089b946711.png)

### focus mode

**tags:** #extension

**description:** hide the titlebar/menubar if the sidebar is closed (will be shown on hover).

**author:** [arecsu](https://github.com/arecsu/)

| option                            | extended description                                                                                                                                                        | type   | values/defaults |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------- |
| add padding to bottom of the page | will only take effect when the sidebar is hidden. aims to make the canvas as symmetrical/consistent as possible: if there is empty space on 3 sides, the 4th should follow. | toggle | on              |

![](https://user-images.githubusercontent.com/16874139/97820337-da535800-1d01-11eb-9df5-55567cba2cc4.png)

### font chooser

**tags:** #extension

**description:** customize fonts. for each option, type in the name of
the font you would like to use, or leave it blank to not change anything.

**author:** [torchatlas](https://github.com/torchatlas)

| option               | type       |
| -------------------- | ---------- |
| sans-serif (inc. ui) | text input |
| serif                | text input |
| monospace            | text input |
| code                 | text input |

![](https://user-images.githubusercontent.com/16874139/97820678-61ed9680-1d03-11eb-8f9f-54c1c5faf25e.png)

### gameish

**tags:** #theme #dark

**description:** a purple, "gamer-styled" theme with a blocky-font.

**author:** [LVL100ShrekCultist](https://reddit.com/user/LVL100ShrekCultist/)

![](https://user-images.githubusercontent.com/16874139/97820696-75006680-1d03-11eb-8046-c3cb871ad34c.png)

### littlepig dark

**tags:** #theme #dark

**description:** a purple monospaced theme using emojis and colourful text.

**author:** [Lizishan](https://www.reddit.com/user/Lizishan/)

![](https://user-images.githubusercontent.com/16874139/97820718-919c9e80-1d03-11eb-9749-e04faef82e2d.png)

### littlepig light

**tags:** #theme #light

**description:** a bright monospaced theme using emojis and colourful text.

**author:** [Lizishan](https://www.reddit.com/user/Lizishan/)

![](https://user-images.githubusercontent.com/16874139/97820868-446cfc80-1d04-11eb-80ba-48cbedd62ed1.png)

### material ocean

**tags:** #theme #dark

**description:** an oceanic colour palette.

**author:** [blacksuan19](https://github.com/blacksuan19)

![](https://user-images.githubusercontent.com/16874139/97820253-6d3fc280-1d01-11eb-86d1-9932b364bad8.png)

### neutral

**tags:** #theme #dark

**description:** smoother colours and fonts, designed to be more pleasing to the eye.

**author:** [arecsu](https://github.com/arecsu/)

![](https://user-images.githubusercontent.com/16874139/97821029-fad0e180-1d04-11eb-9bad-2c76e9fa7613.png)

### night shift

**tags:** #extension #theme

**description:** sync dark/light theme with the system (overrides normal theme setting).

**author:** [dragonwocky](https://github.com/dragonwocky/)

### pastel dark

**tags:** #theme #dark

**description:** a true dark theme with a hint of pastel.

**author:** [zenith_illinois](https://reddit.com/user/zenith_illinois/)

![](https://user-images.githubusercontent.com/16874139/97820893-60709e00-1d04-11eb-8d52-55ab44000786.png)

### property layout

**tags:** #extension

**description:** auto-collapse page properties that usually push down page content.

**author:** [alexander-kazakov](https://github.com/alexander-kazakov/)

![](https://user-images.githubusercontent.com/16874139/97820916-81d18a00-1d04-11eb-8e07-b7519590157a.png)

### right-to-left

**tags:** #extension

**description:** enables auto rtl/ltr text direction detection.

**author:** [obahareth](https://github.com/obahareth/)

![](https://user-images.githubusercontent.com/16874139/97820953-a7f72a00-1d04-11eb-98c0-6ad83d097682.png)

### scroll to top

**tags:** #extension

**description:** add an arrow above the help button to scroll back to the top of a page.

**author:** [CloudHill](https://github.com/CloudHill/)

| option                                  | type         | values/defaults |
| --------------------------------------- | ------------ | --------------- |
| smooth scrolling                        | toggle       | on              |
| distance scrolled until button is shown | number input | 50              |
| unit to measure distance with           | select       | percent, pixels |

![](https://user-images.githubusercontent.com/16874139/97820445-4c2ba180-1d02-11eb-9d1a-911bca266f7f.png)

### weekly view

**tags:** #extension

**description:** calendar views named "weekly" will show only the 7 days of this week.

**author:** [adihd](https://github.com/adihd/)

![](https://user-images.githubusercontent.com/16874139/97820985-bf361780-1d04-11eb-9e2a-786a7c37477d.png)

### word counter

**tags:** #extension

**description:** add page details: word/character/sentence/block count & speaking/reading times.

**author:** [dragonwocky](https://github.com/dragonwocky/)

![](https://user-images.githubusercontent.com/16874139/97821003-d37a1480-1d04-11eb-8aaa-9e5dfea495eb.png)

## contributors

[@TarasokUA](https://github.com/TarasokUA/) wrote the first versions of this in python, in early 2020.
a couple months after I ([@dragonwocky](https://github.com/dragonwocky/)) picked the project up, at first extending
upon the original base and later moving to the javascript module system.

the enhancer wouldn't be anything near to what it is now though without
interested community members testing, coding and ideating features - some are listed as
[contributors](https://github.com/notion-enhancer/notion-enhancer/graphs/contributors) here on github,
but many more have been helping out on discord and in emails.

individual modules have their original authors attributed.
