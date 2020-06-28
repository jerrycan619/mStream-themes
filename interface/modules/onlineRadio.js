const winston = require('winston');
const nanoId = require('nanoid');
const jwt = require('jsonwebtoken');
const loki = require('lokijs');
const path = require('path');

const dbName = 'radio.loki-v1.db'
var radioDB;
var radioCollection;

//Radio Stream Metadata
var internetradio = require('node-internet-radio');

exports.setupBeforeSecurity = function (mstream, program) {
  radioDB = new loki(path.join(program.storage.dbDirectory, dbName));
  radioDB.loadDatabase({}, err => {
    radioCollection = radioDB.getCollection('stations');
    if (radioCollection === null) {
      radioCollection = radioDB.addCollection("stations");
    }
  });

}

exports.setupAfterSecurity = function (mstream, program) {
  mstream.post('/radio/add-station', (req, res) => {
    if(!req.body.stationUrl || !req.body.stationName) {
      return res.status(403).json({ error: 'Missing Input Params' });
    }

    const stationUrl = req.body.stationUrl;
    const stationName = req.body.stationName;
    const user = req.user.username;

    const stationItem = {
      station_id: nanoId(10),
      stationUrl: stationUrl,
      stationName: stationName,
      user: user
    };

    // Save to DB
    radioCollection.insert(stationItem);
    radioDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success", url: stationUrl, name: stationName });
      }
    });

    //res.json(stationItem);
    
  });

    mstream.get('/radio/get-stations', (req, res) => {
        const allStations = radioCollection.find({ 'user': req.user.username });
        if(!allStations) {
            return res.status(404).json({ error: 'No radio stations found!' })
        }

        //console.log("allStations: ",allStations);

        const stations = [];

        const store = {};
        for (let row of allStations) {
          //this "if" stores only one entry per name, to have multiple items with same name disable this "if"
        //if (!store[row.stationName]) {
            stations.push({ id: row.station_id, name: row.stationName, url: row.stationUrl});
            //store[row.stationName] = true;
        //}
        }
        //console.log("Stations: ", stations);
        res.json(stations);

    });

    mstream.post('/radio/get-station-by-id', (req, res) => {
      const id = req.body.id;
      const station = radioCollection.findOne({ '$and':[{ 'station_id': id}, { 'user': req.user.username}] });
      if(!station) {
          return res.json({ status: "error", error: "No station found!" });
      }

      // const station = {
      //   id: station.station_id,
      //   name: station.stationName,
      //   url: station.stationUrl,
      // };

      //console.log(station);
      res.json(station);

  });

    mstream.post('/radio/meta', function(req, res){
        //console.log("getRadioMetadata");
        const url = req.body.url;
        let meta = {};
        internetradio.getStationInfo(url, function(error, station) {
          //console.log(station);
          //console.log(error);
          if (station) {
            if (station.title) {
              meta.title = station.title.split(" - ")[1]; 
              meta.artist = station.title.split(" - ")[0];
            }
            if (station.headers["icy-name"]) {meta.album = station.headers["icy-name"];}
            //console.log(meta);
            res.json({ metadata: meta });
          }
        });
    });

  mstream.post('/radio/edit', (req, res) => {
    if(!req.body.stationUrl || !req.body.stationName) {
      return res.status(403).json({ error: 'Missing Input Params' });
    }

    const stationUrl = req.body.stationUrl;
    const stationName = req.body.stationName;
    const stationId = req.body.id;
    const user = req.user.username;

    function updateStationItem(obj) {
      obj.stationUrl = stationUrl;
      obj.stationName = stationName;
      return obj;
    };

    // Save to DB
    radioCollection.findAndUpdate({ '$and':[{ 'station_id': stationId}, { 'user': req.user.username}]}, updateStationItem);
    radioDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success", url: stationUrl, name: stationName });
      }
    });

    //res.json(stationItem);

    //console.log("updated ID: ", stationId);
    //console.log("updated Name: ", stationName);
    //console.log("updated Url: ", stationUrl);
    
  });

  mstream.post('/radio/delete', (req, res) => {

    const stationUrl = req.body.stationUrl;
    const stationName = req.body.stationName;
    const stationId = req.body.id;
    const user = req.user.username;

    // Save to DB
    radioCollection.findAndRemove({ '$and':[{ 'station_id': stationId}, { 'user': req.user.username}]});
    radioDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success", url: stationUrl, name: stationName });
      }
    });

    //res.json(stationItem);

    //console.log("updated ID: ", stationId);
    //console.log("updated Name: ", stationName);
    //console.log("updated Url: ", stationUrl);
    
  });
}
