# discord-http

A simple http-only interface to some of the discord api

## Usage

```js
import discord from 'discord-http';

const botToken = 'YourApplicationsBotToken';
const guildId = 'AGuildYourBotHasAccessTo';

// create the client
const client = discord('YouBotToken');

// make a channel
const channelId = await client.createChannel(guildId, 'Match-31');

// post a message
const message = await client.postMessage(channelId, `Match-31 channel initialized`);
```

Methods:

- [createChannel](https://jasoma.github.io/discord-http/global.html#createChannel)
- [postMessage](https://jasoma.github.io/discord-http/global.html#postMessage)

## Why not an existing library?

Full featured discord libraries already exist for node:

- [discord.js](https://github.com/hydrabolt/discord.js)
- [discord.io](https://github.com/izy521/discord.io)
- [discordie](https://github.com/qeled/discordie)
- [eris](https://github.com/abalabahaha/eris)

All of these libraries are build around creating an interactive bot and as such use discord's [
Gateway API](https://discordapp.com/developers/docs/topics/gateway). Because of this there is a
~1s overhead to connect the client websocket to the gateway and perform setup before they can be
used.

Because we don't need the added features of the Gateway (message notifications) we can avoid this
overhead by simply using the HTTP api directly. While 1s at start up is not generally a burden in
cases where a new lambda container needs to be spun up in response to a message or a traffic increase
this extra startup will cause a noticible delay in the UX on occasion.
