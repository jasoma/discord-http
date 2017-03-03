import Discord from 'discord.js';

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

/**
 * Bots cannot make use of some parts of the API until they have logged on to the
 * API gateway at least once. If the bot being used for the tests is brand new the
 * post messages test will fail since this method requires a gateway login.
 *
 * The gateway API is much more complex so an existing implementation is used.
 *
 * @see {@link https://discordapp.com/developers/docs/topics/gateway | Gateway Reference}
 */

console.log('ensuring the bot has logged into the gateway at least once');

const client = new Discord.Client();
client.login(token)
    .then(() => client.destroy())
    .catch(err => {
        console.log(err);
        process.exit(-1);
    });
