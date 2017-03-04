import { isUndefined, toPairs } from 'lodash';
import discord from '.';

const client = discord(process.env.DISCORD_TOKEN);

/**
 * Formats a response for the lambda callback.
 *
 * @param {number} status - the status code of the response.
 * @param {object} body - the response body.
 */
function response(status, body) {
    return {
        statusCode: status,
        body: JSON.stringify(body)
    };
}

/**
 * Validates input parameters by checking for any keys with undefined values.
 * If the input fails validation the lambda callback will be invoked with a
 * 400 error.
 *
 * @param {object} input - an object containing the input values to validate.
 * @param {function} callback - the lambda callback.
 * @returns {boolean} - true if the object was valid, false if an undefined value
 *                      was detected and an error sent.
 */
function validate(input, callback) {
    const missing = toPairs(input).reduce((acc, elem) => {
        const [key, value] = elem;
        if (isUndefined(value)) {
            acc.push(key)
        }
        return acc;
    }, []);

    if (missing.length > 0) {
        const resp = response(400, { message: `Missing required parameter(s) [${missing.join(', ')}]`});
        callback(null, resp);
        return false;
    }

    return true;
}

/**
 * Creates a discord channel in a guild from the lambda event data. Returns the
 * channel id in the response body.
 *
 * @param {object} event - the lambda event.
 * @param {string} event.guildId - the id of the guild to create the channel in.
 * @param {string} event.name - the name to give the new channel.
 * @returns {string} - the channel id.
 */
export function createChannel(event, context, callback) {
    const { guildId, name } = event;

    if (!validate({ guildId, name })) {
        return;
    }

    client.createChannel(guildId, name)
        .then(channelId => {
            const resp = response(201, { channelId });
            callback(null, resp);
        })
        .catch(err => {
            const { statusCode = 500, message = err } = err;
            const resp = response(statusCode, { message });
            callback(null, resp);
        });
}

/**
 * Posts a message to a discord channel from the lambda event data. Returns the
 * full posted message object in the response body.
 *
 * @param {object} event - the lambda event.
 * @param {string} event.channelId - the id of the channel to create the message in.
 * @param {string} event.message - the message content to post to the channel.
 * @returns {object} - the created message.
 */
export function postMessage(event, context, callback) {
    const { channelId, message } = event;

    if (!validate({ channelId, message })) {
        return;
    }

    client.postMessage(channelId, message)
        .then(message => {
            const resp = response(201, { message });
            callback(null, resp);
        })
        .catch(err => {
            const { statusCode = 500, message = err } = err;
            const resp = response(statusCode, { message });
            callback(null, resp);
        });
}
