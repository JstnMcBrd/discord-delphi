const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Prints a simple guide about me'),
		
	async execute(interaction) {
		var userMention = "<@"+interaction.client.user.id+">";
		
		var embed = {
			title: "User Guide",
			description: "I am " + userMention + ", an ethics bot for Discord. I provide judgements on the morality of your messages using artifical intelligence from the [Delphi AI](https://delphi.allenai.org/)." + 
			"\n\nDelphi is an AI designed by the Allen Institute for AI, who described it as *\"a computational model for descriptive ethics, i.e., people’s moral judgments on a variety of everyday situations.\"*",
			color: 13621503, //icy white
			fields: [
				{
					name: "Mentioning",
					value: "I will judge the morality of any message you begin with " + userMention + "."
				},
				{
					name: "Disclaimer",
					value: "The Allen Institute for AI has issued the follower disclaimer:\n\n" +
					"*\"Delphi is an experimental AI system intended to study the promises and limitations of computational ethics and norms. Model outputs should not be used for advice for humans, and could be potentially offensive/problematic/harmful. The model’s output does not necessarily reflect the views and opinions of the authors and their associated affiliations.\"*"
				},
				{
					name: "Adding To Other Servers",
					value: "For now, this feature is disabled. Please check with my developer if you would like to add me to your server."
				}
			],
			timestamp: interaction.extraInfo.lastUpdated.toISOString(),
			footer: {
				icon_url: interaction.client.user.avatarURL(),
				text: "Last Updated"
			}
		}
		
		interaction.reply({embeds: [embed]});
	},
};