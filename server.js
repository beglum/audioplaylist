const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const app = express();
const multer = require('multer');
app.use(multer({
	dest: __dirname+'\\files\\',
	limits: {
		fileSize: 20971520,
		files: 2
	}
}).any());

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log("--- " + err);
	require('./app/routes')(app, database);
	app.listen(3000, '127.0.0.1', () => {
		console.log("--- Сервер успешно запущен");
	});
});