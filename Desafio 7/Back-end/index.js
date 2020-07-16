const express = require('express');
const process = require('process');
const cors = require('cors');
const fs = require('fs');

const adjectives = require('./adjectives');
const animals = require('./animals');
const colors = require('./colors');

const app = express();
const port = process.env.PORT || 9090;

const messages = [];
const usedNames = [];
const usedColors = [];

backupMessages();
backupUsers();

app.use(cors());
app.use(express.json());

app.get('/messages', (req, res) => {
	res.send(messages);
});

app.post('/messages', (req, res) => {
	msg = req.body;

	messages.push(msg);
	saveMessage(msg);
	res.send({});
});

app.get('/user', (req, res) => {
	/** @argument { any[] } arr */
	function randomItemFromArray (arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	let name = ''; let color = '';

	do {
		name = `${randomItemFromArray(adjectives)} ${randomItemFromArray(animals)}`;
		color = randomItemFromArray(colors);
	} while (usedNames.includes(name) && usedColors.includes(color));
	res.send({ name, color });
})

app.post('/user', (req, res) => {
	const { name, color } = req.body;

	if (usedNames.includes(name) && usedColors.includes(color)) res.sendStatus(500);
	else {
		usedNames.push(name); usedColors.push(color);
		saveUser(req.body);
		res.send({});
	}
})

/**
 * Backup all previous messages from a backup file.
 */
function backupMessages() {
	fs.readFile("backup.txt", "utf-8", (err, data) => {
		if (err) console.log('Unable to backup messages! Maybe the backup file is empty...');

		else {
			// Insert all messages into an array
			const backup = data.split('\n');
			const backupSize = backup.length - 1;

			for (let m = 0; m < backupSize; ++ m)
				// Parse message into a JSON object
				messages.push(JSON.parse(backup[m]))
		}
	})
}

function backupUsers() {
	fs.readFile("backup-users.txt", "utf-8", (err, data) => {
		if (err) console.log('Unable to backup users! Maybe the backup file is empty...');

		else {
			// Insert all messages into an array
			const backup = data.split('\n');
			const backupSize = backup.length - 1;

			for (let u = 0; u < backupSize; ++ u) {
				// Parse message into a JSON object
				let user = JSON.parse(backup[u]);
				usedNames.push(user.name);
				usedColors.push(user.color);
			}
		}
	})
}
/**
 * Append a JSON-formatted message to the backup file.
 * @param  { Object } msg
 */
function saveMessage(msg) {
	fs.appendFile("backup.txt", JSON.stringify(msg)+'\n', "utf-8", err => {
		if (err) console.log("Unable to save message!", err);
	})
}

function saveUser(user) {
	fs.appendFile("backup-users.txt", JSON.stringify(user)+'\n', "utf-8", err => {
		if (err) console.log("Unable to save user!", err);
	})
}

app.listen(port, () => console.log(`Ready! Server listening on port ${port}`));