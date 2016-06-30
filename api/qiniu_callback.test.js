var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/qiniu/callback', function(req, res) {
  console.log(req.body);
  console.log(req.headers);

  res.status(200).send({
    body:req.body,
    headers:req.headers
  });
});

app.listen('7777', function() {
  console.log('qiniu test server listening on port 7777');
});
