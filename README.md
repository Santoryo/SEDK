# StreamElements Development Kit

![GitHub License](https://img.shields.io/github/license/santoryo/SEDK)
<a href="https://ko-fi.com/santowyo" target="_blank">![Ko-Fi](https://shields.io/badge/kofi-Buy_a_coffee-ff5f5f?logo=ko-fi&style=for-the-badgeKofi)</a>
![GitHub Release](https://img.shields.io/github/v/release/santoryo/sedk)
![Discord](https://img.shields.io/discord/1210679064394989629)


A simple Development Kit for creating StreamElements Custom Widgets locally, with more cleaner and intuitive workflow. It's goal is to make a simpler and more fun development of custom widgets for SE without annoying copy/paste workflow. Made with love by [@santowyo](https://twitter.com/santowyo).

**Disclaimer:** This project is heavily still under WIP. Many things will change until 1.0 release. Contributions are open for code structure and general help to make the best tool as possible.

Need help with code? Join our Discord [https://discord.gg/MgFbfkNDPY](https://discord.gg/MgFbfkNDPY)

### Features

1. Live Development Server that reloads on any file save and changes.
2. Auto SVG to CSS to handle StreamElements no storage limitation.
3. Simple building into .zip folder that can be imported directly into StreamElements Overlays Feature by using [ShrigmaCW widget.io Chrome Extension](https://chromewebstore.google.com/detail/widgetio/fcgbjpajcfjnjgfdeookpnoefgcliljj)
4. Auto Components creation to allow cleaner codebase (.html into .js embedded function)

### Setup

1. Clone the repo with `git clone https://github.com/Santoryo/SEDK` (or download the zip file from GitHub / Ko-Fi)
2. Open the folder with Visual Studio Code and run `npm install` to install the dependencies
3. Your Widget code lives inside the `widget` directory with following .html, .css. .js and .json files.
4. Run `npm run dev` to enter development mode.
5. We provide you with basic template for messages, subs, alerts. You can add anything you want with the specific StremElements. If you would like to add more buttons to test edit the `.sdk/index.html`.
6. You can attach custom stylesheets, packages and more by adding it to the `<head>` element in `widget.html`
7. You can run `npm run build` to build your project into `widget.zip` that you can use to import files directly using [ShrigmaCW widget.io Chrome Extension](https://chromewebstore.google.com/detail/widgetio/fcgbjpajcfjnjgfdeookpnoefgcliljj)
