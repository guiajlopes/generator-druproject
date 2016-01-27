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
    chalk.red(
      'With this you can create the scaffolding for your own Drupal Project.' + '\n'
    )
  );
};

module.exports = DruProjectGenerator;
