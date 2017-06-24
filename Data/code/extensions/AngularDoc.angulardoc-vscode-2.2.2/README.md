# AngularDoc for Visual Studio Code
This extension adds architectural analysis and visualization for Angular 2 projects.

## Features

- Full integration of [angular-cli](https://github.com/angular/angular-cli) generate commands (e.g. `ng g component`) on the explorer's context menu
- Automatic metadata submission & synchronization to [angulardoc.io](http://angulardoc.io) for analysis
- "AngularDoc" editor for visualizing the architecture, classes, modules, routes, and imports.

## Screenshots

![angulardoc-vscode screenshot](https://cloud.githubusercontent.com/assets/1360728/20079411/639969e0-a4f9-11e6-8b2e-caa255fec203.gif)

![angulardoc-vscode-cli screenshot](https://cloud.githubusercontent.com/assets/1360728/20081103/468160c0-a502-11e6-85f2-15cb7cc41641.gif)

## Installation

Launch Visual Studio Code. In the command palette (`cmd-shift-p`) select `Install Extension` and choose `AngularDoc`.

## Usage

To run the `ng generate` commands, right click on a directory in the explorer and selet the command to run. Then enter the entity name in the input box, and press "Enter" to confirm.
_Note_: You have to be inside an angular-cli project in order to use the `ng generate` commands.

To visuallize your Angular 2 project's architecture, launch the "AngularDoc" editor in one of the following ways:
- Click on the status bar item "AngularDoc" (situated on the bottom left); or
- Choose `ngdoc` in the command palette (`cmd-shift-p`).

If this is the first time you use AngularDoc, you will be asked to sign up for an account on angulardoc.io. Once you are signed up or signed in, your source code's metadata (not the source code itself) will be submitted to AngularDoc's service for analysis, and you will see the analytical results in the AngularDoc editor.




