const winston = require('winston');
const nanoId = require('nanoid');
const jwt = require('jsonwebtoken');
const loki = require('lokijs');
const path = require('path');

const dbName = 'autodj.loki-v1.db';
const userDataDbName = 'user-data.loki-v1.db';
var autodjDB;
var autodjCollection;

var filesDB;
var fileCollection;
var userDataDb;
var userMetadataCollection;

// Default Functions for joining
const mapFunDefault = function(left, right) {
  return {
    artist: left.artist,
    album: left.album,
    hash: left.hash,
    track: left.track,
    title: left.title,
    year: left.year,
    aaFile: left.aaFile,
    filepath: left.filepath,
    rating: right.rating,
    vpath: left.vpath
  };
};

const rightFunDefault = function(rightData) {
  return rightData.hash + '-' + rightData.user;
};

exports.setupBeforeSecurity = function (mstream, program) {
  autodjDB = new loki(path.join(program.storage.dbDirectory, dbName));
  autodjDB.loadDatabase({}, err => {
    autodjCollection = autodjDB.getCollection('autoDJ');
    if (autodjCollection === null) {
      autodjCollection = autodjDB.addCollection("autoDJ");
    }
  });

  filesDB = new loki(path.join(program.storage.dbDirectory, program.filesDbName));
  filesDB.loadDatabase({}, err => {
    if (err) {
      winston.error(`Files DB Load Error : ${err}`);
      return;
    }

    // Get files collection
    fileCollection = filesDB.getCollection('files');
  });

  userDataDb = new loki(path.join(program.storage.dbDirectory, userDataDbName));
  userDataDb.loadDatabase({}, err => {
    if (err) {
      winston.error(`Playlists DB Load Error : ${err}`);
      return;
    }
    // Initialize user metadata collection (for song ratings, playback stats, etc)
    userMetadataCollection = userDataDb.getCollection('user-metadata');
    if (!userMetadataCollection) {
      userMetadataCollection = userDataDb.addCollection("user-metadata");
    }
  });

}

