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
Loads the newest template image into the current working directory.

```bash
$ pw-tpl init
```

### Module template
Adding new module template into ```src/modules``` directory.

```bash
$ pw-tpl add:module [options] <name>
```

#### Options
```-js``` Includes js module file.<br>
```-jsx``` Includes JSX file instead of pug template and js-module.<br>
```-tests``` Includes js test file.<br>