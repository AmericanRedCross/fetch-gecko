const settings = require('../settings.js')

const async = require('async')
const { DateTime } = require("luxon")
const Duration = require("luxon").Duration
const needle = require('needle')

// Wufoo expects the API key to be included as the 'username’ 
// and any value as the 'password’ portion of Basic Auth.
const myAuth = { username: settings.wufoo.apiKey, password: 'secret' }

var WUFOO = function() {}

// WUFOO.prototype.getEntries = function(surveyHash, endTime, hours, callback) {
//   // endTime should be for example: DateTime.fromObject({ hour: 17, zone: 'America/New_York' })
//   // hours should be an integer
//   var dur = Duration.fromObject({hours: hours});
//   var startTime = endTime.minus(dur);
//   // Wufoo interprets all dates/times as PST/PDT (UTC -8/-7) 
//   var endTimePacific = endTime.setZone('America/Los_Angeles').toSQL({ includeOffset: false });
//   var startTimePacific = startTime.setZone('America/Los_Angeles').toSQL({ includeOffset: false });
// 
//   var results = []
//   var finished = false
//   const pageSize = 100
//   var pageStart = 0
//   async.until(function test(cb) {
//     cb(null, finished)
//   }, function iter(next) {    
//     /* the `Is_before` filter isn't doing time of day */
//     // var myFilters = "?Filter{1}=DateCreated+Is_before+" + endTimePacific + 
//     //   "&Filter{2}=DateCreated+Is_after+" + startTimePacific + "&match=AND";
//     // var myParams = "pageSize=" + pageSize + "&pageStart=" + pageStart;
//     // var myURL = "https://" + settings.wufoo.subdomain + ".wufoo.com/api/v3/forms/" + surveyHash + "/entries.json?" + myFilters + "&" + myParams; 
//     var myFilters = "Filter{1}=DateCreated+Is_after+" + startTimePacific;
//     var myParams = "pageSize=" + pageSize + "&pageStart=" + pageStart;
//     var myURL = "https://" + settings.wufoo.subdomain + ".wufoo.com/api/v3/forms/" + surveyHash + "/entries.json?" +
//      myParams; 
//       console.log(myURL)
//       needle.get(myURL, myAuth, (error, response) => {
//         if (error) return next(error)
//         results = results.concat(response.body.Entries)
//         console.log(response.body.Entries.length)
//         finished = !response.body.Entries.length // return true if 0
//         pageStart += pageSize
//         next(error)
//       })
//   }, function done (err) {
//     // add the form name to all the entries
//     async.each(results, function(item, cb){
//       item["_form"] = settings.wufoo.formLookup[surveyHash];
//       var thisRegion = item["Field413"]
//       item["_division"] = settings.wufoo.divisionLookup[thisRegion]
//       if (item["Field1"].length > 0 || 
//           item["Field2"].length > 0 || 
//           item["Field3"].length > 0 || 
//           item["Field101"].length > 0 || 
//           item["Field201"].length > 0 || 
//           item["Field303"].length > 0 ) {
// 
//         item["_flag"] = "FLAGGED";
// 
//       }
//       cb();
//     }, function(err){
//       callback(err, results)
//     })
// 
//   })
// 
// }

WUFOO.prototype.getAllEntries = function(surveyHash, callback) {
  var results = []
  var finished = false
  const pageSize = 100
  var pageStart = 0
  async.until(function test(cb) {
    cb(null, finished)
  }, function iter(next) {    
    var myParams = "pageSize=" + pageSize + "&pageStart=" + pageStart;
    var myURL = "https://" + settings.wufoo.subdomain + ".wufoo.com/api/v3/forms/" + surveyHash + "/entries.json?" +
     myParams; 
      console.log(myURL)
      needle.get(myURL, myAuth, (error, response) => {
        if (error) return next(error)
        results = results.concat(response.body.Entries)
        console.log(response.body.Entries.length)
        finished = !response.body.Entries.length // return true if 0
        pageStart += pageSize
        next(error)
      })
  }, function done (err) {
    // add the form name to all the entries
    async.each(results, function(item, cb){
      item.DateCreated = item.DateCreated.replace(" ","T")
      item._dateTime = DateTime.fromISO(item.DateCreated).setZone(settings.wufoo.profileTz).toISO()
      item.DateCreated = DateTime.fromISO(item.DateCreated).setZone(settings.wufoo.profileTz).toISODate()
      item["_form"] = settings.wufoo.formLookup[surveyHash];
      // var thisRegion = item["Field413"]
      // item["_division"] = settings.wufoo.divisionLookup[thisRegion]
      if (item["Field1"].length > 0 || 
          item["Field2"].length > 0 || 
          item["Field3"].length > 0 || 
          item["Field101"].length > 0 || 
          item["Field201"].length > 0 || 
          item["Field303"].length > 0 ) {
        item["_flag"] = "FLAGGED";
      }
      cb();
    }, function(err){
      callback(err, results)
    })
  })
}

module.exports = WUFOO;
