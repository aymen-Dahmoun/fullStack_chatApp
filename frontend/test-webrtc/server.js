const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8082;
const filePath = path.join(__dirname, "test.html");

const server = http.createServer((req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to load test.html");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebRTC test page available at http://localhost:${PORT}`);
});
