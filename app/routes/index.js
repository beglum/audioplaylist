const audioController = require('./audio_controll.js');
module.exports = (app, db) => {
	audioController(app, db);
}