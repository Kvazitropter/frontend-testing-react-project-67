# Page-loader

[![Actions Status](https://github.com/Kvazitropter/frontend-testing-react-project-67/workflows/hexlet-check/badge.svg)](https://github.com/Kvazitropter/frontend-testing-react-project-67/actions)

-------------------------------------------------------------------------------------

This project provides a console command which loads web pages into specified directory.

-------------------------------------------------------------------------------------

### Installation:

1. npm install @hexlet/code
2. make install

-------------------------------------------------------------------------------------

### Usage:

#### Command page-loader:

[![asciicast](https://asciinema.org/a/bCPRB99HoUgBWLJPLtaJDRfU3.svg)](https://asciinema.org/a/bCPRB99HoUgBWLJPLtaJDRfU3)

#### Function:

```js
import pageLoader from '@hexlet/code';

await pageLoader('https://ru.hexlet.io', '/var/temp');
// { filepath: '/var/temp/ru-hexlet-io.html } - object with path to downloaded file
```

-------------------------------------------------------------------------------------