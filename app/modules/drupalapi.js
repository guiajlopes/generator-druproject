var xml2js = require('xml2js');
var https = require('https');

function DrupalAPI(projectName, majorVersion) {
  this.endPoint = "https://updates.drupal.org/release-history";
  this.projectName = projectName;
  this.majorVersion = majorVersion;

  /**
   * Get XML from drupal org release history.
   */
  this.getXML = function(callback) {
    var url = this.endPoint + '/' + this.projectName + '/' + this.majorVersion;
    var request = https.get(url, function(res) {
      var xml = '';
      res.on('data', function(chunk) {
        xml += chunk;
      });

      res.on('end', function() {
        callback(xml);
      })
    });

    request.on('error', function(err) {
      throw err;
    });
  }

  /**
   * Get last Stable version object.
   */
  this.getLastRelease = function(callback) {
    this.getXML(function (xml) {
      xml2js.parseString(xml, function(err, json) {
        if (err) {
          throw new Error('Cant parse xml');
        }

        callback(json.project.releases[0].release[0]);
      });
    });
  }
};

module.exports = DrupalAPI;
