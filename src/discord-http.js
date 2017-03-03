import rp from 'request-promise';

/**
 * Host for all discord api actions.
 */
const host = 'https://discordapp.com/api';

/**
 * Creates a basic discord client.
 *
 * @param {string} auth - the authorization header for all requests.
 */
function discordApi(auth) {

    /**
     * Makes an api call. Always uses json for request/response content.
     *
     * @param {string} method - the http method to use.
     * @param {string} path - the path to the endpoint to call.
     * @param {object} params - parameters for the call.
     * @param {object} params.body - parameters to place in the request body.
     * @param {object} params.qs - parameters to place in the request query string.
     * @returns {Promise} - a promise for the request results.
     */
    function call(method, path, { body, qs }) {
        return rp({
            uri: `${host}${path}`,
            method,
            headers: {
                'Authorization': auth,
                'User-Agent': "DiscordBot ('discord-http', '1.0.0')"
            },
            qs,
            body,
            json: true
        });
    }

    return {

        /**
         * Executes a GET request against a discord endpoint.
         *
         * @param {string} path - the path to the endpoint to call.
         * @param {object} params - parameters for the request, will be placed in the query string.
         * @returns {Promise} - a promise for the request results.
         */
        get(path, params) {
            return call('GET', path, { qs: params });
        },

        /**
         * Executes a POST request against a discord endpoint.
         *
         * @param {string} path - the path to the endpoint to call.
         * @param {object} params - parameters for the request, will be placed in the request body.
         * @returns {Promise} - a promise for the request results.
         */
        post(path, params) {
            return call('POST', path, { body: params });
        },

        /**
         * Executes a DELETE request against a discord endpoint.
         *
         * @param {string} path - the path to the endpoint to call.
         * @returns {Promise} - a promise for the request results.
         */
        delete(path) {
            return call('DELETE', path, {})
        }
    }
}

/**
 * Creates a client exposing functions to create a new channel or post a message to an existing channel.
 *
 * @param {string} token - the bot token to make requests as.
 * @see {@link https://discordapp.com/developers/applications/me | Discord Applications}
 */
function client(token) {

    const api = discordApi(`Bot ${token}`);

    return {

        /**
         * Basic http client for making requests against the discord api as your bot.
         */
        http: api,

        /**
         * Creates a new channel in a guild.
         *
         * @param {string} guildId - the id of the guild to create the channel in.
         * @param {string} name - the name of the channel to create.
         * @returns {Promise<string>} - a promise for the id of the created channel.
         * @see {@link https://discordapp.com/developers/docs/resources/guild#create-guild-channel | Discord API Reference}
         */
        createChannel(guildId, name) {
            return api.post(`/guilds/${guildId}/channels`, { name, type: 'text' })
                .then(channel => channel.id);
        },

        /**
         * Posts a new message to a channel
         *
         * @param {string} channelId - the id of the channel to send the message to.
         * @param {string} message - the message text.
         * @returns {Promise<object>} - a promise for the discord message object that was created.
         * @see {@link https://discordapp.com/developers/docs/resources/channel#create-message | Discord API Reference}
         */
        postMessage(channelId, message) {
            return api.post(`/channels/${channelId}/messages`, { content: message });
        }

    }

}

export default client;
