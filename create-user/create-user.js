const User = require('../persist-user/persist-user.js')


function createUser({
    username, password, awsAccount
}) {
    User.create({username: username, password: password, aws_account: awsAccount})
}

module.exports = createUser;
