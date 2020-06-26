const HELP_TEXT = "/jokempo - Jogue uma partida de jokempô comigo!\n/faustao - Tente adivinhar o país que estou pensando..."

/**
* Sends a help message to the user with all the bot commands.
*
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
* @returns { boolean } A flag to indicate whether the message was used or not.
*/
function main (bot, chatId, message) {
	if (message === '/help') {
		bot.sendMessage(chatId, HELP_TEXT);
		return true;
	} else {
		return false;
	}
}

module.exports = {
	main
}