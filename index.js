'use strict';

const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const { json } = require('body-parser');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

const BASE_URL = 'https://cat-fact.herokuapp.com/facts';

const getstuff = () => {
  try {
    return axios.get(BASE_URL);
  } catch(error) {
    console.error(error);
  }
}


const doStuff = async (req,res) => {
  let index = req.params.index;
  getstuff()
  .then(response => {
    if( response.data.all) {
      console.log(response.data.all[index]);
    }
    return response.data.all;
  }).then(data => {
    console.log(data[index]);
    console.log(index);
    console.log(data[index].text);
    res.json(data[index]);
  }).
  catch(err => {
    console.log(error);
  })
}


function startServer() {
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');

  const app = express();
  //app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));


  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  
  app.get('/test', (req,res) => {res.send("hello everyone")});
  app.get('/cat', doStuff);
  app.get('/cat/:index', doStuff);

  // do not delete
  //static page to public directory
  app.use(express.static('public'));

  return app.listen(3001, () => {
    console.log('server runnning at 3001');
  });
}

startServer();