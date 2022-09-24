# Discord-Delphi

## About

Discord-Delphi is a [Discord](https://discord.com/) bot developed in JavaScript that uses the [Delphi AI](https://delphi.allenai.org/) to provide moral and ethical judgements. Through the bot, users can have their messages judged for morality. The bot also hosts other features that help integrate it with the Discord chat environment.
 
This project was started and finished in October 2021 using the codebase of the [Discord-Cleverbot](https://github.com/JstnMcBrd/Discord-Cleverbot) project.

## Licensing

Without a specific license, this code is the direct intellectual property of the original developer. It may not be used, modified, or shared without explicit permission.
Please see GitHub's [guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) on licensing.

## Getting started

### Creating a bot

1. Create a new bot account in the [Discord developer portal](https://discord.com/developers/applications/)
2. Copy the access token and application ID of your bot for later

### Setting up the code

3. Run `git pull https://github.com/JstnMcBrd/Discord-Cleverbot.git` to download the repo
4. Go into the `/accounts` directory, duplicate the `ExampleUsername` folder, and rename it as the username of your bot
5. Inside the new folder, edit `auth.json` and replace `example-user-id` and `[example-user-id]` with the application ID, and `example-token` with the access token

### Running the code

6. In the top directory, run `npm install` to download all necessary packages
7. Run `node deploy-commands.js [bot username]` to register slash commands with Discord
8. Run `node bot.js [bot username]` to start the bot

### Interacting with the bot

9. Use the URL in `/accounts/[bot username]/auth.json` to add your bot to a server
10. @ mention your bot in a message and see the bot respond!