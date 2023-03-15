/**
 * I'm not a bot because I'm irregular and slower
 * well It's what this function is supposed to do,
 * stop the time from 2640ms to 7841ms randomly
 * @returns {Promise<unknown>}
 */
function waiting() {
    const ms = Math.floor(Math.random() * (7841 - 2640)) + 2640;
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { waiting }