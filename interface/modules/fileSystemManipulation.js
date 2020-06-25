const fs = require("fs-extra");

var internetradio = require('node-internet-radio');

//To write id3 tags
const NodeID3 = require('node-id3');

exports.setup = function(mstream, program) {
  mstream.post('/radio/meta', function(req, res){
    console.log("getRadioMetadata");
    const url = req.body.url;
    internetradio.getStationInfo(url, function(error, station) {
      console.log(station);
      console.log(error);
      if (station) {
        res.json({ title: station.title });
      }
    });
  });


  mstream.post('/file/rename', function(req, res){
    console.log("renameFile");
    //console.log("req: ", req.body.newname);
    const currentPath = program.getVPathInfo(req.body.currentPath);
    let newPath = req.body.newPath;
    const metadata = req.body.metadata; // {title: "Title", artist: "Artist", ...}
    //console.log("current: ", currentPath);
    //console.log("new: ", newPath);

    // Fastest way to get Filename from path (https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript)
    // const currentFilename = currentPath.split('\\').pop().split('/').pop();
    // console.log("currentFilename: ", currentFilename);
  
    const vpath = currentPath.vpath;

    //remove vpath from new path to build the real path
    newPath = currentPath.basePath+newPath.replace(vpath,'');
    //console.log("newPath: ", newPath);
    //console.log("Rename:  ", pathInfoCurrent);
    //pathInfoCurrent

    if (newPath !== currentPath.fullPath) {
      fs.rename(currentPath.fullPath, newPath, err => {
        if (err) {
          if(err.code === 'ENOENT') {
            console.log("Error: ", err);
            res.json({status: "info", info: "Directory doesn't exist!" });
          } else {
            console.log("Error: ", err);
            res.json({status: "error", error: err });
          }
        } else {
          console.log("Rename complete!");
          console.log("Renamed: ", currentPath.fullPath);
          console.log("To: ", newPath);
          res.json({ status: "success", oldPath: currentPath.fullPath, newPath: newPath });
        }
      });
    } else {
      res.json({ status: "info", info: "old path and new path are the same!" });
    }

    if (metadata) {
      console.log("Update ID3 ");
      let success = NodeID3.write(metadata, newPath);
      console.log(success);

      NodeID3.read(newPath, function(err, tags) {
        console.log(tags);
      });
    }
    
  });

  mstream.post('/file/delete', function(req, res){
    const filePath = req.body.filepath;
    const fullFilePath = program.getVPathInfo(filePath, req.user);
    //console.log(fullFilePath);

    fs.unlink(fullFilePath.fullPath, (err) => {
      if (err) {
        console.log("Error: ", err);
        res.json({status: "error", error: err });
      } else {
        console.log("Removed: ", fullFilePath);
        res.json({ status: "success", filepath: fullFilePath.relativePath});
      }
      return;
    });
  });

  mstream.post('/dir/create', function(req, res){
    const filePath = req.body.filepath;
    const newName = req.body.name;
    const fullFilePath = program.getVPathInfo(filePath, req.user);
    const createPath = fullFilePath.fullPath + `/${newName}`;
    console.log(fullFilePath);
    console.log("newName: ", newName);

    fs.mkdir(createPath, err => { 
      if (err) {
        if(err.code === 'EEXIST') {
          console.log("Error: ", err);
          res.json({status: "info", info: "Directory already exists!" });
        } else {
          console.log("Error: ", err);
          res.json({status: "error", error: err });
        }
      } else {
        console.log("Created: ", createPath);
        res.json({ status: "success", filepath: fullFilePath.vpath + fullFilePath.relativePath + `/${newName}`}); 
      }
      
    });
  });

  mstream.post('/dir/remove', function(req, res){
    const filePath = req.body.filepath;
    const fullFilePath = program.getVPathInfo(filePath, req.user);
    //console.log("removeDir: ", fullFilePath);
    fs.pathExists(fullFilePath.fullPath, (err, exists) => {
      console.log(err);
      if (exists) {
        fs.remove(fullFilePath.fullPath, err => {
          if (err) {
              console.log("Error: ", err);
              res.json({status: "error", error: err });
          } else {
              console.log("Removed: ", fullFilePath.fullPath);
              res.json({ status: "success", filepath: fullFilePath.vpath + "/" + fullFilePath.relativePath}); 
          }
        });
      } else {
        res.json({status: "info", info: "Path does not exist!" });
      }
    }); 
  });

  mstream.post('/dir/rename', function(req, res){
    const currentPath = req.body.currentPath;
    const newPath = req.body.newPath;
    console.log("current: ", currentPath);
    console.log("new: ", newPath);

    const fullCurrentPath = program.getVPathInfo(currentPath, req.user);
    const fullNewPath = program.getVPathInfo(newPath, req.user);
    console.log("current: ", fullCurrentPath);
    console.log("new: ", fullNewPath);
    if (!fullNewPath.relativePath || !fullCurrentPath.relativePath) {
      res.json({status: "info", info: "not possible on root (vpath) level!" });
      return;
    }
    fs.move(fullCurrentPath.fullPath, fullNewPath.fullPath, err => {
      console.log(err);
      if (err) {
        console.log("Error: ", err);
        res.json({status: "error", error: err });
      } else {
        console.log("Moved: ", fullCurrentPath.fullPath);
        console.log("To: ", fullNewPath.fullPath);
        res.json({ status: "success", oldPath: fullCurrentPath.vpath + "/" + fullCurrentPath.relativePath, newPath: fullNewPath.vpath + "/" + fullNewPath.relativePath}); 
      }
    }); 
  });
};