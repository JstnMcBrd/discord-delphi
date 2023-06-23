import type { Message } from "discord.js";

/**
 * @returns The content of the message, formatted for Delphi to understand
 */
export function formatPrompt (message: Message): string {
	let content = message.cleanContent;
	content = removeMentions(message.client.user.username, content);
	content = replaceCustomEmojis(content);
	content = content.trim();
	return content;
}

/**
 * Removes @ mentions of the user to avoid confusing the Delphi AI.
 *
 * @param username The username of the client user
 */
function removeMentions (username: string, content: string): string {
	return content.replaceAll(`@${username}`, "");
}

/**
 * Replaces unknown Discord emojis with the name of the emoji as *emphasized* text to avoid
 * confusing the Delphi AI.
 *
 * Example: `<:test_emoji:999999999999999999>` => `*test emoji*`
 */
function replaceCustomEmojis (content: string): string {
	content = content.replaceAll(/<:[\w\W][^:\s]+:\d+>/g, match => {
		match = match.replace("<:", "");
		match = match.replace(/:\d+>/g, "");
		match = match.replace("_", " ");
		return `*${match}*`;
	});
	return content;
}
