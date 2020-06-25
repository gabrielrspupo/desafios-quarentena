const { compareTwoStrings } = require('string-similarity');
const SIMILARITY_INDEX = 0.5;
/**
* Answers certain question sent by the user.
*
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
* @returns { boolean } A flag to indicate whether the message was used or not.
*/
function main (bot, chatId, message) {
	if (compareTwoStrings(message, 'Que dia é hoje?') > SIMILARITY_INDEX) {
        const today = new Date();
		bot.sendMessage(chatId, `Hoje é dia ${today.getDate()}/${today.getMonth()+1}.`);
        return true;
    } else if (compareTwoStrings(message, '/almoco') > SIMILARITY_INDEX) {
        bot.sendMessage(chatId, '🏫 São Carlos, Área 1 🍽 ☀️ Almoço de... não, pera.');
        return true;
	} else if (compareTwoStrings(message, '/jantar') > SIMILARITY_INDEX) {
        bot.sendMessage(chatId, '🏫 São Carlos, Área 1 🍽 ☀️ Jantar de... hã?');
        return true;
    } else if (compareTwoStrings(message, 'Que horas são') > SIMILARITY_INDEX) {
        bot.sendMessage(chatId, 'Por acaso tenho cara de relógio para você?');
        return true;
	} else if (compareTwoStrings(message, 'Qual é o seu nome?') > SIMILARITY_INDEX) {
        bot.sendMessage(chatId, 'Meu nome é <code>01101111011010010010000001100011011101010111 001001101001011011110111001101101111</code>, mas você pode me chamar de Bot.', {parse_mode : "HTML"})
        return true;
    } else if (compareTwoStrings(message, 'Eu te amo.') > SIMILARITY_INDEX) {
        bot.sendMessage(chatId, `Nem vai me convidar para um jantar primeiro?`);
        return true;
	} else {
		return false;
	}
}

module.exports = {
	main
}