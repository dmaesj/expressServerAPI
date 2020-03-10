const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Define model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// On Save Hook, encrypt password
userSchema.pre('save', function(next) {
    // set user to this user model
    const user = this;

    // generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        // hash (encrypt) password using salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) { return next(err) ; }

            // overewrite plaintext password with encrypted password
            user.password = hash;
            // go ahead and save model
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err);}

        callback(null, isMatch);
    });
};

// Create the model class
const model = mongoose.model('user', userSchema);

// Export the model
module.exports = model;
