# CSS-MINIFY

This is a very simple vscode extension. Takes your css file and minify it. It doesn't need any special configuration and it doesn't mess up your css file.

# How to
Just press `Ctrl|Cmd + F1 (F2 I think is in linux)` and type `css minify`

## Features

* Removes the units from `0` value.
* Removes the `0` value from any float value. (From `0.16em` to `.16em`)
* Removes the last `;` from a closure.
* Removes white spaces.
* Reduce the `hex` values. (From `#ffffff` to `#fff`)


> At the end fo everything, the extension will make a new file with the same name as the file you are editing, but with the postfix `min.css`.

Enjoy it :)