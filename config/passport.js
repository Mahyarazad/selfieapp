const LocalStrategy = require('passport-local');
let users = require('../models/users');
let data = require('../models/data');
const db = require('../models/index.js');
const bcrypt = require('bcryptjs');
const path  = require('path');
const Sequelize = require('sequelize');
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET
});

module.exports = function(app,passport){
  // Strategy

  app.get('/username' , isLoggedIn ,async(req,res) => {
      let {user} = req.session.passport.user;
      let query = await db.users.findAll({
            where: {email: user}
          });

      query = query[0];
      let user_ = query.dataValues.username;
      res.json({user:user_});
    });
    app.get('/uid' , isLoggedIn, async(req,res) => {
        let {user} = req.session.passport.user;
        let query = await db.users.findAll({
              where: {email: user}
            });

        query = query[0];
        let user_ = query.dataValues.user_id;
        res.json({uid:user_});

      });
  app.get('/' , isLoggedIn , (req,res) => {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

  app.post('/api', isLoggedIn, async (req,res) => {

    let {user} = req.session.passport.user;
    let query = await db.users.findAll({
          where: {email: user}
        });

    query = query[0];
    console.log(query.dataValues);

    const data = await req.body;
    const buf = new Buffer.from(data.image64.replace(/^data:image\/\w+;base64,/,""),'base64');

    const sequelize = new Sequelize({
      // The `host` parameter is required for other databases
      // host: 'localhost'
      dialect: 'postgres',
      storage: './data'
    });
    let query_;
    try {
      const record = await db.data.findOrCreate({
        where: {
          mod: data.mod,
          lat: data.lat,
          lon: data.lon,
          createdat: Date.now(),
          updatedat: Date.now(),
          user_id: query.dataValues.user_id,
          uname: query.dataValues.username
        }});
      query_ = record;
    } catch (e) {
      return res.json({ status: 'error', code: '9999', message: e.message })
    };
    const image_id = await query_[0].dataValues.id;

      // const base64Image = data.image64.split(';base64,').pop();
      // const the_file = new Blob([new Uint8Array(_base64ToArrayBuffer(base64Image))]);
      // console.log(the_file);
      // const the_file = new Blob([Base64.atob(base64Image)],  {type: 'image/png', encoding: 'utf-8'});



    console.log(s3);
    s3.upload({
      Key: image_id +'.jpeg',
      Body: buf,
      Bucket: 'faceapiapp',
      // ACL: 'public-read'
      }, function(err, data) {
        if(err) {
          console.log(err);
        }
        res.json({
          status: 'Successfully Uploaded!',
        });
        console.log('Successfully Uploaded!');
        }).on('httpUploadProgress', function (progress) {
          let uploaded = parseInt((progress.loaded * 100) / progress.total);
          //$("progress").attr('value', uploaded);
      });


    // res.json({
    //   status: 'Successfully Uploaded!',
    // });
  });

  app.get('/api/image/:id' , isLoggedIn, async (request,response) => {
    s3.getObject(
      { Bucket: 'faceapiapp', Key: request.params.id+ '.jpeg' },
      function (error, data) {
        if (error != null) {
          console.log("Failed to retrieve an object: " + error);
        } else {
          console.log("Loaded " + data.ContentLength + " bytes");
          response.writeHead(200, {'Content-Type': 'image/jpeg'});
          response.write(data.Body, 'binary');
          response.end(null, 'binary');
        }
      });
  });

  app.get('/api' , isLoggedIn, async (request,response) => {
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

    //console.log(image);
    db.data.findAll({
        order: sequelize.literal('createdat DESC')
      }).then(data => response.json(data))
    });

    app.delete('/api/:id', isLoggedIn, async(req,res) =>{
      const data = await req.body;
      const Sequelize = require('sequelize');
      const sequelize = new Sequelize({
        // The `host` parameter is required for other databases
        // host: 'localhost'
        dialect: 'postgres',
        storage: './data'
      });

      params = {
        Bucket: config.bucket,
        Delete:{
          Objects: [{
            Key: data.id+'.jpeg'
          }]
        }
      };
      // console.log(params);
      const s3 = await new AWS.S3(config);
      s3.deleteObjects(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
        data = {
         Deleted: [
            {
           DeleteMarker: true,
           DeleteMarkerVersionId: "A._w1z6EFiCF5uhtQMDal9JDkID9tQ7F",
           Key: "objectkey1"
          },
            {
           DeleteMarker: true,
           DeleteMarkerVersionId: "iOd_ORxhkKe_e8G8_oSGxt2PjsCZKlkt",
           Key: "objectkey2"
          }
         ]
        }
        */
      });
      db.data.destroy({
        where: {
          id: data.id
        },
        force: true
      });
      res.json({
        status: 'success'
      });
    });

  passport.use(new LocalStrategy({ usernameField: 'email' },async function(email,password,done){

      await db.users.findAll({
          where: {email: email}
      }).then(
        async ()=> {
          if (!email){
            return done(null, false);
          };
          let query = await db.users.findAll({
                where: {email: email}
              });
          query = query[0];
          if (query != null){
            bcrypt.compare(password,query.dataValues.password).then( (result) =>{
              if(result === true){
                return done(null,{user:query.dataValues.email});
              } else {
                return done(null,false,{message :'Oops! Incorrect Password.'});
              }
            });
          } else {
            return done(null, false,{message :'Oops! Incorrect Email.'});
          }
        });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(email, done) {
    done(null, {email: email});
  });

  function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {

        return res.redirect('/user/login');
    }
  }
}
