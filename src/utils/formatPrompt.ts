import type { Message } from 'discord.js';

/**
 * @returns The content of the message, formatted for Delphi to understand
 */
export function formatPrompt(message: Message): string {
	let content = message.cleanContent;
	content = removeMentions(message.client.user.username, content);
	content = content.trim();
	return content;
}

/**
 * Removes @ mentions of the user to avoid confusing the Delphi AI.
 *
 * @param username The username of the client user
 */
function removeMentions(username: string, content: string): string {
	return content.replaceAll(`@${username}`, '');
}
