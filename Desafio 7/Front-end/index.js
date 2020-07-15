const serverAddress = 'http://localhost:8080';
const messageFormElement = document.getElementById('message-form');
const messagesContainerElem = document.getElementById('messages-container');
const messageTemplateElem = document.getElementById('message-template');
// Settings dialog elements
const settingsButtonElem = document.getElementById('settings-button').getElementsByTagName('button')[0];
const settingsDialogElem = document.getElementById('settings-dialog');
const settingsFormElem = document.getElementById('settings');
const settingsDialogFooterElem = document.getElementById('settings-footer').getElementsByTagName('button');

/**
* @typedef {{
	text: string,
	sender: { name: string, color: string },
}} Message This is the type a message
* should assume. */

/**
* @type { Message[] }
* This variable will hold all messages that were already
* rendered to the client.
*/
const renderedMessages = [];

/** @argument { any[] } arr */
function randomItemFromArray (arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

/*
* This is an IIFE (Immediatly involked function expression). An IIFE is a function
* that is called immediatly after it's declaration, without really storing it into
* a variable. This pattern is commonly used in JavaScript to allow for "scoped"
* functions (functions that are only visible inside the scope), or to group logic
* into a single scope.
* Learn more about IIFE here:
* https://developer.mozilla.org/en-US/docs/Glossary/IIFE
*/
let myself = (() => {
	// This part is to store the "self" into the localstorage. This is to allow for
	// the user to come back as themselves later.
	const myself = localStorage.getItem('self-info');
	if (myself) return JSON.parse(myself);

	const newMyself = {
		name: `${randomItemFromArray(adjectives)} ${randomItemFromArray(animals)}`,
		color: randomItemFromArray(colors),
	}

	localStorage.setItem('self-info', JSON.stringify(newMyself));

	return newMyself;
})();

// Function executed when the user "sends" the message
messageFormElement.addEventListener('submit', event => {
	event.preventDefault();

	/**
	 * Get current time and date.
	 */
	function getTimestamp() {
		const today = new Date();

		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		const year = today.getFullYear();
		const hours = String(today.getHours()).padStart(2, '0');
		const minutes = String(today.getMinutes()).padStart(2, '0');

		return `${day}/${month}/${year} ${hours}:${minutes}`;
	}

	// Selects the input from the form
	const messageElement = messageFormElement.querySelector('input[name=message-value]');
	const messageText = messageElement.value;
	if (!messageText) return;
	const messageTimestamp = getTimestamp();
	const message = { text: messageText, sender: myself, timestamp: messageTimestamp };
	sendMessageToServer(message);

	// Clears the message text input
	messageElement.value = '';
});

/**
* @argument { Message } message
*/
async function sendMessageToServer (message) {
	try {
		await fetch(`${serverAddress}/messages`, {
			body: JSON.stringify(message),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		});
	} catch (e) {
		console.error(e);
	}
}

/**
* @argument { Message } message
*/
function createMessageOnUI (message) {
	const messageNode = messageTemplateElem.content.cloneNode(true);
	const messageContainerElement = messageNode.querySelector('.message-container');
	const messageNameElement = messageNode.querySelector('.message-name');
	const messageTimestampElement = messageNode.querySelector('.message-timestamp');
	const messageTextElement = messageNode.querySelector('.message-text');

	messageNameElement.innerText = message.sender.name;
	messageNameElement.style.color = message.sender.color;
	messageTimestampElement.innerText = message.timestamp;
	messageTextElement.innerText = message.text;

	// If I was the sender, push the message element to the right
	if (message.sender.name === myself.name) {
		messageContainerElement.style.marginLeft = 'auto';
	}

	messagesContainerElem.appendChild(messageNode);
}

async function fetchMessagesFromServer () {
	/** @type { Message[] } */
	let data;
	try {
		// Note that, by deafault, the `fetch` function makes uses a `GET` request method.
		const resp = await fetch(`${serverAddress}/messages`);
		data = await resp.json();
	} catch (e) {
		console.error(e);
		return;
	}

	/**
	* Contains all messages returned from the server that were not yet rendered.
	* The ideia is that if the array of messages on the server is larger than the
	* array of messages on the client, then that means some messages are new.
	* Since the messages are placed in order on the array, you just have to get the
	* last elements of the server message's array.
	*/
	const unrenderedMessages = data.slice(renderedMessages.length);

	unrenderedMessages.forEach(newMessage => {
		createMessageOnUI(newMessage);
		renderedMessages.push(newMessage);
	});
}

setInterval(fetchMessagesFromServer, 500);
/**
 * Build the user settings modal window.
 * @param  { Object } my User info - current name and color
 */
function buildSettingsDialog(my) {
	document.getElementById('name_input').value = my.name;
	let selector = document.getElementById('color_select');
	let fragment = document.createDocumentFragment();

	/**
	 * Create new <option> element to insert into colors dropdown
	 * @param  { string } value a color value
	 */
	function createOption(value) {
		let newOption = document.createElement('option');
		newOption.value = value; newOption.textContent = value;
		return newOption
	}

	// Purge existent color list, if it exists
	while (selector.firstChild) selector.removeChild(selector.firstChild);

	// Insert current user color first
	selector.appendChild(createOption(my.color));

	// Create colors dropdown
	colors.forEach(color => {
		if (color === my.color) return;
		fragment.appendChild(createOption(color));
	})
	
	selector.appendChild(fragment);
}

// Open modal window when user clicks setting button
settingsButtonElem.addEventListener('click', event => {
	settingsDialogElem.showModal();
	buildSettingsDialog(myself);
});

// Save new user settings and store into local storage
settingsFormElem.addEventListener('submit', event => {
	const newMyself = {
		name: document.getElementById('name_input').value,
		color: document.getElementById('color_select').value
	}

	localStorage.setItem('self-info', JSON.stringify(newMyself));
	myself = newMyself;
});

const [ dialogRandomizeButton, dialogCloseButton ] = settingsDialogFooterElem;

// Generate user settings and display it
dialogRandomizeButton.addEventListener('click', event => {
	const randomData = {
		name: `${randomItemFromArray(adjectives)} ${randomItemFromArray(animals)}`,
		color: randomItemFromArray(colors)
	}
	
	buildSettingsDialog(randomData);
});

// Closes user settings modal window
dialogCloseButton.addEventListener('click', event => {
	settingsDialogElem.close();
});