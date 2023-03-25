const User = require('../model/userModel');

const getFname = async (id) => {
    if(id) {
        const logUser = await User.findOne({_id: id});
        return logUser.fname;
    }
}

const getUsername = async (id) => {
    if(id) {
        const logUser = await User.findOne({_id: id});
        return logUser.username;
    }
}

const getPic = async (id) => {
    if(id) {
        const logUser = await User.findOne({_id: id});
        const pic = logUser.pic || "../../src/assets/img/user-icon.png";
        return pic;
    }
}

module.exports = {
    getUsername,
    getPic,
    getFname
};