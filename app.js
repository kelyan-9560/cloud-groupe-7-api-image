const express = require('express');
const AWS = require('aws-sdk');
const config = require('./config');

const port = process.env.PORT || 3000;

const app = express();

AWS.config.update(config.s3);
const s3 = new AWS.S3();

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

app.get('/file/:filename', function (req, res) {
  const params = {
    Bucket: config.s3.bucket,
    Key: req.params.filename,
  };

  s3.getObject(params, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      console.log(data);
      res.contentType(data.ContentType);
      res.send(data.Body);
    }
  });
})

const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
