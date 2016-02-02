# yo teka #

Repo for the amazing Teka drupal theme's yeoman generator.

### How to get started? ###


First, install Teka generator's package globally:
```
#!javascript
sudo npm i -g generator-teka
```

Then you go to your project's theme dir
```
#!javascript
cd /www/yourProject/sites/all/themes/
```

Run our yeoman generator (System will ask you for a project name)
And after install, enter in your theme dir
```
#!javascript
yo teka
cd theNameYouChose/
```


Install packages and, finally, run gulp for the taks generator
```
#!javascript
sudo npm i --unsafe-perm
gulp
```

### What's required? ###

* Nodejs installed
* Drupal core installed

### Whats comes with Teka? ###

* Bourbon + Neat for sass mixins and grids
* Spritesmith for sprite generation (Just save png files into assets/img/sprite and retrieve on dist/img/sprite.png)
* Sass compile and minify
* JS concat and uglify
