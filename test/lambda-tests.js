import { createChannel, postMessage } from '../lib/lambda';
import assert from 'assert';
import Chance from 'chance';
import discord from '../lib';

const { DISCORD_TEST_TOKEN: token, DISCORD_TEST_GUILD: guildId } = process.env;
const chance = new Chance();
const client = discord(token);

describe('lambda functions', () => {

    let channelId;

    describe('createChannel', () => {

        it('should validate input', () => {
            createChannel({}, null, (err, response) => {
                assert.equal(null, err);
                assert.equal(400, response.statusCode, response.body);
            });
        });

        it('should reply with the channel id', done => {
            createChannel({ guildId, name: `discord-http-test-${chance.word({length: 5})}`}, null, (err, response) => {
                assert.equal(null, err);
                assert.equal(201, response.statusCode, response.body);
                channelId = JSON.parse(response.body).channelId;
                assert.ok(channelId);
                done();
            });
        });

        it('should propagate api errors', done => {
            createChannel({ guildId: 'NotAGuildId', name: 'api-error-test'}, null, (err, response) => {
                assert.equal(null, err);
                assert.equal(400, response.statusCode, response.body);
                done();
            });
        });

    });

    describe('postMessage', () => {

        it('should validate input', () => {
            postMessage({}, null, (err, response) => {
                assert.equal(null, err);
                assert.equal(400, response.statusCode);
            });
        });

        it('should reply with the posted message', done => {
            const message = 'test';
            postMessage({ channelId, message }, null, (err, response) => {
                assert.equal(null, err);
                assert.equal(201, response.statusCode, response.body);
                assert.equal(message, JSON.parse(response.body).message.content, response.body);
                done();
            });
        });

        it('should propagate api errors', done => {
            postMessage({ channelId: 'NotAChannelId', message: 'api-error-test' }, null, (err, response) => {
                assert.equal(null, err);
                assert.equal(400, response.statusCode, response.body);
                done();
            });
        });

    });

    after(() => client.http.delete(`/channels/${channelId}`));

});
