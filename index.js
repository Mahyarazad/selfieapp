const express = require('express');
const AWS = require("aws-sdk");
const Base64 = require('js-base64');
const app = express();
const fs = require("fs");
const port = process.env.PORT || 3000;
const DataStore = require('nedb');

const shortid = require('shortid');
const mysql = require('mysql');
const {Client} = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


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
app.use(express.urlencoded({ extended:true }))

// const connection = mysql.createConnection({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'KosKesh@950800',
//   database: 'test1'
//
// });
//

// client.connect( err => {
//   console.log('db connected');
//   let query = client.query("SELECT * FROM Category_table", "test1", (err,resp)  =>{
//     console.log(resp);
//   });
//   console.log("query.sql");
// });
// let channels = [];
// let lessons = [];
// app.post('/api/channels',(req,res)=>{
//   const channelsinfo = req.body;
//   channelsinfo.id = shortid.generate();
//   channels.push(channelsinfo);
//   console.log(channels);
//   res.status(201).json(channelsinfo);
// });
//
// app.get('/api/channels',(req,res)=>{
//   res.status(200).json(channels);
// });
//
// app.post('/api/lessons',(req,res)=>{
//   const lessonsinfo = req.body;
//   lessonsinfo.id = shortid.generate();
//   lessons.push(lessonsinfo);
//   console.log(lessons);
//   res.status(201).json(lessonsinfo);
// });
//
// app.get('/api/lessons',(req,res)=>{
//   res.status(200).json(lessons);
// });
//
// app.delete('/api/channels/:id',(req,res) => {
//   const {id} = req.params;
//   const find = channels.find(channel => channel.id === id);
//   if (find) {
//     channels = channels.filter(channel => channel.id !== id);
//     res.status(200).json({message: 'deleted!'})
//   } else {
//     res
//       .status(404)
//       .json({ message: 'It cannot be find in channels'});
//   }
// })




// app.use(multipartyMiddleware);
const db = require('./models/index.js');
app.post('/api', async (request,response) => {
  const data = await request.body;
  // const buf = new Buffer.from(data.image64.replace(/^data:image\/\w+;base64,/,""),'base64');
  try {
    db.data.findOrCreate({
      where: {
        mod: data.mod,
        lat: data.lat,
        lon: data.lon,
        createdat: Date.now(),
        updatedat: Date.now()
      }});
    } catch (e) {
      return res.json({ status: 'error', code: '9999', message: e.message })
    };


  // db.insert({
  //
  //   Latitude: data.lat,
  //   longitude: data.lon,
  //   Mode: data.mod,
  //   Time: Date.now()});

    // const base64Image = data.image64.split(';base64,').pop();
    // const the_file = new Blob([new Uint8Array(_base64ToArrayBuffer(base64Image))]);
    // console.log(the_file);
    // const the_file = new Blob([Base64.atob(base64Image)],  {type: 'image/png', encoding: 'utf-8'});
    // db.find({}).sort({Time:1}).exec((err,data) => {
      // fs.writeFile('public/logs/pics/'+ data[data.length-1]._id +'.png',base64Image,{encoding: 'base64'},(err)=>{
      //   if (err) {
      //     console.log(err);
      //   }
      // });
  // s3.upload({
  //   Key: data[data.length-1]._id+'.png',
  //   Body: buf,
  //   Bucket: env.Bucket,
  //   // ACL: 'public-read'
  //   }, function(err, data) {
  //     if(err) {
  //       console.log(err);
  //     }
  //     console.log('Successfully Uploaded!');
  //     }).on('httpUploadProgress', function (progress) {
  //       let uploaded = parseInt((progress.loaded * 100) / progress.total);
  //       $("progress").attr('value', uploaded);
  //     });
  //   });


  response.json({
    status: 'success',
    // latitude: data.lat,
    // longitude: data.lon
  });
});


app.get('/api', (request,response) => {
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize({
    // The `host` parameter is required for other databases
    // host: 'localhost'
    dialect: 'postgres',
    storage: './data'
  });
  // db.find({}).sort({Time:-1}).exec((err,data) => {
    //   if (err) {
    //     response.end();
    //     retrun(err)
    //   }
    //   response.json(data);
    //
    // });
  const data = request.body;
  db.data.findAll({
    order: sequelize.literal('createdat DESC')
  }).then(data => response.json(data))

  });
