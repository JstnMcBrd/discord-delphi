/* GLOBAL MODIFIERS */
var lastUpdated = new Date(2021, 9, 24, 0, 30);	//month is 0-indexed
var typingSpeed = 6;	//how fast the bot sends messages (characters per second)

/* LOG IN */
var connect = function() {
	console.log("Logging in".system);
	client.login(auth.token).then(() => {
		console.log("Logged in successfully".system);
		console.log();
	}).catch(error => {
		var retryWait = 10; //seconds
	
		console.error("\t" + debugFormatError(error));
		console.log("Retrying connection in ".warning + retryWait + " seconds...".warning);
		console.log();
		setTimeout(connect, retryWait*1000); //use connect() function again
	});
}

/* EVENTS */
var onceReady = async function() {
	console.log("Client ready".system);
	console.log();
	
	setUserActivity();
	await registerSlashCommands();
}
var setUserActivity = function() {
	var repeatWait = 5*60; //seconds
	activityOptions = {
		name: "@"+client.user.username,
		type: 'LISTENING',
		url: "https://delphi.allenai.org/"
	}
	
	console.log("Setting user activity".system);
	presence = client.user.setActivity(activityOptions);
	
	//double check
	activity = presence.activities[0];
	var correct = false;
	if (activity !== undefined) {
		correct = activity.name === activityOptions.name &&
			activity.type === activityOptions.type &&
			activity.url === activityOptions.url;
	}
	if (correct)
		console.log("Set user activity successfully".system);
	else
		console.error("Failed to set user activity".warning);
	
	setTimeout(setUserActivity, repeatWait*1000); //set user activity at regular intervals
	console.log("Setting again in ".system + repeatWait + " seconds".system);
	console.log();
}
var registerSlashCommands = async function() {
	console.log("Implementing commands".system);
	
	console.log("\tLoading command files".system);
	client.commands = new Discord.Collection();
	var commands = [];
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));	//collect command scripts
	for (const file of commandFiles) {
		const command = require("./commands/" + file);
		client.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	}
	console.log("\tLoaded command files successfully".system);

	console.log("\tRegistering slash commands".system);
	const rest = new REST({ version: '9' }).setToken(auth.token);
	await rest.put(
		Routes.applicationCommands(client.user.id),
		{ body: commands }
	);
	console.log("\tRegistered slash commands successfully".system);
	
	console.log("Implemented commands successfully".system);
	console.log();
}

var onError = function(error) {
	console.log();
	console.error("Discord Client encountered error".warning);
	console.error("\t", debugFormatError(error));
	console.log();
}

var onInteraction = async function(interaction) {
	if (!interaction.isCommand()) return;
	console.log("Received command interaction".system);
	console.log("\t" + debugInteraction(interaction));
	if (!client.commands.has(interaction.commandName)) return;
	console.log("Command recognized".system);
	
	interaction.extraInfo = {
		lastUpdated: lastUpdated,	
	}

	console.log("Executing command".system);
	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error("\t" + debugFormatError(error));
		console.error("Failed to execute command".warning);
		console.log();
		sendErrorMessage(interaction, error);
		return;
	}
	console.log("Command executed successfully".system);
	console.log();
}

var onMessage = async function(message) {
									//ignore messages if they...
	if (isFromUser(message)) 	return;	//are from the user
	if (isEmptyMessage(message))	return;	//are empty (images, embeds, interactions)
	if (!isAMention(message))	return;	//if they are not a mention
		
	console.log("Received new message".system);	
	console.log(indent(debugMessage(message),1));
	
	//clean up message, also used in generateContext()
	console.log("Cleaning up message".system);
	var input = message.cleanContent;
	if (isAMention(message))
		input = removeMentions(input);
	input = replaceUnknownEmojis(input);
	input = input.trim();
	console.log(indent("Content: ".info + input, 1));
	
	//actually generate response
	console.log("Generating response".system);	
	
	fetchDelphiResponse(input).then(response => {	
		console.log("Generated response successfully".system);
		console.log("\tResponse: ".info + response);
	
		var timeTypeSec = response.length / typingSpeed;
		message.channel.sendTyping();		//will automatically stop typing when message sends
		console.log("Sending message".system);
		setTimeout(
			function() {
				message.channel.messages.fetch({limit: 1}).then(lastMessages => {
					if (lastMessages.first().id === message.id)	//respond normally if no extra messages have been sent in the meantime
						message.channel.send(response).then(() => {
							console.log("Sent message successfully".system);
							console.log();
						}).catch(error => {
							console.error("\t" + debugFormatError(error));
							console.error("Failed to send message".warning);
						});
					else										//use reply to respond directly if extra messages are in the way
						message.reply(response).then(() => {
							console.log("Sent reply successfully".system);
							console.log();
						}).catch(error => {
							console.error("\t" + debugFormatError(error));
							console.error("Failed to send reply".warning);
						});
				});
			}, 
			timeTypeSec * 1000	//milliseconds
		);
	}).catch(error => {
		console.error("\t" + debugFormatError(error));	//log the error
		console.error("Failed to generate response".warning);
		//if (error.message === "Response timeout of 10000ms exceeded" ||
		//error === "Failed to get a response after 15 tries") {
		//	console.log("Trying again".system);
		//	console.log();
		//	onMessage(message);								//if error is timeout, then try again
		//}
		//else {
		console.log("Replying with error message".system);
		console.log();
		sendErrorMessage(message, error);				//if unknown error, then respond to message with error message
		//}
	});
}
var removeMentions = function(content) {
	return content.replaceAll("@​"+client.user.username, "");
	//there's a special character after the @, but it doesn't show up in any text editor
	//don't delete it! Otherwise, the bot will fail to recognize mentions
}
var replaceUnknownEmojis = function(content) {
	//replaces all unknown emojis with their id as *emphasized* text
	//start with custom emojis
	content = content.replaceAll(/<:[\w\W][^:\s]+:\d+>/g, match => {
		match = match.replace("<:", "");
		match = match.replace(/:\d+>/g, "");
		match = match.replace("_", " ");
		return "*"+match+"*";
	});
	//now replace any unknown emojis that aren't custom
	content = content.replaceAll(":", "*").replaceAll("_", " ");
	return content;
}
const fetchDelphiResponse = async function(input) {
	const requestURL = "https://mosaic-api-morality.apps.allenai.org/api/ponder?action1=" + encodeURIComponent(input);
	let json = await fetchJSON(requestURL);
	return json.answer.text;
}
const fetchJSON = async function(requestURL) {
	console.log("\tFetching from URL:".system, requestURL);
	let response = await fetch(requestURL);
	let json = await response.json();
	console.log("\tFetched JSON:".info, JSON.stringify(json));
	return json;
} 