exports.setupAfterSecurity = function (mstream, program) {
  mstream.post('/autodj/add-cat', (req, res) => {
    if(!req.body.title) {
      return res.status(403).json({ error: 'Missing Input Params' });
    }

    const title = req.body.title;
    const subTitle = req.body.subtitle;
    const user = req.user.username;

    const newCat = {
      category_id: nanoId(10),
      title: title,
      subtitle: subTitle,
      type: "category",
      user: user
    };

    // Save to DB
    autodjCollection.insert(newCat);
    autodjDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success", title: title, subtitle: subTitle });
      }
    });

    //res.json(stationItem);
    
  });

  mstream.post('/autodj/add-path', (req, res) => {
    const path = req.body.path;
    const category = req.body.catId;
    const user = req.user.username;

    if(!path || !category) {
      return res.status(403).json({ error: 'Missing Input Params' });
    }

    const autodjPath = {
      path_id: nanoId(10),
      path: path,
      type: "path",
      category: category,
      user: user
    };

    console.log("autodjPath", autodjPath)

    // Save to DB
    autodjCollection.insert(autodjPath);
    autodjDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success", path: path, cat: category });
      }
    });

    //res.json(stationItem);
    
  });

  mstream.get('/autodj/get-all', (req, res) => {

    const allAutoDj = autodjCollection.find({ 'user': req.user.username });
    if(!allAutoDj) {
        return res.status(404).json({ error: 'Empty!' })
    }

    console.log("allAutoDj: ",allAutoDj);

    const AutoDj = [];

    const store = {};
    for (let row of allAutoDj) {
      //this "if" stores only one entry per name, to have multiple items with same name disable this "if"
      //if (!store[row.stationName]) {
        if (row.type === "category") {
          AutoDj.push({ id: row.category_id, type: row.type, title: row.title, subtitle: row.subtitle});
        } else if (row.type === "path") {
          AutoDj.push({ id: row.path_id, type: row.type, path: row.path, category: row.category});
        }
        
      //}
    }
    //console.log("Stations: ", stations);
    res.json(AutoDj);
    
  });

  mstream.post('/autodj/get-cat', (req, res) => {

    const id = req.body.cat_id;
    const cat = autodjCollection.findOne({ '$and':[{ 'category_id': id}, { 'user': req.user.username}] });
    if(!cat) {
        return res.json({ status: "error", error: "AutoDj category not found!" });
    }

    res.json(cat);
    
  });

  mstream.post('/autodj/delete-cat', (req, res) => {

    const cat_id = req.body.id;
    const user = req.user.username;

    // Save to DB
    autodjCollection.findAndRemove({ '$and':[{ 'category_id': cat_id}, { 'user': user}]});
    autodjCollection.findAndRemove({ '$and':[{ 'category': cat_id}, { 'user': user}]});
    autodjDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success", cat_id: cat_id });
      }
    });
    
  });

  mstream.post('/autodj/delete-path', (req, res) => {

    const path_id = req.body.id;
    const user = req.user.username;

    // Save to DB
    autodjCollection.findAndRemove({ '$and':[{ 'path_id': path_id}, { 'user': user}]});
    autodjDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success" });
      }
    });
    
  });

  mstream.post('/autodj/editCat', (req, res) => {

    const cat_id = req.body.id;
    const cat_title = req.body.title;
    const cat_subtitle = req.body.subtitle;
    const user = req.user.username;

    if(!cat_id || !cat_title) {
      return res.status(403).json({ error: 'Missing Input Params' });
    }

    function updateCategory(obj) {
      obj.title = cat_title;
      obj.subtitle = cat_subtitle;
      return obj;
    };

    // Save to DB
    autodjCollection.findAndUpdate({ '$and':[{ 'category_id': cat_id }, { 'user': req.user.username}]}, updateCategory);
    autodjDB.saveDatabase(err => {
      if (err) {
        winston.error(`DB Save Error : ${err}`);
        res.json({ status: "error", error: err });
      } else {
        res.json({ status: "success", });
      }
    });

    //res.json(stationItem);

    //console.log("updated ID: ", stationId);
    //console.log("updated Name: ", stationName);
    //console.log("updated Url: ", stationUrl);
    
  });

  mstream.post('/autodj/get-rndSong', (req, res) => {
    if (!fileCollection) {
      res.status(500).json({ error: 'No files in DB' });
      return;
    }

    const includedCats = JSON.parse(req.body.catList);
    if (!includedCats) {
      console.log("No included Categories!");
      return;
    }

    let includedCatsA = Object.keys(includedCats);

    console.log("includedCatsA: ", includedCatsA);

    const allAutoDj = autodjCollection.find({ '$and':[ { 'category' : { '$containsAny' : includedCatsA } } , { 'user': req.user.username } ] });
    console.log("allAutoDj: ", allAutoDj);

    //let AutoDj = [];
    let pathList = [];
    let vpathList = [];
    let orClause = { '$or': [] };

    for (let row of allAutoDj) {
        if (row.type === "path") {
          //pathList.push({path: row.path});
          relPath = program.getVPathInfo(row.path, req.user).relativePath;
          vPath = program.getVPathInfo(row.path, req.user).vpath;
          pathList.push(relPath);
          if(!vpathList.includes(vPath)) {
            vpathList.push(vPath);
          }
          orClause['$or'].push({ 'filepath': { '$eq': relPath } });
        }
    }

    //const pathList = req.body.pathList;
    console.log("pathList", pathList);
    console.log("vpathList", vpathList);
    console.log("orClause: ", orClause);

    // // Ignore list
    // let ignoreList = [];
    // if (req.body.ignoreList && Array.isArray(req.body.ignoreList)) {
    //   ignoreList = req.body.ignoreList;
    // }

    // let ignorePercentage = .5;
    // if (req.body.ignorePercentage && typeof req.body.ignorePercentage === 'number' && req.body.ignorePercentage < 1 && !req.body.ignorePercentage < 0) {
    //   ignorePercentage = req.body.ignorePercentage;
    // }

    // // // Preference for recently played or not played recently

    // let orClause = { '$or': [] };
    // for (let vpath of req.user.vpaths) {
    //   if (req.body.ignoreVPaths && typeof req.body.ignoreVPaths === 'object' && req.body.ignoreVPaths[vpath] === true) {
    //     continue;
    //   }
    //   orClause['$or'].push({ 'vpath': { '$eq': vpath } });
    // }

    // let minRating = Number(req.body.minRating);
    // // Add Rating clause
    // if (minRating && typeof minRating === 'number' && minRating <= 10 && !minRating < 1) {
    //   orClause = {'$and': [
    //     orClause,
    //     { 'rating': { '$gte': req.body.minRating } }
    //   ]};
    // }

    const leftFun = function(leftData) {
        return leftData.hash + '-' + req.user.username;
    };

    //const results = fileCollection.chain().eqJoin(userMetadataCollection.chain(), leftFun, rightFunDefault, mapFunDefault).find(orClause).data();
    //results = fileCollection.chain().find(orClause).data();

    //TODO: find a better (more defined) way for vpath instead of containsAny
    results = fileCollection.find({ '$and':[ { 'filepath' : { '$containsAny' : pathList } } , { 'vpath': { '$containsAny' : vpathList} } ] });
    console.log("results", results);
    
    const count = results.length;
    if (count === 0) {
      res.status(444).json({ error: 'No songs that match criteria' });
      return;
    }

    // while (ignoreList.length > count * ignorePercentage) {
    //   ignoreList.shift();
    // }

    const returnThis = { songs: [] };

    let randomNumber = Math.floor(Math.random() * count);
    // while (ignoreList.indexOf(randomNumber) > -1) {
    //   randomNumber = Math.floor(Math.random() * count);
    // }

    const randomSong = results[randomNumber];

    returnThis.songs.push({
      "filepath": path.join(randomSong.vpath, randomSong.filepath).replace(/\\/g, '/'),
      "metadata": {
        "artist": randomSong.artist ? randomSong.artist : null,
        "hash": randomSong.hash ? randomSong.hash : null,
        "album": randomSong.album ? randomSong.album : null,
        "track": randomSong.track ? randomSong.track : null,
        "title": randomSong.title ? randomSong.title : null,
        "year": randomSong.year ? randomSong.year : null,
        "album-art": randomSong.aaFile ? randomSong.aaFile : null,
        "rating": randomSong.rating ? randomSong.rating : null
      }
    });

    // ignoreList.push(randomNumber);
    // returnThis.ignoreList = ignoreList;
    res.json(returnThis);
    console.log("returnThis", returnThis);
  });
}
