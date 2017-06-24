# angular2-switcher
Easily navigate to `typescript(.ts)`|`template(.html)`|`style(.scss/.sass/.less/.css)` in angular2 project.

## Usage
* Go to the definition of variables/functions when press `f12` within html.

* Switch `.ts`|`.html`|`.scss` fastly. 
	* `alt+o`(Windows) `shift+alt+o`(macOS)
      ```
	  if on ts: go to html
	  if on css: go to html
	  if on html: go to previous (ts or css)
      ```

	* `alt+i`(Windows) `shift+alt+i`(macOS)
      ```
	  if on ts: go to css
	  if on html: go to css
	  if on css: go to previous (ts or html)
      ```

	* `alt+u`(Windows) `shift+alt+u`(macOS)
      ```
	  if on css: go to ts
	  if on html: go to ts
	  if on ts: go to previous (css or html)
      ```

## Release Notes
### 0.1.4(2017-2-15)
* Add icon.

### 0.1.3(2017-2-15)
#### Bug Fixes
* F12 on component variables using null propagation does not work ([#8](https://github.com/infinity1207/angular2-switcher/issues/8))
* File switching only within focused window editor ([#7](https://github.com/infinity1207/angular2-switcher/issues/7))


## Source
[GitHub](https://github.com/infinity1207/angular2-switcher)