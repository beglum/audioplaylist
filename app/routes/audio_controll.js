var ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

var multer = require('multer');

module.exports = function(app, db) {
	app.post('/editaudio', (req, res) => {
		var details = {'_id': new ObjectID(req.body.id)};
		var audio = {
  			descr: req.body.descr,
  			title: req.body.title
  		};
		db.collection('audiolist').findOneAndUpdate(details, {$set: audio},(err, item) => {
			if (err) {
				res.send({'error': 'Произошла ошибка'});
			} else {
				res.redirect('/');
			}
		});
	});
	app.get('/del/:id', (req, res) => {
		var id = req.params.id;
		var details = {'_id': new ObjectID(id)};
		db.collection('audiolist').findOneAndDelete(details, (err, item) => {
			if (err) {
				res.send({'error': 'Произошла ошибка'});
			} else {
				fs.unlink(__dirname+'\\..\\..\\files\\audio\\'+item.value.filename+'.mp3', () => {});
				fs.unlink(__dirname+'\\..\\..\\files\\images\\'+item.value.filename+'.'+item.value.image_extension, () => {});
				res.redirect('/');
			}
		});
	});

	app.get('/', (req, res) => {
		sendFile('index.html', res);
	});
	app.get('/getaudiolist', (req, res) => {
		var audiofiles = db.collection('audiolist').find({}).toArray(function(err, items) {
			res.send(items);
		});	
	});
	app.get('^\/[a-zA-Z0-9_\.\/]*\.(js|html|css|jpeg|png|mp3|json)', (req, res) => {
		let url = req.url;
		let q_pos = req.url.indexOf("?");
		if (q_pos != -1) {
			url = url.slice(0, q_pos);
		}
		sendFile(url, res);
	});
	app.post('/addaudio', (req, res) => {
  		var filenewname = Date.now().toString(36);
  		var title = req.body.title;
  		var descr = req.body.descr;
		var storages = multer.diskStorage({
			destination: function(req, file, cb) {
				cb(null, '\\files');
			}
		});
		var upload = multer({ storage: storages }).any();
	  	if (req.files.length > 1) {
	  		var image_extension = "";
		    for (var i = 0; i < req.files.length; i++) {
		  		var filemime = req.files[i].mimetype;
		  		var filepath = req.files[i].destination;
  				var filename = req.files[i].filename;
		  		if (['image/jpeg', 'image/png'].indexOf(req.files[i].mimetype) != -1 && req.files[i].fieldname == "image") {
		  			image_extension = req.files[i].mimetype.slice(6);
		  			fs.rename(filepath + filename, filepath + 'images\\' + filenewname + "." + image_extension, () => {});
		  		} else if (['audio/mp3', 'audio/mpeg'].indexOf(req.files[i].mimetype) != -1 && req.files[i].fieldname == "audio") {
		  			fs.rename(filepath + filename, filepath + 'audio\\' + filenewname + '.mp3', () => {});
		  		} else {
		  			fs.unlink(filepath + filename, () => {});
		  		}
	  		}
	  		upload(req, res, (err) => {
	  			if (err) {
	  				return res.send("Ошибка загрузки файла");
	  			}
		  		var audio = {
		  			descr: descr,
		  			title: title,
		  			filename: filenewname,
  					image_extension: image_extension
		  		};
		  		db.collection('audiolist').insert(audio, (err, result) => {
					if (!err) {
		    			res.redirect('/');
					} else {
						console.log("--- " + err);
						res.redirect('/?error');
					}
				});
	  		});
	  	} else {
	  		fs.unlink(req.files[0].path, () => {
	  			res.redirect('/?error');
	  		});
	  	}
	});
	function sendFile(file, res) {
		if (file[0] == '\\' || file[0] == '/') file = file.substring(1);
		fs.readFile(file, function(err, ret) {
			if (!err) {
				var mime = require('mime').lookup(file);
				res.setHeader('Content-Type', mime + "; charset=utf-8");
				res.end(ret);
			} else {
				console.log("--- " + err);
				res.status(404).send("Not Found");
			}
		});
	}
};