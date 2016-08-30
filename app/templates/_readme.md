# <%= name %>


## Description:

Author: <%= author %>

Repos: <%= repository %>

<%= description %>


## Dev Infos

It's required to use node > v0.12.x for this project

Install dependencies with `npm install & bower install`


### build frontend assets for production use:

```bash
grunt build
```

runs tasks only once (and minify all files)

### start a watch task for development

```bash
grunt dev
```

This watches all scss, js, images and fonts for changes and copys the changed files to your site root.

### Install

```bash
npm install -g bower grunt grunt-cli
```

### Javascript assets
Add all external dependencies to `/jsAssets.json`. They will be included as single files while in "dev" environment and get bundled when in "production". Remember to restart the grunt task when you've added something.

```bash
/jsAssets.json
```

### bower
Bower assets get installed to:

```bash
/src/vendor/
```

### Processwire custom configs

* If you'd like to use the included custom configs you need to enable "TemplateTwigReplace" in the first place
* afterwards copy `config-nw.php` to your `site` directory and include it at the end of your `config.php`

### Required Versions


#### Misc

Libs|Version
---|---
sass|3.4.19
node|>=0.12.x
yo|>0
bower|~1.4.1

<%= readmenpm %>

```bash
npm install
```

<%= readmebower %>

```bash
bower install
```

#### Meta
build with: generator-processwire <%= pkg.version %>
