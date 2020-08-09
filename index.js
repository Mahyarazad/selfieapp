const express = require('express');
const app = express();
const port = process.env.PORT;
const DataStore = require('nedb');
const database = new DataStore('database.db');
database.loadDatabase();

app.listen(port, () => console.log('Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));


app.post('/api', (request,response) => {
  const data = request.body;
  console.log(request.body);
  database.insert({
    Latitude: data.lat,
    longitude: data.lon,
    img: data.image64,
    Mode: data.mod,
    Time: Date.now()});
  response.json({
    status: 'success',
    latitude: data.lat,
    longitude: data.lon
  });
});

app.get('/api', (request,response) => {
  database.find({}).sort({Time:-1}).exec((err,data) => {
      if (err) {
        response.end();
        retrun(err)
      }
      response.json(data);

    });
  });
