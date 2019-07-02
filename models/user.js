const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('Please enter a valid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}); 


userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, '77FC73B356EA48E9AEA74C643E574F24');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });

    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bycrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
};

//hash plain text pass before save
userSchema.pre('save', async function (next) {
    const user = this;
    //hass password
    console.log(user);
    if(user.isModified('password')){
        user.password = await bycrypt.hash(user.password, 8);
    }
    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;