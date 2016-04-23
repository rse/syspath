
SysPath
=======

**System Paths Determination (Home and Data Directories)**

<p/>
<img src="https://nodei.co/npm/syspath.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/syspath.png" alt=""/>

Abstract
--------

This is a small [Node](https://nodejs.org/) module for conveniently
determining the home and data directories of an application.

Installation
------------

```sh
$ npm install syspath
```

Usage
-----

```js
import syspath from "syspath"
let { homeDir, dataDir } = syspath({ appName: "foo" })
console.log(`homeDir: ${homeDir}, dataDir: ${dataDir}`)
```

Application Programming Interface
---------------------------------

```ts
syspath({
    appName?:           string,
    dataDirMode?:       number,
    dataDirAutoCreate?: boolean,
    dataDirAutoRemove?: boolean,
}): {
    homeDir:            string,
    dataDir:            string
}
```

- The `appName` is the name of the application. By default this is
  `path.basename(process.argv[1]).replace(/\.[^.]+$/, "")`.

- The `dataDirMode` is the numerical filesystem mode used for creating the
  `dataDir` (if still not existing and `dataDirAutoCreate` is `true`). The
  default is `parseInt("0755", 8) & ~process.umask()`.

- The `dataDirAutoCreate` forces the automatic creation of the `dataDir`
  (if still not existing, which is usually the case on the initial usage).
  By default this is `true`.

- The `dataDirAutoRemove` forces the automatic removal of the `dataDir` if
  it is still empty at the application termination time. By default this
  is `true`.

- The `homeDir` is the resolved path to the home directory of the user
  the application is executed under. The home directory is usually
  `%USERPROFILE%` on Windows or `$HOME` on Mac OS X, Linux and FreeBSD.

- The `dataDir` is the resolved path to the dedicated data directory for
  the application. The data directory is usually `%APPDATA%/<appName>` on
  Windows, `$HOME/Library/Application Support/<appName>` on Mac OS X and
  `$XDG_CONFIG_HOME/<appName>` or `$HOME/.config/<appName>` on Linux and
  FreeBSD.

License
-------

Copyright (c) 2016 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

