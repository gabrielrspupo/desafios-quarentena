const { compareTwoStrings } = require('string-similarity');
const SIMILARITY_INDEX = 0.4;

// Countries to be guessed
const countries = [
    ['Europa', 'dos moinhos de vento', 'holandês', 'Holanda'],
    ['América', 'do castor', 'inglês', 'Canadá'],
    ['América', 'dos astecas', 'espanhol', 'México'],
    ['África', 'das pirâmides', 'árabe', 'Egito'],
    ['América', 'do café', 'espanhol', 'Colômbia'],
    ['Europa', 'da cerveja', 'francês', 'Bélgica']
]

let isPlaying = false;
let guess = null;

/**
* Just a simple sleep function. It will return a promisse that will resolve itself
* in `time` milisseconds.
* @argument { number } time The time in Milisseconds the function will wait.
* @returns { Promise<void> }
*/
function sleep (time) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), time);
	});
}

class Country {
    /**
     * Defines a new country
     * 
     * @param { string } continent Country continent
     * @param { string } known_for What it is known for
     * @param { string } language Official language
     * @param { string } name What the guesser must say
     */
    constructor(continent, known_for, language, name) {
        this.continent = continent;
        this.known_for = known_for;
        this.language = language;
        this.name = name;
    }

    /**
     * Announce guess' tips.
     * 
     * @argument { import('node-telegram-bot-api') } bot
     * @argument { number } chatId
     */
    async announce(bot, chatId) {
        await bot.sendMessage(chatId, `É um país da ${this.continent}...`);
        await sleep(1000);
        await bot.sendMessage(chatId, `Terra ${this.known_for}...`);
        await sleep(1000);
        await bot.sendMessage(chatId, `Seu idioma é o ${this.language}...`);
        await sleep(1000);
        await bot.sendMessage(chatId, `Que país é esse?!`);
    }

    /**
     * Check if the guesser got it right
     * @param { string } answer 
     */
    correctAnswer(answer) {
        return compareTwoStrings(answer, this.name) > SIMILARITY_INDEX;
    }
}

/**
* Plays a quiz game of guessing the country.
*
* @argument { import('node-telegram-bot-api') } bot
* @argument { number } chatId
* @returns { boolean } A flag to indicate whether the message was used or not.
*/
function main (bot, chatId, message) {
	if (message === '/faustao') {
        isPlaying = true;
        guess = new Country( ...countries[Math.floor(Math.random() * countries.length)] )
        guess.announce(bot, chatId);
        return true;
    } else if (isPlaying) {
        if (guess.correctAnswer(message)) bot.sendMessage(chatId, 'Parabéns, você é fera bixo!')
        else bot.sendMessage(chatId, 'EEEERROUUUUU!!');

        isPlaying = false;
        return true;
	} else {
		return false;
	}
}

module.exports = {
	main
}