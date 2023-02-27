# Page-loader

[![Actions Status](https://github.com/Kvazitropter/frontend-testing-react-project-67/workflows/hexlet-check/badge.svg)](https://github.com/Kvazitropter/frontend-testing-react-project-67/actions)
[![Node CI](https://github.com/Kvazitropter/frontend-testing-react-project-67/actions/workflows/node.js.yml/badge.svg)](https://github.com/Kvazitropter/frontend-testing-react-project-67/actions/workflows/node.js.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/f8b8bb2522fdacdcd61b/maintainability)](https://codeclimate.com/github/Kvazitropter/frontend-testing-react-project-67/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f8b8bb2522fdacdcd61b/test_coverage)](https://codeclimate.com/github/Kvazitropter/frontend-testing-react-project-67/test_coverage)

-------------------------------------------------------------------------------------

This project provides a console command which loads web pages into specified directory.

-------------------------------------------------------------------------------------

It is study project. The npm-package wasn't published, so the installation insruction below won't work.  
If you want to try this, use **git clone https://github.com/Kvazitropter/frontend-testing-react-project-67.git**

-------------------------------------------------------------------------------------

### Installation:

1. npm install @hexlet/code
2. make install

-------------------------------------------------------------------------------------

### Usage:

#### As command:

[![asciicast](https://asciinema.org/a/4XzQ0CUIj9eS4s7NFcbjAGu5c.svg)](https://asciinema.org/a/4XzQ0CUIj9eS4s7NFcbjAGu5c)

#### Logs:

[![asciicast](https://asciinema.org/a/hD47faFCrrnbRJAbpQVVThuZ7.svg)](https://asciinema.org/a/hD47faFCrrnbRJAbpQVVThuZ7)

#### As function:

```js
import pageLoader from '@hexlet/code';

await pageLoader('https://ru.hexlet.io', '/var/temp');
// { filepath: '/var/temp/ru-hexlet-io.html } - object with path to loaded file
```

-------------------------------------------------------------------------------------