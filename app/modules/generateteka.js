var mkdirp = require('mkdirp');

function Teka (_self) {
  this._self = _self;
  this.generate = function() {
    // Create our theme directory
    mkdirp(_self.themePath);
    // Set our destination to be the new directory.
    _self.destinationRoot(_self.themePath);

    // Make all the directories we know that we will need.
    console.log(_self);
    mkdirp('dist');
    mkdirp('dist/css');
    mkdirp('dist/js');
    mkdirp('dist/js/lib');
    mkdirp('dist/img');
    mkdirp('assets');
    mkdirp('assets/scss');
    mkdirp('assets/scss/base');
    mkdirp('assets/scss/components');
    mkdirp('assets/scss/config');
    mkdirp('assets/scss/partials');
    mkdirp('assets/js');
    mkdirp('assets/img');
    mkdirp('assets/img/sprite');

    mkdirp('templates');

    // General theme files.
    _self.template('templates_teka/_teka.info', _self.projectName + '.info');
    _self.template('templates_teka/_template.php', 'template.php');

    // Populating directories.
    _self.directory('templates_teka/scss/base', 'assets/scss/base');
    _self.directory('templates_teka/scss/components', 'assets/scss/components');
    _self.directory('templates_teka/scss/config', 'assets/scss/config');
    _self.directory('templates_teka/scss/partials', 'assets/scss/partials');
    _self.directory('templates_teka/templates', 'templates');

    // Gulp settings file.
    _self.template('templates_teka/_gulpfile.js', 'gulpfile.js');
    _self.template('templates_teka/_package.json', 'package.json');

    // Images
    _self.copy('templates_teka/logo.png', 'logo.png');
    _self.copy('templates_teka/_screenshot.jpg', 'screenshot.jpg');
    _self.copy('templates_teka/sample.png', 'assets/img/sprite/sample.png');

    // Sample JavaScript file.
    _self.copy('templates_teka/script.js', 'assets/js/main.js');

    // Sample SCSS file.
    _self.copy('templates_teka/scss/print.scss', 'assets/scss/print.scss');
    _self.copy('templates_teka/scss/style.scss', 'assets/scss/style.scss');

    // Some config files we want to have.
    _self.copy('templates_teka/ignore.gitignore', '.gitignore');
    _self.copy('templates_teka/README.txt', 'README.txt');

    _self.destinationRoot(_self.projectPath);
  }
};

module.exports = Teka;
