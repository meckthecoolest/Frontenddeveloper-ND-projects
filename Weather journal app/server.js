projectData = {
  data: []
};

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.use(cors());


app.use(express.static('website'));

app.get('/all', getAllData);
app.post('/', addData);


app.get('*', notFound);

function getAllData(req, res) {
  return res.send(projectData);
}


function addData(req, res) {

  if (!isValidInput(req.body)) {
    return res.status(400).send({
      message: "Incorrect input"
    })
  }

  projectData.data.push(req.body);

  return res.status(201).send({
    message: "Successfully added data"
  });
}


function notFound(req, res) {
  console.log("Incorrect endpoint, use either (GET: '/all') or (POST: '/')");
  res.status(404).send("Page was not found...");
}


app.listen(PORT, serverStatup);


function serverStatup() {
  console.log(`Started server --> [port = ${PORT}]`);
}

function isValidInput(body) {
  const {
    zipCode,
    feeling,
    temperature,
    date
  } = body;

  if (
    !zipCode || !/^[0-9]{5}(?:-[0-9]{4})?$/.test(zipCode) ||
    !feeling ||
    !temperature ||
    !date
  ) {
    return false;
  }

  return true;
}