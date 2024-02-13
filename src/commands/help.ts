import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, userMention } from 'discord.js';
import type { ClientUser } from 'discord.js';

import { CommandHandler } from './CommandHandler.js';
import { invite } from './invite.js';
import { embedColors, githubURL, lastUpdated, version } from '../parameters.js';

/** A command that gives the user a simple guide about the bot. */
export const help = new CommandHandler()
	.setName('help')
	.setDescription('Print a simple guide about me')
	.setExecution(async (interaction) => {
		const embed = createHelpEmbed(interaction.client.user);

		const button = createSourceCodeButton();
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(button);

		await interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true,
		});
	});

/**
 * @param user The current logged-in user
 * @returns An embed that provides a simple guide about the bot for the user
 */
function createHelpEmbed(user: ClientUser): EmbedBuilder {
	const mention = userMention(user.id);
	const avatarURL = user.avatarURL();
	return new EmbedBuilder()
		.setColor(embedColors.info)
		.setTitle('User Guide')
		.setDescription(
			`Hello! I am ${mention}, an ethics bot for Discord. I provide judgements on the morality of your messages using artifical intelligence from the [Delphi AI](https://delphi.allenai.org/).`
			+ '\n\nDelphi is an AI released in 2021 by the Allen Institute for AI, who described it as *"a computational model for descriptive ethics, i.e., people\'s moral judgments on a variety of everyday situations."*',
		)
		.setFields(
			{ name: 'Mentioning', value: `I will judge the morality of any message you begin with ${mention}.` },
			{ name: 'Disclaimer', value: 'The Allen Institute for AI has issued the follower disclaimer:\n\n*"Delphi is an experimental AI system intended to study the promises and limitations of computational ethics and norms. Model outputs should not be used for advice for humans, and could be potentially offensive/problematic/harmful. The model\'s output does not necessarily reflect the views and opinions of the authors and their associated affiliations."*' },
			{ name: 'Adding to Other Servers', value: `Use the ${invite.getMention()} command to invite me to another server.` },
		)
		.setFooter({
			text: `Version ${version}\nLast Updated`,
			iconURL: avatarURL ?? undefined,
		})
		.setTimestamp(lastUpdated);
}

/**
 * @returns A button that links to the source code of the bot
 */
function createSourceCodeButton(): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel('Source Code')
		.setURL(githubURL.toString())
		.setStyle(ButtonStyle.Link);
}
