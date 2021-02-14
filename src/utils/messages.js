const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    };
};

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

const formatName = (name) => {
    const nameParts = name.split(' ');
    for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].substring(1);
    };
    return nameParts.join(' ');
}

module.exports = {
    generateMessage,
    generateLocationMessage,
    formatName
}