/* Discord-Delphi */

// When this code was last changed
// year, month (0-11), day of month, hour (0-23), minutes
const lastUpdated = new Date(2022, 8, 25, 3, 0);
// How fast the bot sends messages (characters per second)
const typingSpeed = 6;
// The colors that the console output should use
const debugTheme = {
	system: ['green'],
	warning: ['yellow'],
	error: ['red'],
	info: ['gray'],
};

// Connects the client with the discord API
const connect = function() {
	// How long to wait before trying again (seconds)
	const retryWait = 10;

	console.log('Logging in'.system);
	client.login(auth.token).then(() => {
		console.log('Logged in successfully'.system);
		console.log();
	}).catch(error => {
		console.error('\t' + debugFormatError(error));
		console.log('Retrying connection in '.warning + retryWait + ' seconds...'.warning);
		console.log();
		// Use connect() function again
		setTimeout(connect, retryWait * 1000);
	});
};

// Called once the client successfully logs in
const onceReady = async function() {
	console.log('Client ready'.system);
	console.log();

	setUserActivity();
	await retrieveSlashCommands();
};

// Sets the acitivity of the bot to be 'Listening to /help'
const setUserActivity = function() {
	// How long to wait before trying again (seconds)
	const repeatWait = 5 * 60;

	// Wait until Discord supports custom statuses for bots
	/*
	activityOptions = {
		name: 'Use /help',
		details: 'Use /help',
		emoji: {
			name: 'robot'
		},
		type: Discord.ActivityType.Custom,
		url: 'https://www.cleverbot.com/'
	}
	*/
	// Use this in the meantime
	const activityOptions = {
		name: '/help',
		type: Discord.ActivityType.Listening,
		url: 'https://delphi.allenai.org/',
	};

	// Set the user's activity
	console.log('Setting user activity'.system);
	const presence = client.user.setActivity(activityOptions);

	// Double check to see if it worked
	// This currently always returns true, but discord.js doesn't have a better way to check
	const activity = presence.activities[0];
	let correct = false;
	if (activity !== undefined) {
		correct = activity.name === activityOptions.name &&
			activity.type === activityOptions.type &&
			activity.url === activityOptions.url;
	}
	if (correct)	console.log('Set user activity successfully'.system);
	else 			console.error('Failed to set user activity'.warning);

	// Set user activity at regular intervals
	setTimeout(setUserActivity, repeatWait * 1000);
	console.log('Setting again in '.system + repeatWait + ' seconds'.system);
	console.log();
};

// Retrieves the command names and files
const retrieveSlashCommands = async function() {
	console.log('Retrieving commands'.system);

	// Gather all the command files
	client.commands = new Discord.Collection();
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// Extract the name and executables of the command files
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
		console.log('\tRetrieved /' + command.data.name);
	}

	console.log('Retrieved commands successfully'.system);
	console.log();
};

// Called whenever the discord.js client encounters an error
const onError = function(error) {
	console.log();
	console.error('Discord Client encountered error'.warning);
	console.error('\t', debugFormatError(error));
	console.log();
};

// Called whenever the discord.js client receives an interaction (usually means a slash command)
const onInteraction = async function(interaction) {
	// Ignore any interactions that are not commands
	if (!interaction.isChatInputCommand()) return;
	console.log('Received command interaction'.system);
	console.log('\t' + debugInteraction(interaction));

	// Ignore any commands that are not recognized
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	console.log('Command recognized'.system);

	// Give additional information to the interaction to be passed to the command script
	interaction.extraInfo = {
		lastUpdated: lastUpdated,
	};

	// Execute the command script
	console.log('Executing command'.system);
	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error('\t' + debugFormatError(error));
		console.error('Failed to execute command'.warning);
		console.log();
		sendErrorMessage(interaction, error);
		return;
	}
	console.log('Command executed successfully'.system);
	console.log();
};

