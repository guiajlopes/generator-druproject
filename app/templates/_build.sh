#!/bin/sh

#
# Script to build our project
#

# Go to theme path.
cd <%= themePath %>

# Install necessary modules.
npm install

# Build gulp.
gulp build

# Go to drupal folder.
cd ../../../..

# Run code sniffer checks.
if [-d "sites/all/modules/custom"]; then
  drush dcs --extensions=module,install,inc sites/all/modules/custom
fi

if [-d "sites/all/modules/features"]; then
  drush dcs --extensions=module,install,inc sites/all/modules/features
fi
