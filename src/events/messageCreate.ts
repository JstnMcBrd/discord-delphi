import delphi from "delphi-ai";
import type { Message, TextBasedChannel } from "discord.js";

import { EventHandler } from "./EventHandler.js";
import { formatPrompt } from "../utils/formatPrompt.js";
import { doesMentionSelf, isFromSelf, isEmpty } from "../utils/messageAnalysis.js";
import { replyWithError } from "../utils/replyWithError.js";
import { sleep } from "../utils/sleep.js";
import { typingSpeed } from "../parameters.js";
import { debug, error, info } from "../logger.js";

/** Called whenever the client observes a new message. */
export const messageCreate = new EventHandler("messageCreate")
	.setOnce(false)
	.setExecution(async message => {
		// Ignore certain messages
		if (isFromSelf(message)) {
			return;
		}
		if (isEmpty(message)) {
			return;
		}
		if (!doesMentionSelf(message)) {
			return;
		}

		try {
			// Format the prompt
			const prompt = formatPrompt(message);

			// Generate response
			const response = await delphi(prompt);

			logExchange(message.channel, prompt, response);

			// Pause to pretend to "type" the message
			const timeTypeSec = response.length / typingSpeed;
			await message.channel.sendTyping();
			await sleep(timeTypeSec * 1000);

			// Send the message
			await sendOrReply(message, response);
		}
		catch (err) {
			error(err);

			await replyWithError(message, err);
		}

	});

/**
 * Logs the current exchange.
 */
function logExchange (channel: TextBasedChannel, prompt: string, response: string): void {
	info("Generated response");
	debug(`\tChannel: ${
		channel.isDMBased()
			? `@${channel.recipient?.username ?? "unknown user"}`
			: `#${channel.name}`
	} (${channel.id})`);
	debug(`\t──> ${prompt}`);
	debug(`\t<── ${response}`);
}

/**
 * Sends the given response, either using the channel's `send` method or the message's `reply`
 * method, depending on whether the message is the latest message in the channel.
 *
 * @param message The message to reply to
 * @param response The response to send
 * @returns The response as a `Message` object
 */
async function sendOrReply (message: Message, response: string): Promise<Message> {
	return isLatestMessage(message)
		? message.channel.send(response)
		: message.reply(response);
}

/**
 * @returns Whether the given message is the latest message in its channel
 */
function isLatestMessage (message: Message): boolean {
	return message.channel.lastMessageId === message.id;
}