// Called whenever the discord.js client observes a new message
const onMessage = async function(message) {
	// Ignore messages if they are...
	// ... from the user
	if (isFromUser(message)) return;
	// ... empty (images, embeds, interactions)
	if (isEmptyMessage(message)) return;
	// ... not a mention
	if (!isAMention(message)) return;

	console.log('Received new message'.system);
	console.log(indent(debugMessage(message), 1));

	// Clean up message, also used in generateContext()
	console.log('Cleaning up message'.system);
	let input = message.cleanContent;
	if (isAMention(message)) {
		input = removeMentions(input);
	}
	input = replaceUnknownEmojis(input);
	input = input.trim();
	console.log(indent('Content: '.info + input, 1));

	// Actually generate response
	console.log('Generating response'.system);
	fetchDelphiResponse(input).then(response => {
		console.log('Generated response successfully'.system);
		console.log('\tResponse: '.info + response);

		// Determine how long to show the typing indicator before sending the message (seconds)
		const timeTypeSec = response.length / typingSpeed;
		message.channel.sendTyping();
		// Will automatically stop typing when message sends

		// Send the message once the typing time is over
		console.log('Sending message'.system);
		setTimeout(
			function() {
				// Respond normally if no extra messages have been sent in the meantime
				if (message.channel.lastMessageId === message.id) {
					message.channel.send(response).then(() => {
						console.log('Sent message successfully'.system);
						console.log();
					}).catch(error => {
						console.error('\t' + debugFormatError(error));
						console.error('Failed to send message'.warning);
					});
				}
				// Use reply to respond directly if extra messages are in the way
				else {
					message.reply(response).then(() => {
						console.log('Sent reply successfully'.system);
						console.log();
					}).catch(error => {
						console.error('\t' + debugFormatError(error));
						console.error('Failed to send reply'.warning);
					});
				}
			},
			timeTypeSec * 1000,
		);
	}).catch(error => {
		// Log the error
		console.error('\t' + debugFormatError(error));
		console.error('Failed to generate response'.warning);

		// If unknown error, then respond to message with error message
		console.log('Replying with error message'.system);
		console.log();
		sendErrorMessage(message, error);
	});
};

// Removes @ mentions of the user to avoid confusing the Delphi AI
const removeMentions = function(content) {
	return content.replaceAll('@' + client.user.username, '');
};

// Replaces unknown discord emojis with the name of the emoji as *emphasized* text to avoid confusing the Delphi AI
const replaceUnknownEmojis = function(content) {
	// Start with custom emojis
	content = content.replaceAll(/<:[\w\W][^:\s]+:\d+>/g, match => {
		match = match.replace('<:', '');
		match = match.replace(/:\d+>/g, '');
		match = match.replace('_', ' ');
		return '*' + match + '*';
	});
	// Now replace any unknown emojis that aren't custom
	content = content.replaceAll(':', '*').replaceAll('_', ' ');
	return content;
};

// Formats the request URL for fetchJSON and parses the JSON for the answer text
const fetchDelphiResponse = async function(input) {
	if (input == '') input = ' ';
	const requestURL = 'https://mosaic-api-frontdoor.apps.allenai.org/predict?action1=' + encodeURIComponent(input);
	const json = await fetchJSON(requestURL);
	return json.answer.text;
};

// Fetches a JSON from a URL
const fetchJSON = async function(requestURL) {
	console.log('\tFetching from URL:'.system, requestURL);
	const response = await fetch(requestURL);
	if (response.status !== 200 || response.statusText !== 'OK') {
		const error = new Error();
		error.name = 'HTTPError';
		error.message = response.status + ' ' + response.statusText;
		throw error;
	}

	const json = await response.json();
	console.log('\tFetched JSON:'.info, JSON.stringify(json));
	return json;
};

// Responds to a message with an error message
const sendErrorMessage = function(message, internalError) {
	const hexRed = 0xFF0000;

	// Format the message as an embed
	const embed = {
		title: 'Error',
		description: 'I encountered an error while trying to respond. Please forward this to my developer.',
		// Red
		color: hexRed,
		fields: [
			{
				name: 'Message',
				value: '``' + internalError + '``',
			},
		],
	};

	// Send the error message as a reply
	console.log('Sending error message'.system);
	message.reply({ embeds: [embed] }).then(() => {
		console.log('Error message sent successfully'.system);
		console.log();
	}).catch(error => {
		console.error('\t' + debugFormatError(error));
		console.log('Failed to send error message'.warning);
		console.log();
	});
};

// Recognizes when a message is from the current user
const isFromUser = function(message) {
	return message.author.id === client.user.id;
};

// Recognizes when a message is empty (mostly likely an image)
const isEmptyMessage = function(message) {
	return message.cleanContent === '';
};

