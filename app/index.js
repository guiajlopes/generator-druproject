'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

var DruProjectGenerator = yeoman.generators.Base.extend();

DruProjectGenerator.prototype.askForBase = function () {
  var cb = this.async();
  // Have Yeoman greet the user.
  this.log(yosay('Welcome to DruProjectGenerator'));

  this.log(
    chalk.yellow(
      'With this you can create the scaffolding for your own Drupal Project.' + '\n'
    )
  );

  var prompts = [
    {
      type: 'string',
      name: 'projectName',
      message: 'What\'s your project\'s name?' + chalk.red(' (Required)'),
      validate: function (input) {
        if (input === '') {
          return 'Please enter your project\'s name';
        }
        return true;
      }
    }
  ]

  this.prompt(prompts, function (props) {

  });
};

module.exports = DruProjectGenerator;
