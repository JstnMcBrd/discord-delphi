/** discord-delphi */

import { ActivityType, Client, Partials, GatewayIntentBits } from 'discord.js';
import type { ActivityOptions } from 'discord.js';

import { registerEventHandlers } from './events/index.js';
import { getToken, load as loadEnv } from './memory/env.js';
import { info } from './logger.js';

info('discord-delphi');
info();

// Load environment variables
loadEnv();
const token = getToken();

/** The activity the bot should use. */
const activityOptions: ActivityOptions = {
	name: '/help',
	type: ActivityType.Listening,
	url: 'https://delphi.allenai.org/',

	// FIXME wait until Discord supports custom statuses for bots.
	// https://github.com/JstnMcBrd/discord-delphi/issues/5
	// name: 'Custom Status',
	// state: 'Use /help',
	// emoji: {
	// 	name: 'robot',
	// },
	// type: ActivityType.Custom,
	// url: 'https://delphi.allenai.org/',
};

// Setup client
const client = new Client({
	// Setting the activity in the client constructor resolves the disappearing issue
	// https://github.com/JstnMcBrd/discord-delphi/issues/33
	presence: {
		activities: [activityOptions],
	},
	partials: [
		// Necessary to receive DMs
		// https://discordjs.guide/additional-info/changes-in-v13.html#dm-channels
		Partials.Channel,
	],
	intents: [
		// Necessary for channels to be cached
		GatewayIntentBits.Guilds,
		// Necessary to receive messageCreate events
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		// Necessary to read message content
		GatewayIntentBits.MessageContent,
	],
});

registerEventHandlers(client);

// Login
info('Logging in...');
await client.login(token);