// Recognizes when a message @ mentions the current user
const isAMention = function(message) {
	return message.mentions.has(client.user);
};

// Indents strings that have more than one line
const indent = function(str, numTabs) {
	let tabs = '';
	while (numTabs > 0) {
		tabs += '\t';
		numTabs--;
	}
	return (tabs + str).replaceAll('\n', '\n' + tabs);
};

// Takes either a string or an Error and gives them the error color for the console
const debugFormatError = function(error) {
	// If the error is just a string, color it with the error color
	if (typeof (error) === 'string') {
		return error.error;
	}

	// If the error is an error object, color the title with the error color
	const e = new Error();
	if (error.name !== undefined) {
		e.name = error.name.error;
	}
	e.message = error.message;
	return e;
};

// Logs important information about a message to the console
const debugMessage = function(message) {
	let str = 'MESSAGE'.info;
	str += '\nContent: '.info + message.cleanContent;
	str += '\nAuthor:  '.info + message.author.tag + ' ('.info + message.author.id + ')'.info;
	str += '\nChannel: '.info + message.channel.name + ' ('.info + message.channel.id + ')'.info;
	// Compensate for DMs
	if (message.guild !== null) {
		str += '\nGuild:   '.info + message.guild.name + ' ('.info + message.guild.id + ')'.info;
	}
	return str;
};

// Logs important information about an interaction to the console
const debugInteraction = function(interaction) {
	let str = 'INTERACTION'.info;
	if (interaction.isChatInputCommand()) {
		str += '\nCommand: '.info + interaction.commandName;
	}
	str += '\nUser:    '.info + interaction.user.tag + ' ('.info + interaction.user.id + ')'.info;
	str += '\nChannel: '.info + interaction.channel.name + ' ('.info + interaction.channel.id + ')'.info;
	// Compensate for DMs
	if (interaction.guild !== null) {
		str += '\nGuild:   '.info + interaction.guild.name + ' ('.info + interaction.guild.id + ')'.info;
	}
	return str;
};


// Action!

console.log('Importing packages');
// .system);	// Won't work yet because colors isn't imported

// Load in all the required packages
const fs = require('node:fs');
const path = require('node:path');
const colors = require('@colors/colors');
const Discord = require('discord.js');
// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({ default: node_fetch }) => node_fetch(...args));
// The latest versions of node-fetch can only be imported asynchronously

// Set the console debug colors
colors.setTheme(debugTheme);

// Create a discord client and give it the callback methods
const client = new Discord.Client({
	partials: [
		// Necessary to receive DMs
		Discord.Partials.Channel,
	],
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMessageTyping,
		Discord.GatewayIntentBits.DirectMessages,
		Discord.GatewayIntentBits.DirectMessageTyping,
		Discord.GatewayIntentBits.MessageContent,
	],
});
client.on('error', error => onError(error));
client.once('ready', onceReady);
client.on('interactionCreate', interaction => onInteraction(interaction));
client.on('messageCreate', message => onMessage(message));

console.log('Imported packages successfully'.system);
console.log();

// Load memory files
console.log('Loading memory files'.system);

// Was login info provided?
if (process.argv[2] === undefined) {
	const error = new Error();
	error.name = 'Missing Console Argument';
	error.message = 'Account directory name not provided';
	error.message += '\n\tPlease follow this usage:';
	error.message += '\n\tnode ' + process.argv[1] + ' ' + '[ACCOUNT DIRECTORY NAME]'.underline;
	throw debugFormatError(error);
}
const filePath = './accounts/' + process.argv[2] + '/';
const authFilePath = filePath + 'auth.json';

// Does the necessary directory exist?
if (!fs.existsSync(filePath)) {
	const error = new Error();
	error.name = 'Missing Account Directory';
	error.message = 'Account directory does not exist';
	error.message += '\n\tPlease create a directory (' + filePath + ') to contain the account\'s memory files';
	throw debugFormatError(error);
}

// Do the necessary files exist?
if (!fs.existsSync(authFilePath)) {
	const error = new Error();
	error.name = 'Missing Memory Files';
	error.message = 'Account directory missing essential memory files';
	error.message += '\n\tPlease create the necessary files (' + authFilePath + ')';
	throw debugFormatError(error);
}
const auth = require(authFilePath);

console.log('Loaded memory files successfully'.system);
console.log();

// Let's begin
connect();