require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");




const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    
    return temperature;
};

const server = http.createServer((req, res) => {
    try {
        if (req.url == "/") {
            const homeFile = fs.readFileSync("home.html", "utf-8");
                res.write(homeFile);
                res.end();
            }
      else if (req.url.startsWith("/getData")) {
        const arr = req.url.split('?q=');
        const position = JSON.parse(decodeURIComponent(arr[arr.length - 1]));
        requests(
          `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${position.latitude}&lon=${position.longitude}&appid=${process.env.APPID}`
        )
          .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            console.log(arrData);
            res.write(JSON.stringify(arrData));
            // console.log(realTimeData);
          })
          .on("end", (err) => {
            if (err) return console.log("connection closed due to errors", err);
            res.end();
          });
      } else {
        res.end("File not found");
      }
    } catch (error) {
        console.log(req.url, "failed")
    }
});

server.listen(8000, "127.0.0.1");
