const { ChildProcess } = require("child_process");
const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require(`${__dirname}/modules/replaceTemplate`);

const formHtml = fs.readFileSync(`${__dirname}/index.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.
// console.log(slugify("freah Avocados", { lower: true }));

const server = http.createServer((req, res) => {
	res.writeHead(200, {
		"Content-type": "text/html",
	});

	res.end(formHtml);
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listenting to requeusts on server 8000");
});
