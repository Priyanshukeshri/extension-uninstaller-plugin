# Extension Uninstaller

This is a Visual Studio Code extension that allows you to view and uninstall installed extensions from within the editor. It provides a webview panel that displays a list of installed extensions along with their details.

# Features
* View the list of installed extensions with their names, versions, descriptions, and publisher information.
* See an icon representing each installed extension (if available).
* Uninstall extensions directly from the webview panel.

# Requirements
This extension requires Visual Studio Code version 1.60.0 or higher.

# Installation
* Launch Visual Studio Code.
* Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
* Search for `Extension Uninstaller` in the Extensions view search bar.
* Click on the `Install` button next to the extension name to install it.

# Usage
* Open the Command Palette by pressing `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).

* Search for `Extension : uninstaller` and select it.

* A webview panel will open displaying the list of installed extensions.

![Screenshot](./resources/screenshot.gif)

* To remove an extension, click the `Remove` button next to the extension's name.

* A confirmation message will pop up asking if you want to uninstall the extension. Click `Yes` to proceed with the uninstallation or `No` to cancel.

# Known Issues

* If an extension does not have an icon specified, it will not be displayed in the webview.

* Uninstalling an extension will permanently remove it from your system. Be cautious when using this feature.

# Feedback and Contributions

If you encounter any issues or have suggestions for improvement, please [open an issue](http://code.visualstudio.com/docs/languages/markdown) on the GitHub repository.

Pull requests are also welcome! If you want to contribute to the development of this extension.

**Enjoy!**