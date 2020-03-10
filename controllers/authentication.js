const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // Only need to give them a token
    res.send( { token: tokenForUser(req.user) });
}

exports.signup = function(req, res , next) {
    // See if a user with the given email exists
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password ) {
        return res.status(422).send({ error: 'You must provide email and password'});
    }

    // If a user with email does exist, return an error
    User.findOne( { email: email }, function (err, existingUser) {
        if (err) { return next(err); }

    if (existingUser) {
        return res.status(422).send({ error: 'Email is in use' });
    }

    // if a user with email does NOT exist, create a user  
    const user = new User({
        email: email,
        password: password
    });

    user.save(function(err) {
        if (err) { return next(err); }
    // Respond to request indicating user was creating
        res.json({ token: tokenForUser(user)});
    });
});
    
}