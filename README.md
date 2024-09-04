# `pw-tpl`
A set of utilities for the static [pug template](https://paraweb.space/VladislavBelozerov/pug-template).

## Installation
```bash
# npm
$ npm i pw-tpl -g

#yarn
$ yarn global add pw-tpl
```

## Features
### Quick template setup
Loads the newest template image into the current working directory.<br>
First of all you need to set global variable ```GITLAB_API_TOKEN``` with your GitLab private token.
#### How to set global variable
[MacOs](https://www.redswitches.com/blog/set-environment-variables-in-macos/)<br>
[Windows](https://www.devdungeon.com/content/set-environment-variables-windows#toc-7)

Then run:
```bash
$ pw-tpl init
```
And enter the name of new project.

### Module template
Adding new module template into ```src/modules``` directory.

```bash
$ pw-tpl add:module [options] <name>
```

#### Options
```-js``` Includes js module file.<br>
```-vue``` Includes Vue file instead of pug template.<br>
```-tests``` Includes js test file.<br>