const http = require('http');
const createHandler = require('github-webhook-handler');
const { exec } = require('child_process');
require('dotenv').config(); // Load environment variables from .env file

const handler = createHandler({ path: '/webhook', secret: process.env.WEBHOOK_SECRET });

function runCmd(cmd, callback) {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    callback(stdout);
  });
}

handler.on('push', event => {
  console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref);
  runCmd('./deploy.sh', text => {
    console.log(text);
  });
});

http.createServer((req, res) => {
  handler(req, res, err => {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(7777, () => {
  console.log('Server listening on port 7777');
});
