const { isEmpty, passwordValidation, nameValidation, emailValidation, getToken } = require("../helpers/utility");
const AuthSession = require("../models/authSession");

const User = require('../models/user');
/* ===========================
creat a new user session
===============================*/
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
/* ===========================
    check valid user
===============================*/
const isValidUser = async (deviceToken, sessionToken) => {

    try {
        const session = await AuthSession.find({ token: sessionToken });
        console.log(session)

        if (session.length === 0) {
            return false;
        }

        if (session[0].deviceToken === deviceToken) {
            return true;
        } else {
            return false;
        }

    } catch (error) {

    }
}

const isLogin = async (req, res) => {
    try {
        let deviceToken = req.cookies.deviceToken;
        let sessionToken = req.cookies.sessionToken;
        console.log(deviceToken, sessionToken)
        if (deviceToken === undefined) {
            res.cookie("deviceToken", getToken("deviceToken"));
            res.redirect('/login')
        }


        if (sessionToken === undefined || deviceToken === undefined) {
            return false;
        }
        const user = await isValidUser(deviceToken, sessionToken);
        console.log(user)
        return user;

    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    // homp page 
    HomePage: async (req, res) => {
        try {
            console.log("h")
            Promise.resolve(isLogin(req, res)).then(function (value) {
                console.log("valu", value);
                if (value) {
                    console.log("valu", value);
                    res.render('index', {})
                } else {
                    res.redirect('/login')
                }
            });


        } catch (error) {

        }
    },

    Register: (req, res) => {
        try {
            Promise.resolve(isLogin(req, res)).then(function (value) {
                if (value) {
                    res.redirect('/')
                } else {
                    res.render('reg', {})
                }
            });
            if (isLogin(req, res)) {

            } else {
                r
            }

        } catch (error) {

        }
    },
    // login page  integrated
    LoginPage: (req, res) => {
        try {
            Promise.resolve(isLogin(req, res)).then(function (value) {
                if (value) {
                    res.redirect('/')
                } else {
                    res.render('login', {})
                }

            });


        } catch (error) {

        }
    },
    //add new user
    addUser: async (req, res) => {
        try {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            let deviceToken = req.cookies.deviceToken;
            console.log(deviceToken)

            // const deviceToken = req.headers.devicetoken;
            if (req.cookies.deviceToken === undefined) {
                res.cookie("deviceToken", getToken('deviceToken'))
            }


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
                            res.cookie("sessionToken", sessionToken);
                            res.redirect('/home')
                            // res.send({
                            //     type: "success",
                            //     msg: "ok",
                            //     data: {
                            //         sessionToken,
                            //         userToken: user.token,
                            //         name: user.name,
                            //         email: user.email
                            //     }
                            // })
                        }
                    });

                }

            }
        } catch (error) {
            console.log(error)
        }
    },

    loginUser: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            let deviceToken = req.cookies.deviceToken;
            console.log(deviceToken)
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
                        res.cookie("sessionToken", sessionToken);
                        res.redirect('/home')

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

}