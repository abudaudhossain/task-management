const { isEmpty, passwordValidation, nameValidation, emailValidation, getToken } = require("../helpers/utility");
const AuthSession = require("../models/authSession");

const User = require('../models/user');

const createSession = async (user, deviceToken) => {
    try {
        const userToken = user.token;
        const token = getToken('AS');

        const newUserSession = new AuthSession({
            token,
            deviceToken,
            userToken
        })

        await newUserSession.save((error, session) => {
            if (error) {
                console.log(error);
            }
        })

        return token;
    } catch (error) {
        console.log(error);
    }
}

const welcome = (req, res) => {
    res.send("Welcome to my world")
}

//add new user
const addUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const deviceToken = req.headers.devicetoken;
        let proceed = true;

        // @validation part
        //  => validation 1: required are not empty
        if (isEmpty([name, email, password, deviceToken])) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Should  Be not empty"
            })
        }
        // validation 2:  name and email validation
        if (nameValidation(name) || !emailValidation(email)) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Should  Be not valid name and email"
            })
        }

        // validation 3: required strong password
        if (passwordValidation(password)) {
            proceed = false;
            res.send({
                type: "error",
                message: "Ensure Your Password has two digits, one special case letter, two uppercase and three lowercase letter letters"
            })
        }



        // @business logic
        if (proceed) {
            const token = getToken("UI");
            const exitUser = await User.find({ email: email });
            if (exitUser.length > 0) {
                res.send({
                    type: "error",
                    message: "You already ExitUser"
                })
            } else {
                const newUser = new User({
                    token,
                    name,
                    email,
                    password
                })

                await newUser.save(async (err, user) => {
                    if (err) {
                        console.log(err)
                    } else {
                        const sessionToken = await createSession(user, deviceToken);

                        res.send({
                            type: "success",
                            msg: "ok",
                            data: {
                                sessionToken,
                                userToken: user.token,
                                name: user.name,
                                email: user.email
                            }
                        })
                    }
                });

            }

        }
    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const deviceToken = req.headers.devicetoken;
        let proceed = true;


        // @validation part
        //  => validation 1: required are not empty
        if (isEmpty([email, password, deviceToken])) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Should  Be not empty"
            })
        }
        // validation 2:  name and email validation
        if (!emailValidation(email)) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Should  Be not valid  email"
            })
        }

        // validation 3: required strong password
        if (passwordValidation(password)) {
            proceed = false;
            res.send({
                type: "error",
                message: "Ensure Your Password has two digits, one special case letter, two uppercase and three lowercase letter letters"
            })
        }
        // @business logic
        if (proceed) {
            const user = await User.find({ email: email });

            if (user.length === 0) {
                res.send({
                    type: "error",
                    message: "User not registered"
                })
            } else {
                if (user[0].password !== password) {
                    res.send({
                        type: "error",
                        message: "Please enter valid password"
                    })
                } else {
                    const sessionToken = await createSession(user[0], deviceToken);

                    res.send({
                        type: "success",
                        msg: "ok",
                        data: {
                            sessionToken,
                            userToken: user[0].token,
                            name: user[0].name,
                            email: user[0].email
                        }
                    })
                }
            }
        }


    } catch (error) {
        console.log(error);
    }
}

module.exports = { welcome, addUser, loginUser }