'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');
var child_process = require('child_process');
var DrupalAPI = require('./modules/drupalapi');
var https = require('https');
var ncp = require('ncp').ncp;

var DruProjectGenerator = yeoman.generators.Base.extend();

DruProjectGenerator.prototype.askQuestions = function () {
  var _self = this;
  var cb = _self.async();

  fs.readFile(_self._sourceRoot + '/misc/druplicon-color.txt', 'binary', function(err, data) {
    _self.log(data.toString("ascii"));

    // Have Yeoman greet the user.
    _self.log(chalk.green('Welcome to DruProjectGenerator'));
    _self.log(chalk.green('With this you can create the scaffolding for your own Drupal Project.' + '\n'));

    var prompts = [];
    prompts.push({
      type: 'string',
      name: 'projectName',
      message: 'What\'s your project\'s name?' + chalk.red(' (Required)'),
      validate: required,
    });
    prompts.push({
      type: 'string',
      name: 'projectPath',
      message: 'What\'s your project\'s path?',
      validate: required,
      default: function(answers) {
        return '/www/' + answers.projectName;
      }
    });
    prompts.push({
      type: 'list',
      name: 'drupalVersion',
      message: 'Which major version would you like to use?',
      choices: ['7.x', '8.x'],
      default: '7.x',
    });
    prompts.push({
      type: 'confirm',
      name: 'installTeka',
      message: 'Would you like to install teka theme?',
    });
    prompts.push({
      type: 'string',
      name: 'themePath',
      message: 'What\'s the theme path?',
      default: function(answers) {
        return 'docroot/sites/all/themes/' + answers.projectName;
      },
      when: function(answers) {
        return answers.installTeka == true;
      },
      validate: required,
    });
    prompts.push({
      type: 'string',
      name: 'projectHost',
      message: 'What\'s your dev host?',
      default: function(answers) {
        return answers.projectName + '.l';
      },
      when: function(answers) {
        return answers.installTeka == true;
      },
      validate:required,
    });
    prompts.push({
      type: 'confirm',
      name: 'importingJenkinsScripts',
      message: 'Would you like to import Jenkins scripts?',
      when: function(answers) {
        return answers.installTeka == true;
      }
    });

    _self.prompt(prompts, function (props) {
      _self.projectName = props.projectName.replace(/\s+/g, '_').toLowerCase();
      _self.projectSlug = _s.underscored(props.projectName);
      _self.drupalVersion = props.drupalVersion;
      _self.importingJenkinsScripts = props.importingJenkinsScripts;
      _self.themePath = props.themePath;
      _self.projectHost = props.projectHost;
      _self.projectPath = props.projectPath;
      _self.installTeka = props.installTeka;

      cb();
    });
  });
};

/**
 * Starting generate project.
 */
DruProjectGenerator.prototype.generateProject = function () {
  var _self = this;
  // Create project directory.
  mkdirp(_self.projectPath);

  // Set our destination to be the new directory.
  _self.destinationRoot(_self.projectPath);
  _self.copy('_.gitignore', '.gitignore');

  // Install scripts if checked on prompts.
  if (_self.importingJenkinsScripts) {
    mkdirp('scripts');
    _self.destinationRoot('scripts');
    _self.template('_build.sh', 'build.sh');
    _self.template('_deploy.sh', 'deploy.sh');
    _self.destinationRoot(_self.projectPath);
  }

  // DrupalAPI Request.
  var api = new DrupalAPI('drupal', _self.drupalVersion);

  api.getLastRelease(function(release) {
    var url = release.download_link[0];

    // Downloading drupal core.
    download(url, _self._sourceRoot + '/drupal.tar.gz', function() {
      var file_name = getFileNameByUrl(url);

      mkdirp('docroot');
      try {
        var stats = fs.lstatSync(_self._sourceRoot + '/' + file_name);
        _self.destinationRoot(_self.projectPath);
        ncp(_self._sourceRoot + '/' + file_name, _self.projectPath + '/docroot');
      }
      catch (e) {
        child_process.exec('tar xfz ' + _self._sourceRoot + '/drupal.tar.gz -C ' + _self._sourceRoot, function() {
          ncp(_self._sourceRoot + '/' + file_name, _self.projectPath + '/docroot');
        });
      }

      // If isntall teka is checked.
      if (_self.installTeka) {
        var Teka = require('./modules/generateteka');
        var generator_teka = new Teka(_self);
        generator_teka.generate();
      }
    });

  });
}

/***************
 *** Helpers ***
 **************/

/**
 * Download file.
 */
function download(url, dest, cb) {
  try {
    var stats = fs.lstatSync(dest);
    cb();
  }
  catch (e) {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);
      });
    });

    request.on('error', function(err) {
      fs.unlink(dest);
      if (cb) {
        cb(err)
      };
    });
  }
}

/**
 * Simple required validation.
 */
function required(input) {
  return input ? true : 'This option is required';
}

/**
 * Get the file name by url.
 */
function getFileNameByUrl(url) {
  // Getting Drupal folder name.
  var split_url = url.split('/');
  var file_name = split_url.slice(-1).pop();
  file_name = file_name.split('.tar.gz');

  return file_name[0];
}

module.exports = DruProjectGenerator;
