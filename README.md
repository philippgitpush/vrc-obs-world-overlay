> [!NOTE]
> The VRChat OBS World Overlay is still under development, and this repository is intended for public testing. Build instructions for developers may change at any time. If you encounter any issues, feel free to reach out for help by either [opening a GitHub issue](https://github.com/philippgitpush/vrc-obs-world-overlay/issues) or contacting me on Discord: @philippharos

# VRChat OBS World Overlay

This is an Open Broadcaster Software (OBS) Browser-Source Overlay, which displays information about the VRChat World you are currently in. This requires [VRCX](https://github.com/vrcx-team/VRCX) to be running in the background for it to work.

https://github.com/user-attachments/assets/56dc1697-be2e-4b74-b7c0-f66923c22ce9

## Installation

Full builds are available on the [releases page](https://github.com/philippgitpush/vrc-obs-world-overlay/releases) of this repository. You can either use the **win-unpacked** version for a portable option or install the provided installer.

Support for macOS and Linux is not available at this time.

## Usage

To use this overlay, **you must have [VRCX](https://github.com/vrcx-team/VRCX) running in the background**, as it provides the data required for functionality. The overlay [fetches the last visited world and VRChat login details from VRCX to determine platform compatibility](https://github.com/philippgitpush/vrc-obs-world-overlay/blob/c87f702909233bc117407a0d7c1893c590c05f00/src/electron/vrchat.js#L99-L115).

Access the overlay at [http://localhost:1412/](http://localhost:1412/) in your OBS Browser Source. You may need to specify the path to your VRCX AppData folder if it's not in the default directory. The overlay relies on the database file from VRCX. Adjust the width and height to match your stream's canvas size, which is usually 1920x1080.

## Overlay structure

> [!NOTE]
> Changing the HTML or CSS of the overlay involves running Vite in the build process, this means that **you will need to make any changes inside the development environment** and run the build process when you're finished with your desired changes.

**The port used for the OBS overlay changes in the development environment to `3000` instead of 1412.**

You can find the full markup and CSS for the overlay in `/src/views/OverlayView.vue`. Keep in mind that this project uses [Tailwind CSS](https://tailwindcss.com/docs/box-shadow), so you can take advantage of its complete library. This project also uses the javascript framework [Vue.js](https://vuejs.org/guide/essentials/template-syntax.html) and includes [Anime.js](https://animejs.com/) for animations. You can write your styles in [SCSS](https://sass-lang.com/documentation/syntax/) style too.

## Building and Development

Before starting the build process, install [Node.js](https://nodejs.org/en) and [Git](https://git-scm.com/downloads) on your machine. During installation, **make sure to select the option to add "npm" to your system's PATH**. If you don't have Git installed, you can also download the repository directly from GitHub.

For manual building and development, please follow these steps:

1. Clone this repository

```sh
git clone https://github.com/philippgitpush/vrc-obs-world-overlay
cd vrc-obs-world-overlay
```

2. Install all necessary dependencies

```sh
npm install
```

3. Start the development environment

```
npm run dev
```

> [!NOTE]
> Since we are running Vue.js and Vite, any changes you make will be directly reflected in your browser window thanks to Hot Module Replacement. You won't have to manually reload your window unless you are making big architectural changes.

3. Once you've made your changes, proceed to build the application

```
npm run build
```

This will build a full version of the application and generate installation or executable files in the `/build` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/philippgitpush/vrc-obs-world-overlay/blob/main/LICENSE) file for details.

## Credits

Icons taken from [Phosphor Icons](https://phosphoricons.com/). Font taken from [Google Fonts](https://fonts.google.com/specimen/Source+Sans+3).
