# discord-delphi

[![API Status](https://img.shields.io/github/actions/workflow/status/JstnMcBrd/delphi-ai/api-status.yml?logo=github&label=API%20Status)](https://github.com/JstnMcBrd/delphi-ai/actions/workflows/api-status.yml)
[![CI](https://img.shields.io/github/actions/workflow/status/JstnMcBrd/discord-delphi/ci.yml?logo=github&label=CI)](https://github.com/JstnMcBrd/discord-delphi/actions/workflows/ci.yml)

> <img alt="Warning" src="https://raw.githubusercontent.com/Mqxx/GitHub-Markdown/main/blockquotes/badge/dark-theme/error.svg"> 
>
> This project is permanently broken. Please read [#53](https://github.com/JstnMcBrd/discord-delphi/issues/53).

## About

`discord-delphi` is a [Discord](https://discord.com/) bot that uses the [Delphi AI](https://delphi.allenai.org/) to provide moral and ethical judgements. Through the bot, users can have their messages judged for morality. It is developed in [TypeScript](https://www.typescriptlang.org/) and relies on the [Node](https://nodejs.org/) module of [delphi-ai](https://www.npmjs.com/package/delphi-ai).

The project was started in October 2021 using the codebase of the [discord-cleverbot](https://github.com/JstnMcBrd/discord-cleverbot) project.

## Licensing

Without a specific license, this code is the direct intellectual property of the original developer. It may not be used, copied, modified, or shared without explicit permission.
Please see [GitHub's guide on licensing](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) and [choosealicense.com](https://choosealicense.com/no-permission/).

For legal reasons, if you choose to contribute to this project, you agree to give up your copyright and hand over full rights to your contribution. However, you will still be attributed for your work on GitHub. Thank you!

## Getting started

### Creating a bot

- Create a new bot account in the [Discord Developer Portal](https://discord.com/developers/applications/).
- Copy the access token of your bot for later.

### Setting up the code

- You will need an environment with [Node](https://nodejs.org/en/download) installed (or use the Dev Container - see the [Development](#development) section below).
- Run `git clone https://github.com/JstnMcBrd/discord-delphi.git` to clone the repo.
- Create a new file called `.env` and add your access token, using [`.env.example`](./.env.example) as an example.

### Running the code

- In the top directory, run `npm install` to download all necessary packages.
- Run `npm run build` to build the project.
- Run `npm run commands` to register slash commands with Discord.
- Run `npm start` to start the bot.

### Interacting with the bot

- In the **OAuth2**>**URL Generator** tab in the Discord Developer Portal, generate an invite URL with the `applications.commands` scope.
- Use the invite URL to add the bot to a server.
- @ mention your bot in a message and see the bot respond!

## Development

[Visual Studio Code](https://code.visualstudio.com/) is the recommended IDE for development. All settings are included as artifacts in the [`.vscode`](./.vscode) folder and will automatically apply. You can use the built-in debugger and set breakpoints to troubleshoot the code.

This project abides by [Semantic Versioning](https://semver.org/) and [Keep A Changelog](https://keepachangelog.com/).
