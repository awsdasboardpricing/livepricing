const User = require('../persist-user/persist-user.js')


function createUser({
    username, password, account
}) {
    User.create({username: username, password: password, aws_account: account})
}

module.exports = createUser;
