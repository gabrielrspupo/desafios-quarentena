const express = require('express');
const process = require('process');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

const messages = [];

backupMessages();
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
/**
 * Append a JSON-formatted message to the backup file.
 * @param  { Object } msg
 */
function saveMessage(msg) {
	fs.appendFile("backup.txt", JSON.stringify(msg)+'\n', "utf-8", err => {
		if (err) console.log("Unable to save message!", err);
	})
}

app.listen(port, () => console.log(`Ready! Server listening on port ${port}`));