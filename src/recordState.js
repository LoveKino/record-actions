/**
 * record state of page
 */
module.exports = () => {
    return {
        type: 'state',
        url: window.location.href,
        cookie: document.cookie
    };
};
