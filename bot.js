/* GLOBAL MODIFIERS */
//when this code was last changed
var lastUpdated = new Date(2022, 6, 26, 19, 00);	//month is 0-indexed
//how fast the bot sends messages (characters per second)
var typingSpeed = 6;
//the colors that the console output should use
var debugTheme = {
	system: ['green'],
	warning: ['yellow'],
	error: ['red'],
	info: ['gray']
}

/* LOG IN */
//this method connects the client with the discord API
var connect = function() {
	var retryWait = 10; //seconds
	
	console.log("Logging in".system);
	client.login(auth.token).then(() => {
		console.log("Logged in successfully".system);
		console.log();
	}).catch(error => {
		console.error("\t" + debugFormatError(error));
		console.log("Retrying connection in ".warning + retryWait + " seconds...".warning);
		console.log();
		//use connect() function again
		setTimeout(connect, retryWait*1000);
	});
}

/* EVENTS */
//this method is called once the client successfully logs in
var onceReady = async function() {
	console.log("Client ready".system);
	console.log();
	
	setUserActivity();
	await registerSlashCommands();
}

//this method sets the acitivity of the bot to be "Listening to /help"
var setUserActivity = function() {
	var repeatWait = 5*60; //seconds
	activityOptions = {
		name: "/help",
		type: 'LISTENING',
		url: "https://delphi.allenai.org/"
	}
	
	//set the user's activity
	console.log("Setting user activity".system);
	presence = client.user.setActivity(activityOptions);
	
	//double check to see if it worked
	//this currently always returns true, but discord.js doesn't have a better way to check
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
	
	//set user activity at regular intervals
	setTimeout(setUserActivity, repeatWait*1000);
	console.log("Setting again in ".system + repeatWait + " seconds".system);
	console.log();
}

//this method registers commands with discord's new slash command API
var registerSlashCommands = async function() {
	console.log("Implementing commands".system);
	
	console.log("\tLoading command files".system);
	
	//collect command scripts
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	
	//add command scripts to list of commands
	client.commands = new Discord.Collection();
	var commands = [];
	for (const file of commandFiles) {
		const command = require("./commands/" + file);
		client.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	}
	
	console.log("\tLoaded command files successfully".system);

	//register commands with discord REST service
	console.log("\tRegistering slash commands".system);
	const rest = new REST({ version: '10' }).setToken(auth.token);
	await rest.put(
		Routes.applicationCommands(client.user.id),
		{ body: commands }
	);
	console.log("\tRegistered slash commands successfully".system);
	
	console.log("Implemented commands successfully".system);
	console.log();
}

//this method is called whenever the discord.js client encounters an error
var onError = function(error) {
	console.log();
	console.error("Discord Client encountered error".warning);
	console.error("\t", debugFormatError(error));
	console.log();
}

//this method is called whenever the discord.js client receives an interaction
//usually means a slash command
var onInteraction = async function(interaction) {
	//ignore any interactions that are not commands
	if (!interaction.isChatInputCommand()) return;
	console.log("Received command interaction".system);
	console.log("\t" + debugInteraction(interaction));
	
	//ignore any commands that are not recognized
	if (!client.commands.has(interaction.commandName)) return;
	console.log("Command recognized".system);
	
	//give additional information to the interaction to be passed to the command script
	interaction.extraInfo = {
		lastUpdated: lastUpdated,	
	}

	//execute the command script
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

//this method is called whenever the discord.js client observes a new message
var onMessage = async function(message) {
	//ignore messages if they are...
	if (isFromUser(message)) return;		//from the user
	if (isEmptyMessage(message)) return;	//empty (images, embeds, interactions)
	if (!isAMention(message)) return;		//not a mention
		
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
	
		//determine how long to show the typing indicator before sending the message
		var timeTypeSec = response.length / typingSpeed; //seconds
		message.channel.sendTyping(); //will automatically stop typing when message sends
		
		//send the message once the typing time is over
		console.log("Sending message".system);
		setTimeout(
			function() {
				//respond normally if no extra messages have been sent in the meantime
				if (message.channel.lastMessageId === message.id)
					message.channel.send(response).then(() => {
						console.log("Sent message successfully".system);
						console.log();
					}).catch(error => {
						console.error("\t" + debugFormatError(error));
						console.error("Failed to send message".warning);
					});
				//use reply to respond directly if extra messages are in the way
				else
					message.reply(response).then(() => {
						console.log("Sent reply successfully".system);
						console.log();
					}).catch(error => {
						console.error("\t" + debugFormatError(error));
						console.error("Failed to send reply".warning);
					});
			}, 
			timeTypeSec * 1000	//milliseconds
		);
	}).catch(error => {
		//log the error
		console.error("\t" + debugFormatError(error));
		console.error("Failed to generate response".warning);
		
		//if unknown error, then respond to message with error message
		console.log("Replying with error message".system);
		console.log();
		sendErrorMessage(message, error);
	});
}

//this method removes @ mentions of the user to avoid confusing the Delphi AI
var removeMentions = function(content) {
	return content.replaceAll("@​"+client.user.username, "");
	//there's a special character after the @, but it doesn't show up in any text editor
	//don't delete it! Otherwise, the bot will fail to recognize mentions
}

