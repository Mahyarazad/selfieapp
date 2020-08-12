const express = require('express');
const app = express();
// const FileSaver = require('FileSaver');
const fs = require("fs");

// const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
const DataStore = require('nedb');
const db = new DataStore('database.db');

db.loadDatabase();


app.listen(port, () => console.log('Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));


app.post('/api', (request,response) => {
  const data = request.body;
  db.insert({

    Latitude: data.lat,
    longitude: data.lon,
    Mode: data.mod,
    Time: Date.now()});

    let base64Image = data.image64.split(';base64,').pop();
    db.find({}).sort({Time:1}).exec((err,data) => {
      fs.writeFile('public/logs/pics/'+ data[data.length-1]._id +'.png',base64Image,{encoding: 'base64'},(err)=>{
        if (err) {
          console.log(err);
        }
      });
    });

  response.json({
    status: 'success',
    latitude: data.lat,
    longitude: data.lon
  });
});

app.get('/api', (request,response) => {
  db.find({}).sort({Time:-1}).exec((err,data) => {
      if (err) {
        response.end();
        retrun(err)
      }
      response.json(data);

    });
  });
