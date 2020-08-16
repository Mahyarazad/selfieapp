const express = require('express');
const AWS = require("aws-sdk");
const Base64 = require('js-base64');
const app = express();
const fs = require("fs");
const port = process.env.PORT || 3000;
const DataStore = require('nedb');
const client = require('pg');
const Client = new client({
  connectionString: process.env.DATABAS_URL,
  ssl: {
    rejectUnauthorized: false
  }
)};

Client.connect();



const db = new DataStore({ filename: 'database.db', autoload: true });
// You can issue commands right away

db.loadDatabase();

const env = require('./s3.env.js');

const config = new AWS.Config({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.REGION,
});
const s3 = new AWS.S3(config);

app.listen(port, () => console.log("Listening at port: %s",port));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
// app.use(multipartyMiddleware);

app.post('/api', (request,response) => {
  const data = request.body;

  db.insert({

    Latitude: data.lat,
    longitude: data.lon,
    Mode: data.mod,
    Time: Date.now()});

    // const base64Image = data.image64.split(';base64,').pop();
    // const the_file = new Blob([new Uint8Array(_base64ToArrayBuffer(base64Image))]);
    const buf = new Buffer.from(data.image64.replace(/^data:image\/\w+;base64,/,""),'base64');
    // console.log(the_file);
    // const the_file = new Blob([Base64.atob(base64Image)],  {type: 'image/png', encoding: 'utf-8'});
    db.find({}).sort({Time:1}).exec((err,data) => {
      // fs.writeFile('public/logs/pics/'+ data[data.length-1]._id +'.png',base64Image,{encoding: 'base64'},(err)=>{
      //   if (err) {
      //     console.log(err);
      //   }
      // });
      s3.upload({
        Key: data[data.length-1]._id+'.png',
        Body: buf,
        Bucket: env.Bucket,
        // ACL: 'public-read'
        }, function(err, data) {
          if(err) {
            // console.log(err);
          }
          console.log('Successfully Uploaded!');
          }).on('httpUploadProgress', function (progress) {
            let uploaded = parseInt((progress.loaded * 100) / progress.total);
            $("progress").attr('value', uploaded);
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