var sendErrorMessage = function(message, error) {
	console.log("Sending error message".system);
	var embed = {
		title: "Error",
		description: "I encountered an error while trying to respond. Please forward this to my developer.",
		color: 16711680, //red
		fields: [
			{
				name: "Message",
				value: "``" + error + "``"
			}
		]
	}
	
	message.reply({embeds: [embed]}).then(() => {
		console.log("Error message sent successfully".system);
		console.log();
	}).catch(error => {
		console.error("\t" + debugFormatError(error));
		console.log("Failed to send error message".warning);
		console.log();
	});
}

/* MESSAGES */
var isFromUser = function(message) {
	return message.author.id === client.user.id;
}

var isEmptyMessage = function(message) {
	return message.cleanContent === "";
}

var isAMention = function(message) {
	return message.mentions.has(client.user);
}

/* DEBUG */
var indent = function(str, numTabs) {	//this is for indenting strings that have more than one line
	var tabs = "";
	while (numTabs > 0) {
		tabs += '\t';
		numTabs--;
	}
	return (tabs + str).replaceAll('\n', '\n'+tabs);
}

var debugFormatError = function(error) {
	if (error.name !== undefined)
		error.name = error.name.error;
	return error;
}

var debugMessage = function(message) {
	str  = "MESSAGE".info;
	str += "\nContent: ".info + message.cleanContent;
	str += "\nAuthor:  ".info + message.author.tag + " (".info + message.author.id + ")".info;
	str += "\nChannel: ".info + message.channel.name + " (".info + message.channel.id + ")".info;
	if (message.guild !== null)		//compensate for DMs
		str += "\nGuild:   ".info + message.guild.name + " (".info + message.guild.id + ")".info;
	return str;
}

var debugInteraction = function(interaction) {
	str  = "INTERACTION".info;
	if (interaction.isCommand())
		str += "\nCommand: ".info + interaction.commandName;
	str += "\nUser:    ".info + interaction.user.tag + " (".info + interaction.user.id + ")".info;
	str += "\nChannel: ".info + interaction.channel.name + " (".info + interaction.channel.id + ")".info;
	if (interaction.guild !== null)	//compensate for DMs
		str += "\nGuild:   ".info + interaction.guild.name + " (".info + interaction.guild.id + ")".info;
	return str;
}

/* THE ACTION */
//requires
console.log("Importing packages");//.system);	//won't work yet because colors isn't imported
var fs = require('fs');
//var fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var colors = require('colors');
colors.setTheme({
	system: ['green'],
	warning: ['yellow'],
	error: ['red'],
	info: ['gray']
});
var Discord = require('discord.js');
var client = new Discord.Client({
	partials: [
		'CHANNEL'
	],
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
	]
});
client.on('error', error => onError(error));
client.once('ready', onceReady);
client.on('interactionCreate', interaction => onInteraction(interaction));
client.on('messageCreate', message => onMessage(message));
var { REST } = require('@discordjs/rest');
var { Routes } = require('discord-api-types/v9');
console.log("Imported packages successfully".system);
console.log();

//load memory files
console.log("Loading memory files".system);
if (process.argv[2] === undefined) {										//was login info provided?
	var error = new Error();
	error.name = "Missing Console Argument";
	error.message = "Account directory name not provided";
	error.message += "\n\tPlease follow this usage:";
	error.message += "\n\tnode " + process.argv[1] + " " + "[ACCOUNT DIRECTORY NAME]".underline;
	throw debugFormatError(error);
}
var filePath = "./accounts/" + process.argv[2] + "/";
var authFilePath = filePath + "auth.json";
if (!fs.existsSync(filePath)) {											//does the necessary directory exist?
	var error = new Error();
	error.name = "Missing Account Directory".error;
	error.message = "Account directory does not exist";
	error.message += "\n\tPlease create a directory (" + filePath + ") to contain the account's memory files";
	throw debugFormatError(error);
}
if (!fs.existsSync(authFilePath)) {	//do the necessary files exist?
	var error = new Error();
	error.name = "Missing Memory Files".error;
	error.message = "Account directory missing essential memory files";
	error.message += "\n\tPlease create the necessary files (" + authFilePath + ") (" + whitelistFilePath + ")";
	throw debugFormatError(error);
}
var auth = require(authFilePath);
console.log("Loaded memory files successfully".system);
console.log();

//let's begin
connect();