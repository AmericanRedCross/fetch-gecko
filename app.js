global.__basedir = __dirname;

const settings = require('./settings.js') 
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process');


const async = require('async')
const { DateTime } = require("luxon")
const Duration = require("luxon").Duration
const generate = require('csv-generate')
const needle = require('needle')
const Papa = require('papaparse')

const WUFOO = require('./routes/WUFOO.js')
const wufoo = new WUFOO()

const express = require('express')
const app = express()

// app.use(express.static(path.join(__dirname, "public")));
// 
// app.listen(settings.app.port, 'localhost', () => {
//  console.log('Listening to requests on localhost:${port}');
// });

function dataFetch(){
  
  async.waterfall([
    function(cb) { 
      console.log("getting data from wufoo ...")
      var results = []
      async.each(settings.wufoo.hashes, function(surveyHash, callback) {  
        wufoo.getAllEntries(surveyHash, function(err, entries){
          results = results.concat(entries)
          callback();
        });
      }, function(err){ 
        cb(err, results)
      });
    },
    function(result, cb) {
      
      function compare( a, b ) {
        if ( a._dateTime < b._dateTime ){
          return -1;
        }
        if ( a._dateTime > b._dateTime ){
          return 1;
        }
        return 0;
      }
      result.sort( compare );

      console.log("writing all data to csv ...")
      // var fileName = DateTime.local().toFormat("yyyy-MM-dd") + " all.csv";
      var fileName = "screening-data.csv"
      const outputFile = path.join(settings.app.folderPath,fileName);
      const createCsvWriter = require('csv-writer').createObjectCsvWriter;
      const csvWriter = createCsvWriter({
          path: outputFile,
          header: settings.wufoo.header
      });
      csvWriter.writeRecords(result)       // returns a promise
          .then(() => {
            // console.log("running Rscript ...") 
            // const rscript = spawn('Rscript', [path.join(settings.app.folderPath,"volunteer-monitoring-daily-report.R")])
            // rscript.stdout.on('data', (data) => {
            //   console.log(`Rscript stdout: ${data}`);
            // });
            // rscript.stderr.on('data', (data) => {
            //   console.error(`Rscript stderr: ${data}`);
            // });
            // rscript.on('close', (code) => {
            //   console.log(`child process for Rscript exited with code ${code}`);
            //   cb(null, outputFile);
            // });            
          cb(null);
          });

    }
    // ,function(outputFile, cb){
    //   console.log("creating filtered csv with most recent ...")
    //   Papa.parse(fs.readFileSync(outputFile, 'utf8'), {
    //     header: true,
    //     skipEmptyLines: true,
    //     error: function(error) {
    //       if(error) console.log(error)
    //     },
    //     complete: function(results) {
    //       var filteredResults = []
    //       var hours = 0;
    //       // var endTime = DateTime.fromObject({ hour: 17, zone: 'America/New_York' }); 
    //       // if(endTime.weekday === 2) { hours = 120; } // Tues
    //       // if(endTime.weekday === 4) { hours = 48; } // Thurs
    //       // var dur = Duration.fromObject({hours: hours});
    //       // var startTime = endTime.minus(dur); 
    //       var endTime = DateTime.fromObject({ hour: 15, zone: 'America/New_York' }); 
    //       var dur = Duration.fromObject({days: 7});
    //       var startTime = endTime.minus(dur); 
    //       async.each(results.data, function(row, eachCallback) {
    //         var rowDt = DateTime.fromISO(row._dateTime);
    //         if(rowDt < endTime && rowDt > startTime) {
    //           filteredResults = filteredResults.concat(row);
    //         }
    //         eachCallback();
    //       }, function(err){ 
    //         if(err) cb(err)
    //         var filteredCsv = Papa.unparse(filteredResults);
    //         var filteredFileName =  endTime.toFormat("yyyy-MM-dd'T'HH'-'mmZZZZ") + " from after " + startTime.toFormat("yyyy-MM-dd'T'HH'-'mm") + ".csv";
    //         var outputfilteredCsv = path.join(settings.app.folderPath,filteredFileName)
    //         if (fs.existsSync(outputfilteredCsv)) {
    //           fs.unlinkSync(outputfilteredCsv);
    //         }
    //         fs.writeFileSync(outputfilteredCsv, filteredCsv);
    //         cb()
    //       });
    //     }
    //   });
    // }
    ],
    function(err, result){
      if(err) {
        // ... TODO
        console.log(err)
      } else {
        console.log("finished, starting sync ...")
        const syncScript = spawn('onedrive', ["--synchronize"])
        syncScript.stdout.on('data', (data) => {
          console.log(`onedrive stdout: ${data}`);
        });
        syncScript.stderr.on('data', (data) => {
          console.error(`onedrive stderr: ${data}`);
        });
        syncScript.on('close', (code) => {
          console.log(`child process for onedrive exited with code ${code}`);
        });
      }
    }
  ) 
}
dataFetch();
// run something every Wednesday at 3pm .... '00 00 15 * * 3'
var CronJob = require('cron').CronJob;
// run every hour
new CronJob('00 00 * * * *', function() {
  dataFetch();
}, null, true, 'America/New_York').start();