//this method replaces unknown discord emojis with the name of the emoji as *emphasized* text to avoid confusing the Delphi AI
var replaceUnknownEmojis = function(content) {
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

//formats the request URL for fetchJSON and parses the JSON for the answer text
const fetchDelphiResponse = async function(input) {
	if (input == "") input = " "
	const requestURL = "https://mosaic-api-frontdoor.apps.allenai.org/predict?action1=" + encodeURIComponent(input);
	let json = await fetchJSON(requestURL);
	return json.answer.text;
}

//fetches a JSON from a URL
const fetchJSON = async function(requestURL) {
	console.log("\tFetching from URL:".system, requestURL);
	let response = await fetch(requestURL);
	if (response.status !== 200 || response.statusText !== "OK") {
		var error = new Error();
		error.name = "HTTPError";
		error.message = response.status + " " + response.statusText;
		throw error;
	}
	
	let json = await response.json();
	console.log("\tFetched JSON:".info, JSON.stringify(json));
	return json;
}

//this method responds to a message with an error message
var sendErrorMessage = function(message, error) {
	//format the message as an embed
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
	
	//send the error message as a reply
	console.log("Sending error message".system);
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
//this method recognizes when a message is from the current user
var isFromUser = function(message) {
	return message.author.id === client.user.id;
}

//this method recognizes when a message is empty (mostly likely an image)
var isEmptyMessage = function(message) {
	return message.cleanContent === "";
}

//this method recognizes when a message @ mentions the current user
var isAMention = function(message) {
	return message.mentions.has(client.user);
}

/* DEBUG */
//this method is for indenting strings that have more than one line
var indent = function(str, numTabs) {
	var tabs = "";
	while (numTabs > 0) {
		tabs += '\t';
		numTabs--;
	}
	return (tabs + str).replaceAll('\n', '\n'+tabs);
}

//this method takes either a string or an Error and gives them the error color for the console
var debugFormatError = function(error) {
	if (typeof(error) === 'string')
		return error.error;
	var e = new Error();
	if (error.name !== undefined)
		e.name = error.name.error;
	e.message = error.message;
	return e;
}

//this method logs important information about a message to the console
var debugMessage = function(message) {
	str  = "MESSAGE".info;
	str += "\nContent: ".info + message.cleanContent;
	str += "\nAuthor:  ".info + message.author.tag + " (".info + message.author.id + ")".info;
	str += "\nChannel: ".info + message.channel.name + " (".info + message.channel.id + ")".info;
	//compensate for DMs
	if (message.guild !== null)
		str += "\nGuild:   ".info + message.guild.name + " (".info + message.guild.id + ")".info;
	return str;
}

//this method logs important information about an interaction to the console
var debugInteraction = function(interaction) {
	str  = "INTERACTION".info;
	if (interaction.isChatInputCommand())
		str += "\nCommand: ".info + interaction.commandName;
	str += "\nUser:    ".info + interaction.user.tag + " (".info + interaction.user.id + ")".info;
	str += "\nChannel: ".info + interaction.channel.name + " (".info + interaction.channel.id + ")".info;
	//compensate for DMs
	if (interaction.guild !== null)
		str += "\nGuild:   ".info + interaction.guild.name + " (".info + interaction.guild.id + ")".info;
	return str;
}

/* THE ACTION */
console.log("Importing packages");//.system);	//won't work yet because colors isn't imported

//load in all the required packages
var fs = require('fs');
var colors = require('@colors/colors');
var Discord = require('discord.js');
//var fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var { REST } = require('@discordjs/rest');
var { Routes } = require('discord-api-types/v10');


//set the console debug colors
colors.setTheme(debugTheme);

//create a discord client and give it the callback methods
var client = new Discord.Client({
	partials: [
		Discord.Partials.Channel //necessary to receive DMs
	],
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMessageTyping,
		Discord.GatewayIntentBits.DirectMessages,
		Discord.GatewayIntentBits.DirectMessageTyping,
		Discord.GatewayIntentBits.MessageContent
	]
});
client.on('error', error => onError(error));
client.once('ready', onceReady);
client.on('interactionCreate', interaction => onInteraction(interaction));
client.on('messageCreate', message => onMessage(message));

console.log("Imported packages successfully".system);
console.log();

//load memory files
console.log("Loading memory files".system);

//was login info provided?
if (process.argv[2] === undefined) {
	var error = new Error();
	error.name = "Missing Console Argument";
	error.message = "Account directory name not provided";
	error.message += "\n\tPlease follow this usage:";
	error.message += "\n\tnode " + process.argv[1] + " " + "[ACCOUNT DIRECTORY NAME]".underline;
	throw debugFormatError(error);
}
var filePath = "./accounts/" + process.argv[2] + "/";
var authFilePath = filePath + "auth.json";

//does the necessary directory exist?
if (!fs.existsSync(filePath)) {
	var error = new Error();
	error.name = "Missing Account Directory".error;
	error.message = "Account directory does not exist";
	error.message += "\n\tPlease create a directory (" + filePath + ") to contain the account's memory files";
	throw debugFormatError(error);
}

//do the necessary files exist?
if (!fs.existsSync(authFilePath)) {
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