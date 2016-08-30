# generator-processwire

## NPM Installation

```
npm install -g generator-processwire
```

- [License](license.txt)
- [Manual Installation](install.md)
- **Version: 0.0.7 [(Dev 0.0.8)](?at=dev)**

## What is generator processwire?

generator processwire is a yeoman generator that downloads and scaffolds  processwire, adds several modules and (if you wish) adds a complete grunt-based frontend-workflow to bundle and minify sass, js and image assets. Oh - if you're more into managing your frontend assets with ES6 and webpack we've got you covered soon!

### Ok, so what exactly does it do?
- downloads the latest processwire from github
- adds a fancy frontend toolchain [https://github.com/EX3MP/kickstarter-grunt/](https://github.com/EX3MP/kickstarter-grunt/)
- downloads a repo for a custom processwire site-profile
- downloads modules for custom profile from repos
- installs bower and npm modules via  configs
- creates a readme.md with all bower and npm modules that are used

--------------------------------------------------------------------------------

## Config.json

```bash
generator-processwire/app/config.default.json
generator-processwire/app/config.json
```

### config.json example

```json
{
    "kickstarter": {
        "branch":"master",
        "name": "kickstarter-grunt",
        "url": "git@github.com:EX3MP/kickstarter-grunt.git"
    },
    "profile": {
        "branch":"master",
        "name": "site-rocket",
        "url": "git@github.com:EX3MP/site-rocket.git"
    },
    "questions_defaults": {
        "name": "no-name",
        "author" : "",
        "authorUrl" : "",
        "authorMail": "",
        "description": ""
    }
}
```

### yo-processwire.json example from [kickstarter-grunt](https://github.com/EX3MP/kickstarter-grunt)

```json
{
    "mv": [{
        "from": "install/_Gruntfile.js",
        "to": "Gruntfile.js"
    }],
    "bower": {
        "dependencies": {
            "jquery": "*",
            "owl-carousel2": "*",
            "headroom.js": "https://npmcdn.com/headroom.js/bower.zip",
            "lazysizes": "*"
        }
    },
    "npm": {
        "dependencies": {},
        "devDependencies": {
            "grunt": "*",
            "grunt-cli": "*",
            "grunt-exec": "*",
            "grunt-copy": "*",
            "grunt-banner": "*",
            "grunt-modernizr": "*",
            "grunt-sass": "*",
            "load-grunt-tasks": "*",
            "grunt-concurrent": "*",
            "grunt-autoprefixer": "*",
            "grunt-contrib-sass": "*",
            "grunt-contrib-copy": "*",
            "grunt-browser-sync": "*",
            "grunt-contrib-watch": "*",
            "grunt-contrib-uglify": "*",
            "foundation-sites": "*"
        }
    }
}
```
