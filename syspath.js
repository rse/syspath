/*!
**  SysPath -- System Paths Determination (Home and Data Directories)
**  Copyright (c) 2016-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  internal requirements  */
const os     = require("os")
const fs     = require("fs")
const path   = require("path")

/*  external requirements  */
const mkdirp = require("mkdirp")

/*  the API function  */
module.exports = function (opts) {
    /*  determine default application name  */
    let appName = "unknown"
    if (typeof process.versions.electron === "string")
        appName = require("electron").app.getName()
    else if (process.argv.length >= 2 && process.argv[1].match(/\.js$/))
        appName = path.basename(process.argv[1]).replace(/\.js$/, "")

    /*  determine options  */
    let options = {
        appName:           appName,
        dataDirMode:       (parseInt("0755", 8) & ~process.umask()),
        dataDirAutoCreate: true,
        dataDirAutoRemove: true
    }
    if (typeof opts === "object")
        Object.assign(options, opts)

    /*  determine home directory  */
    let homeDir = ""
    if (process.env.USERPROFILE)
        homeDir = path.resolve(process.env.USERPROFILE)
    else if (process.env.HOME)
        homeDir = path.resolve(process.env.HOME)
    else
        homeDir = path.resolve(os.homedir())
    if (!fs.existsSync(homeDir))
       throw new Error("home directory not found: \"" + homeDir + "\"")

    /*  determine data directory  */
    let dataDir = ""
    let platform = os.platform()
    if (platform === "win32")
        dataDir = process.env.APPDATA
    else if (platform === "darwin")
        dataDir = path.join(homeDir, "Library", "Application Support")
    else if (process.env.XDG_CONFIG_HOME)
        dataDir = path.resolve(process.env.XDG_CONFIG_HOME)
    else
        dataDir = path.join(homeDir, ".config")
    dataDir = path.join(dataDir, options.appName)
    if (!fs.existsSync(dataDir)) {
        if (options.dataDirAutoCreate) {
            mkdirp.sync(dataDir, { mode: options.dataDirMode })
            if (!fs.existsSync(dataDir))
                throw new Error("failed to auto-create data directory: \"" + dataDir + "\"")
            if (options.dataDirAutoRemove)
                process.on("exit", function (code) {
                    try { fs.rmdirSync(dataDir) } catch (ex) {}
                })
        }
        else
            throw new Error("data directory not found: \"" + dataDir + "\"")
    }

    /*  return home and data directory  */
    return { homeDir: homeDir, dataDir: dataDir }
}

