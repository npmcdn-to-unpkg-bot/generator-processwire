'use strict';

var yeoman = require('yeoman-generator'), //yo!
	del = require('delete'), //save delete
	path = require('path'), //save delete
	wrench = require('wrench'), //for copy folder
	fs = require('fs.extra'), //fs for copy and more things!
	_this, //global this
	jsonfile = require('jsonfile'), //package json bearbeiten bspw durch yo-processwire.json oder der config.json
	chalk = require('chalk'); //for color writing

var ProcesswireGenerator = yeoman.generators.Base.extend({
	_merge: function (def, obj) {
		if (typeof obj === 'undefined') {
			return def;
		} else if (typeof def === 'undefined') {
			return obj;
		}
		for (var i in obj) {
			if (obj[i] !== null && obj[i].constructor === Object) {
				def[i] = this._merge(def[i], obj[i]);
			} else if (obj[i] !== null && obj[i].constructor === Array) {
				def[i] = def[i].concat(obj[i]);
			} else {
				def[i] = obj[i];
			}
		}
		return def;
	},
	_write: function (text, type) {
		type = type || 'text';
		switch (type) {
		case 'headline':
			console.log(chalk.bgBlue(text));
			break;
		case 'error':
			console.log(chalk.bgRed(text));
			break;
		case 'line':
			console.log(chalk.green(text + text + text + text + text + text + text + text + text + text + text + text + text + text + text));
			break;
		default: //its text :D
			console.log(chalk.green(text));
			break;
		}
	},
	_buildTable: function (name, object) {
		var output = '',
			determitter = '|';
		for (var key in object) {
			if (key.match(/dependencies/gi)) {
				if ((typeof object[key] === 'object' ? Object.keys(object[key]).length : object[key].length) > 0) {
					output += '\n'; //leerzeile vor der tabelle
					output += '#### ' + name + ' ' + key + '\n';
					output += 'Libs|Version\n';
					output += '---|---\n';
					for (var depKey in object[key]) {
						output += depKey + determitter + object[key][depKey] + '\n';
					}
				}
			} else {
				if (typeof object[key] === 'object') {
					output += '\n'; //leerzeile vor der tabelle
					output += '#### ' + name + ' ' + key + '\n';
					output += 'key|code\n';
					output += '---|---\n';
					for (var objectKey in object[key]) {
						output += objectKey + determitter + object[key][objectKey] + '\n';
					}
				} else {
					output += '\n'; //leerzeile vor der tabelle
					output += '#### ' + name + ' ' + key + '\n';
					output += key + determitter + object[key] + '\n';
				}
			}
		}
		return output;
	},
	_clear: function () {
		this._write('Clean Up', 'headline');
		// delete file gitignor from processwire
		del('htdocs/.gitignore', function (err) {
			if (err) {
				throw err;
			}
		});

		del('tmp/', function (err) {
			if (err) {
				throw err;
			}
		});
		this._write('Cleared!', 'headline');
	},
	_multiCheckout: function (module) {
		var prom = [];
		for (var key in module) {
			var mod = module[key];
			prom.push(this._checkout(mod.url, mod.path, mod.branch));
		}
		return Promise.all(prom);
	},
	_checkout: function (url, path, branch, checkFolder) {
		return new Promise(function (resolve, reject) {
			if (typeof checkFolder === 'undefined') checkFolder = true;
			if (checkFolder && fs.existsSync(path)) reject(path + ' exists');
			var args = ['clone', url, path];
			if (branch) {
				args.push('--branch');
				args.push(branch);
			}
			_this.spawnCommand('git', args)
				.on('error', function (err) {
					reject(err);
				})
				.on('close', function () {
					del(path + '/.git', function (err) {
						if (err) reject(err);
					});
					del(path + '/.gitignore', function (err) {
						if (err) reject(err);
					});
					resolve(path);
				});
		});
	},
	_ypjModules: function (modules) {
		this._write(' Module: ' + _this.config.profile.name);
		if (modules) {
			modules = this._merge(this.config.profile.modules, modules);
			this.config.profile.modules = modules;

			for (var i = 0; i < modules.length; i++) {
				this._write('  - ' + modules[i].name);
			}
		}
	},
	_ypjBower: function (bower) {
		this.config.bower = this._merge(this.config.bower, bower);
	},
	_ypjNPM: function (npm) {
		this.config.npm = this._merge(this.config.npm, npm);
	},
	/**
	 * @name _ypjClone
	 * @param clones array
		clones:
		[
			{
				url: '', // git url
				branch: 'master' // welche rbranch
				path: '' // der pfad ist relative zum ordern (nicht aus profile oder kickstarter)
			}
		]
	*/
	_ypjClone: function (clones) {
		this._multiCheckout(clones);
	},
	_ypjMove: function (setupPath, move) {
		for (var i = 0; i < move.length; i++) {
			this._write('Move: ' + move[i].from + ' --to-> ' + move[i].to);
			var dirname = path.dirname(move[i].to);
			if (!fs.existsSync(dirname)) {
				this.dest.mkdir(dirname); //create folder
			}
			fs.copy(setupPath + '/' + move[i].from, this.destinationRoot() + '/' + move[i].to, {
				replace: true
			}, function (err) {
				if (err) throw err;
			});
		}
	},
	_setupYoProcesswireJson: function (setupPath) {
		return new Promise(function (resolve, reject) {
			if (fs.existsSync(setupPath + '/install/yo-processwire.json')) {
				// asynchronous version
				jsonfile.readFile(setupPath + '/install/yo-processwire.json', function (err, tmp) {
					if (err) reject(err);
					if (tmp.modules) _this._ypjModules(tmp.modules);
					if (tmp.bower) _this._ypjBower(tmp.bower);
					if (tmp.npm) _this._ypjNPM(tmp.npm);
					if (tmp.mv) _this._ypjMove(setupPath, tmp.mv);
					if (tmp.clone) _this._ypjClone(tmp.clone);
					resolve(setupPath);
				});
			} else {
				resolve(setupPath);
			}
		});
	},
	initializing: function () {
		this._write('Init:', 'headline');
		_this = this; // Fu get this as _this globel -.-

		this._write('Load:', 'headline');
		var readUserConfig = false;
		if (fs.existsSync(__dirname + '/config.json')) {
			readUserConfig = true;
		}

		this._write('- package.json');
		this.pkg = require('../package.json');

		this._write('- config.default.json');
		this.defaultConfig = require('./config.default.json');

		this._write('- setup.json');
		this.setups = require('./setup.json');

		if (readUserConfig) {
			this._write('- config.json');
			this.config = require('./config.json');
		}

		if (!this.config) {
			this.config = this.defaultConfig;
		} else {
			this.config = this._merge(this.defaultConfig, this.config); //merge fehlende elemente
		}

		this._write('Configure Questions:', 'headline');
		if (Object.keys(this.config.profile).length > 0) {
			this._write('- Profile:' + this.config.profile.name);
			this.setups.questions.push({
				'type': 'confirm',
				'name': 'useProfile',
				'message': 'use Profile -> ' + this.config.profile.name,
				'default': true
			});
		}

		if (Object.keys(this.config.kickstarter).length > 0) {
			this._write('- Kickstarter:' + this.config.kickstarter.name);
			this.setups.questions.push({
				'type': 'confirm',
				'name': 'useKickstarter',
				'message': 'use Kickstarter -> ' + this.config.kickstarter.name,
				'default': true
			});
		}

		this._write('- Merge Defaults');
		for (var key in this.setups.questions) {
			var quest = this.setups.questions[key];
			if (this.config.questions_defaults[quest.name]) {
				this.setups.questions[key].default = this.config.questions_defaults[quest.name];
			}
		}

		this._write('Processwire:', 'headline');
		this._write('- Branch: ' + this.config.processwire.branch);

	},
	prompting: function () {
		var done = this.async();
		this._write('Questions:', 'headline');
		this.prompt(this.setups.questions, function (props) {
			for (var j = 0; j < this.setups.questions.length; j++) {
				var value = this.setups.questions.slice(j, j + 1)[0];
				if (typeof value === 'undefined') {
					continue;
				}
				if (this[value]) {
					this.env.error('Eine Frage wurde bereits gesetzt, ggf sollte ihr der einen anderen namen geben.');
				}
				this[value.name] = props[value.name];
			}
			done();
		}.bind(this));
	},
	configuring: function () {
		//setup packagejson variables
		this.assetsPath = 'htdocs/site/assets/';
		this.templatesPath = 'htdocs/site/tempaltes/';

		this._write('Setup Templates', 'headline');

		// Copy Templates
		for (var j = 0; j < this.setups.templates.length; j++) {
			this.template(this.setups.templates[j], './' + (this.setups.templates[j].charAt(0) === '_' ? this.setups.templates[j].substring(1) : this.setups.templates[j]));
		}

		this.dest.mkdir('tmp'); //create tmp folder (will be removed later)
		this.dest.mkdir('/tmp/modules/'); //create tmp folder (will be removed later)
	},
	default: {
		setupProcesswire: function () {
			var done = _this.async(),
				desPath = this.destinationRoot();
			this._write('Build Proccesswire', 'headline');
			this._checkout('https://github.com/' + this.config.processwire.user + '/' + this.config.processwire.reposetory + '.git', desPath + '/htdocs/', this.config.processwire.branch, false)
				.then(this._setupYoProcesswireJson)
				.then(function () {
					done();
				}).catch(function (err) {
					throw err;
				});

		}
	},
	writing: {
		setupProfile: function () {
			if (this.useProfile) {
				var done = this.async();
				var srcPath = this.destinationRoot() + '/htdocs/' + this.config.profile.name;
				var args = ['git', 'clone', this.config.profile.url, srcPath];
				if (this.config.profile.branch) {
					args.push('--branch');
					args.push(this.config.profile.branch);
				}

				this._write('checkout: ' + this.config.profile.url + (this.config.profile.branch ? ' @ ' + this.config.profile.branch : ''));
				this._checkout(this.config.profile.url, srcPath, this.config.profile.branch)
					.then(this._setupYoProcesswireJson)
					.then(function () {
						done();
					}).catch(function (err) {
						throw err;
					});
			}
		},
		setupSrc: function () {
			if (this.useKickstarter) {
				var srcPath = this.destinationRoot() + '/src';
				var done = this.async();
				this._write('checkout: ' + this.config.kickstarter.url + (this.config.kickstarter.branch ? ' @ ' + this.config.kickstarter.branch : ''));
				this._checkout(this.config.kickstarter.url, srcPath, this.config.kickstarter.branch)
					.then(this._setupYoProcesswireJson)
					.then(function () {
						done();
					}).catch(function (err) {
						throw err;
					});
			} else {
				this.dest.mkdir('src');
				this.dest.mkdir('src/vendor'); //wird durch bower befüllt
				this.dest.mkdir('src/fonts/');
				this.dest.mkdir('src/images/');
				this.dest.mkdir('src/scripts/');
				this.dest.mkdir('src/styles/');
			}
		},
		setupModules: function () {
			if (this.config.profile.modules) {
				var done = _this.async(),
					mod = [],
					destPath = _this.destinationRoot() + '/tmp/modules/';
				//create TMP
				this.dest.mkdir('tmp');
				this.dest.mkdir('tmp/modules');
				// build multiCheckout
				this.config.profile.modules.forEach(function (item) {
					mod.push({
						url: (item.type === 'public' ? 'https://github.com/' + item.user + '/' + item.reposetory + '.git' : item.url),
						path: destPath + item.path + '/',
						branch: item.branch
					});
				});
				_this._multiCheckout(mod)
					.then(function () {
						done();
					}).catch(function (err) {
						throw err;
					});
			}

		}
	},
	install: function () {

		var desPath = this.destinationRoot();
		this._write('Add Processwire Modules to ' + this.config.profile.name, 'headline');
		wrench.copyDirSyncRecursive(desPath + '/tmp/modules/', desPath + '/htdocs/' + this.config.profile.name + '/modules/', {
			forceDelete: true
		});

		this._write('Build Bower and package.json', 'headline');
		jsonfile.spaces = 4;

		var packagePath = this.destinationRoot() + '/package.json',
			bowerPath = this.destinationRoot() + '/bower.json',
			pack = jsonfile.readFileSync(packagePath),
			bow = jsonfile.readFileSync(bowerPath);

		pack = this._merge(pack, this.config.npm);
		bow = this._merge(bow, this.config.bower);

		var done = this.async();
		jsonfile.writeFile(packagePath, pack, function (err) {
			if (err) throw err;
			jsonfile.writeFile(bowerPath, bow, function (err) {
				if (err) throw err;

			});
		});

		this._write('Build Readme', 'headline');
		this.readmenpm = this._buildTable('node', _this.config.npm);
		this.readmebower = this._buildTable('bower', _this.config.bower);
		this.template(this.setups.readme, './' + (this.setups.readme.charAt(0) === '_' ? this.setups.readme.substring(1) : this.setups.readme));

		this._write('bower install', 'headline');
		this.spawnCommand('bower', ['install'])
			.on('close', function () {
				_this._write('npm install', 'headline');
				_this.spawnCommand('npm', ['update', '--save', '--save-dev']).on('close', done);
			});
	},
	end: function () {
		this._clear();
	}
});
module.exports = ProcesswireGenerator;
