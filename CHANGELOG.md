# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Use [shields.io](https://shields.io/) for badges in README ([#32](https://github.com/JstnMcBrd/discord-delphi/pull/32))
- Use `setInterval` instead of `setTimeout` for scheduled tasks like user activity ([#34](https://github.com/JstnMcBrd/discord-delphi/pull/34))
- Exit with error code if commands are out-of-sync ([#36](https://github.com/JstnMcBrd/discord-delphi/pull/36))
- Set user activity on Client initialization to fix user activity disappearing ([#36](https://github.com/JstnMcBrd/discord-delphi/pull/36))
- Use `Object.assign` instead of `Reflect.set` ([#40](https://github.com/JstnMcBrd/discord-delphi/pull/40))
- Use native Node `.env` file support instead of `dotenv` ([#42](https://github.com/JstnMcBrd/discord-delphi/pull/42))
- Add Node version requirement of `>=20.6.0` ([#42](https://github.com/JstnMcBrd/discord-delphi/pull/42))
- Change error subtypes to better fit their intended meaning ([#42](https://github.com/JstnMcBrd/discord-delphi/pull/42))
- Support `PartialGroupDMChannel` ([#55](https://github.com/JstnMcBrd/discord-delphi/pull/55))
- Update runtime to Node 24 ([#58](https://github.com/JstnMcBrd/discord-delphi/pull/58), [#121](https://github.com/JstnMcBrd/discord-delphi/pull/121))
- Use `clientReady` event instead of `ready` ([#107](https://github.com/JstnMcBrd/discord-delphi/pull/107))
- Use for-of loops instead of forEach method ([#131](https://github.com/JstnMcBrd/discord-delphi/pull/131))

### Added

- Add contributing agreement to README ([#35](https://github.com/JstnMcBrd/discord-delphi/pull/35))
- Explain how project is permanently broken in README ([#54](https://github.com/JstnMcBrd/discord-delphi/pull/54))
- Add a `CHANGELOG.md` file ([#130](https://github.com/JstnMcBrd/discord-delphi/pull/130))

### Removed

- Remove user activity manager that set user activity on a regular schedule ([#36](https://github.com/JstnMcBrd/discord-delphi/pull/36))

### Fixed

- Fix `undici` vulnerabilities ([#38](https://github.com/JstnMcBrd/discord-delphi/pull/38))
- Fix `ws` vulnerability ([#41](https://github.com/JstnMcBrd/discord-delphi/pull/41))

## [2.1.0] - 2024-02-13

### Changed

- Update runtime to Node 20 ([#23](https://github.com/JstnMcBrd/discord-delphi/pull/23))
- Reformat code with new `eslint` config ([#24](https://github.com/JstnMcBrd/discord-delphi/pull/24), [#25](https://github.com/JstnMcBrd/discord-delphi/pull/25), [#27](https://github.com/JstnMcBrd/discord-delphi/pull/27))

### Added

- Add more fields to `package.json` ([#26](https://github.com/JstnMcBrd/discord-delphi/pull/26), [#30](https://github.com/JstnMcBrd/discord-delphi/pull/30))
- Add button with link to source code in `/help` embed ([#29](https://github.com/JstnMcBrd/discord-delphi/pull/29))
- Add button to report bug to error embed ([#30](https://github.com/JstnMcBrd/discord-delphi/pull/30))

### Removed

- Remove redundant `replaceCustomEmojis` method - this functionality was added to `discord.js` in [`v14.14.0`](https://github.com/discordjs/discord.js/releases/tag/14.14.0) ([#28](https://github.com/JstnMcBrd/discord-delphi/pull/20))

### Fixed

- Fix `undici` vulnerability ([#20](https://github.com/JstnMcBrd/discord-delphi/pull/20))

## [2.0.1] - 2023-10-07

### Changed

- Abstract out Delphi API call into new `delphi-ai` dependency ([#14](https://github.com/JstnMcBrd/discord-delphi/pull/14))
- Improve grammar and wording in README ([#12](https://github.com/JstnMcBrd/discord-delphi/pull/12), [#17](https://github.com/JstnMcBrd/discord-delphi/pull/17))

### Added

- Add Delphi API status badge in README ([#17](https://github.com/JstnMcBrd/discord-delphi/pull/17))

### Fixed

- Fix README saying "git pull" instead of "git clone" ([#12](https://github.com/JstnMcBrd/discord-delphi/pull/12))
- Fix dependency vulnerabilities ([#12](https://github.com/JstnMcBrd/discord-delphi/pull/12))

## [2.0.0] - 2023-06-23

### Changed

- Rename project from `Discord-Delphi` to `discord-delphi` ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Completely refactor and reorganize all code ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Migrate code to TypeScript ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Modernize JavaScript syntax ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Follow `discord.js` best practices ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Refactor how slash commands and event handlers are managed ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Refactor user activity management ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Increase typing speed from 6 char/sec to 8 char/sec ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Automatically check on startup if deployed commands are out-of-sync ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Use ephemeral replies for slash commands ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Make all embeds use a default color palette ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Use command mentions for all embeds that mention commands ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Use environment variables for sensitive tokens instead of `config.json` ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Refactor `package.json` to follow best practices for a NodeJS project ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Update documentation in README for complete refactor ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Improve README to be more concise ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Replace `node-fetch` dependency with native NodeJS `fetch` method ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Include the year Delphi was released in the `/help` embed ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))

### Added

- Add new `/invite` command with automatic invite link generation ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Add NPM package version number to `/help` embed ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Add "Development" section to README ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))

### Removed

- Remove reset feature for `deploy-commands` script ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Remove unnecessary `GuildTyping` and `DMTyping` GatewayIntentBits from the client ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))

### Fixed

- Fix setTimeout methods crashing ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))
- Fix emoji replacement replacing innocent underscores and colons ([#10](https://github.com/JstnMcBrd/discord-delphi/pull/10))

## [1.6.0] - 2022-09-25

### Changed

- Reformat code with `eslint` ([ab420bd](https://github.com/JstnMcBrd/discord-delphi/commit/ab420bdf83e6f008a1d8e7af4b97cc262c8c68a2))
- Refactor to better fit `discord.js` best practices ([d97a80a](https://github.com/JstnMcBrd/discord-delphi/commit/d97a80ac4e985683b87b3588dfa91e5454764329))

### Added

- Add argument validation to `deploy-commands` script ([d97a80a](https://github.com/JstnMcBrd/discord-delphi/commit/d97a80ac4e985683b87b3588dfa91e5454764329))
- Add reset feature to `deploy-commands` script ([d97a80a](https://github.com/JstnMcBrd/discord-delphi/commit/d97a80ac4e985683b87b3588dfa91e5454764329))

## [1.5.0] - 2022-09-24

### Changed

- Move slash command registration to separate script ([81a4a06](https://github.com/JstnMcBrd/discord-delphi/commit/81a4a063f1c73cd41bd2c84b358610e5947c07bf))
- Refactor to better fit `discord.js` best practices ([81a4a06](https://github.com/JstnMcBrd/discord-delphi/commit/81a4a063f1c73cd41bd2c84b358610e5947c07bf))

### Added

- Add sections on licensing and development to README ([a21b51b](https://github.com/JstnMcBrd/discord-delphi/commit/a21b51ba3886914c77ef529b636e9db54362c56d))

### Fixed

- Fix bug removing mentions from messages ([81a4a06](https://github.com/JstnMcBrd/discord-delphi/commit/81a4a063f1c73cd41bd2c84b358610e5947c07bf))

## [1.4.1] - 2022-08-19

### Fixed

- Fix `undici` vulnerability ([12f9601](https://github.com/JstnMcBrd/discord-delphi/commit/12f96016eb74f4087e42e07d3335ce36aefab919))

## [1.4.0] - 2022-08-15

### Fixed

- Fix bug setting user activity ([921dd45](https://github.com/JstnMcBrd/discord-delphi/commit/921dd45aae8e213e24987fa94f8c46d3bf70d295))

## [1.3.0] - 2022-08-03

### Changed

- Bump `discord.js` from v13 to v14 ([e7d8ea6](https://github.com/JstnMcBrd/discord-delphi/commit/e7d8ea6f530445d850c7d12d064bd6270efcf469))
- Support `discord.js` v14 ([e7d8ea6](https://github.com/JstnMcBrd/discord-delphi/commit/e7d8ea6f530445d850c7d12d064bd6270efcf469))

## [1.2.0] - 2022-07-13

### Fixed

- Replace sabotaged `colors` package with new `@colors/colors` package ([15e51aa](https://github.com/JstnMcBrd/discord-delphi/commit/15e51aa6d3195798a1481412b0a4561fc2523b7c))

## [1.1.1] - 2022-06-28

### Changed

- Bump dependency versions ([719abd4](https://github.com/JstnMcBrd/discord-delphi/commit/719abd4f30a6bcd368bc1fb70c1355d6b729ddd0), [cdf31ba](https://github.com/JstnMcBrd/discord-delphi/commit/cdf31ba2cbf08f44ef153adda54e662083eae820))

## [1.1.0] - 2021-11-05

### Changed

- Standardize user activity message from `Listening to @username` to `Listening to /help` to match [discord-cleverbot](https://github.com/JstnMcBrd/discord-cleverbot) ([c1d6f18](https://github.com/JstnMcBrd/discord-delphi/commit/c1d6f18de79121015e38d1aa0d06f6fec11d0616))

### Fixed

- Fix `HTTP 400 Bad Request` errors from empty messages ([c1d6f18](https://github.com/JstnMcBrd/discord-delphi/commit/c1d6f18de79121015e38d1aa0d06f6fec11d0616))

## [1.0.1] - 2021-10-28

### Added

- Improve fetch error handling ([ebdcd7f](https://github.com/JstnMcBrd/discord-delphi/commit/ebdcd7f06e0ac10f247aa67957559c9f448cdba6))

### Fixed

- Update delphi API URL because it was moved ([ebdcd7f](https://github.com/JstnMcBrd/discord-delphi/commit/ebdcd7f06e0ac10f247aa67957559c9f448cdba6))
- Fix weird formatting of error messages sent to Discord ([ebdcd7f](https://github.com/JstnMcBrd/discord-delphi/commit/ebdcd7f06e0ac10f247aa67957559c9f448cdba6))

## [1.0.0] - 2021-10-24

### Added

- Add initial code ([e92428f](https://github.com/JstnMcBrd/discord-delphi/commit/e92428f244d8e6da48bb4c6c959123478bba32ef))
- Add simple README ([16ae909](https://github.com/JstnMcBrd/discord-delphi/commit/16ae909d47c9342fc330b9b660e233c000de4392))

[Unreleased]: https://github.com/JstnMcBrd/discord-delphi/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/JstnMcBrd/discord-delphi/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.6.0...v2.0.0
[1.6.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/JstnMcBrd/discord-delphi/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/JstnMcBrd/discord-delphi/tree/v1.0.0
