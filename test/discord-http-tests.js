import assert from 'assert';
import Chance from 'chance';
import discord from '../lib/discord-http';

const { DISCORD_TEST_TOKEN: token, DISCORD_TEST_GUILD: guildId } = process.env;

if (!token) {
    console.log('discord-http-tests require a discord bot to run but no bot token was found');
    console.log('ensure a token for the bot to use in testing is present in the DISCORD_TEST_TOKEN');
    console.log('environment variable');
    process.exit(-1);
}

if (!guildId) {
    console.log('discord-http-tests require discord guild to run but no guild id was found');
    console.log('to add your discord bot to guild replace CLIENT_ID with your application id');
    console.log('and go to https://discordapp.com/api/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=85008');
    console.log('then place the guild id in the DISCORD_TEST_GUILD environment variable');
    process.exit(-1);
}

const chance = new Chance();
const client = discord(token);

describe('discord-http', () => {

    let channelId;

    it('should create channels', () => {
        const name = `discord-http-test-${chance.word({length: 5})}`
        return client.createChannel(guildId, name)
            .then(id => {
                channelId = id;
                assert.ok(channelId);
            });
    });

    it('should post messages', () => {
        const content = chance.sentence();
        return client.postMessage(channelId, content)
            .then(message => {
                assert.equal(content, message.content)
            });
    });

});
