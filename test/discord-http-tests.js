import assert from 'assert';
import Chance from 'chance';
import discord from '../lib';

const { DISCORD_TEST_TOKEN: token, DISCORD_TEST_GUILD: guildId } = process.env;
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

    it('should propagate api errors', done => {
        client.createChannel('NotAGuildId', 'test')
            .then(() => done(new Error('create channel succeeded for a bad guild id')))
            .catch(err => {
                /* eslint-disable camelcase */
                const { statusCode, error: { guild_id } } = err;
                /* eslint-enable camelcase */
                assert.equal(400, statusCode);
                assert.ok(guild_id, 'api error data was not available');
                done();
            });
    });

    after(() => client.http.delete(`/channels/${channelId}`));

});
