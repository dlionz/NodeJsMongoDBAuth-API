const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../services/auth");


// Create User takes { "userName": "", "email": "","password": "" }
router.post("/register", async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error });
    }
});

// Delete User

// Login User { "email": "","password": "" }
router.post('/user/login', async (req, res) => {
    
    try {
        console.log(req.body.email, req.body.password);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
        console.log('loggedin');
    } catch (err) {
        console.log('error');
        res.status(400).send({error: err});
    }
});

// Logout User Autharization header, Bearer jwt token string
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();

        res.send()
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
