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

function backupMessages() {
	fs.readFile("backup.txt", "utf-8", (err, data) => {
		if (err) console.log('Erro ao ler mensagens!', err);

		else {
			const backup = data.split('\n');
			const backupSize = backup.length - 1;

			for (let m = 0; m < backupSize; ++ m)
				messages.push(JSON.parse(backup[m]))
		}
	})
}

function saveMessage(msg) {
	fs.appendFile("backup.txt", JSON.stringify(msg)+'\n', "utf-8", err => {
		if (err) console.log("Não foi possível salvar mensagem!", err);
	})
}

app.listen(port, () => console.log(`Ready! Server listening on port ${port}`));