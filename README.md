# generator-processwire

## NPM Installation

```
npm install -g generator-processwire
```

- [License](license.txt)
- [Manual Installation](install.md)

## What is generator processwire?

generator processwire is a yeoman generator that downloads and scaffolds  processwire, adds several modules and (if you wish) adds a complete grunt-based frontend-workflow to bundle and minify sass, js and image assets. Oh - if you're more into managing your frontend assets with ES6 and webpack we've got you covered soon!

### Ok, so what exactly does it do?
- downloads the latest processwire from github
- adds a fancy frontend toolchain [https://github.com/EX3MP/kickstarter-grunt/](https://github.com/EX3MP/kickstarter-grunt/)
- downloads a repo for a custom processwire site-profile (default: [https://github.com/EX3MP/site-rocket/](https://github.com/EX3MP/site-rocket/))
- downloads modules for custom profile from repos
- installs bower and npm modules via  configs
- creates a readme.md with all bower and npm modules that are used

--------------------------------------------------------------------------------

## Config.json

```bash
generator-processwire/app/config.default.json
generator-processwire/app/config.json // own config
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
            "headroom.js": "https://unpkg.com/headroom.js/bower.zip",
            "lazysizes": "*"
        }
    },
    "npm": {
        "scripts": {
            "setup": "npm install && bower install",
            "dev": "grunt dev",
            "build": "grunt build"
        },
        "dependencies": {},
        "devDependencies": {
            "grunt-copy": "0.1.0",
            "grunt": "0.4.3",
            "grunt-autoprefixer": "3.0.4",
            "grunt-banner": "0.6.0",
            "grunt-browser-sync": "2.2.0",
            "grunt-concurrent": "2.3.0",
            "grunt-contrib-copy": "1.0.0",
            "grunt-contrib-sass": "1.0.0",
            "grunt-contrib-uglify": "1.0.1",
            "grunt-contrib-watch": "1.0.0",
            "grunt-exec": "1.0.0",
            "grunt-modernizr": "1.0.2",
            "grunt-sass": "1.2.0",
            "load-grunt-tasks": "3.5.0",
            "foundation-sites": "*"
        }
    }
}
```
