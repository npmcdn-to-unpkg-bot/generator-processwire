## Installing third party stuff 

### Windows

Download and install Ruby:
http://rubyinstaller.org/downloads/

Download and install NodeJS:
http://nodejs.org/download/

Add the following to your "PATH" variable:
C:\Ruby<version>\bin;C:\Users\<nutzer>\AppData\Roaming\npm

### Mac: coming soon

### Linux: coming soon

## Installing Components for Yeoman (and yeoman itself)

After installing the third party stuff, there is even more that needs to be set up:

Install sass:

```bash
gem install sass
```

Install Bower:

```bash
npm install -g bower
```

Install Yeoman

```bash
npm install -g yo
```

* * *
#### aside

If you have problems with

```bash
gem install sass
```

you can do

```bash
gem sources -a http://rubygems.org
```

and retry installing
