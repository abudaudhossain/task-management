const { nameValidation, emailValidation, getToken } = require("../helpers/utility");


//models 
const User = require("../models/user");
const AuthSession = require("../models/authSession");

const welcome =  (req, res) =>{
    res.send("Hello world")
};

//create new Session
const createSession = async (user, deviceToken) => {

    const token = getToken("AS");
    const userToken = user.token;
    const status = "active";
    const newSession = new AuthSession({
        token,
        userToken,
        deviceToken,
        status
    })

    // console.log(newUser)
    await newSession.save((err) => {
        if (err) {
            return {
                type: 'error',
                msg: 'some thing is wrong save to db'
            }
        }
    });

    return {
        type: 'success',
        msg: 'User has been valid',
        data: {
            sessionToken: token,
            userToken,
            name: user.name,
            email: user.email

        }
    }
}

// add new user 
const addUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const deviceToken = req.headers.devicetoken;
        let proceed = true;


        // @validation part
        // => validation 1: required are not empty

        if (name === undefined || email === undefined || password === undefined) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Fields Should Not Be Empty"
            })
        }
        else if (name.length === 0 || email.length === 0 || password.length === 0) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Fields Should Not Be Empty1"
            })
        }

        // => validation 2: required valid name
        if (nameValidation(name)) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Should  Be valid name"
            })
        }
        // => validation 3: required valid email
        if (!emailValidation(email)) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Required Should Be valid email"
            })
        }

        // => validation 4: check user in our database
        const exitUsers = await User.find({ email: email });

        if (exitUsers.length > 0) {
            proceed = false;
            res.send({
                type: "error",
                msg: "User Already Registered"
            })
        }

        // => validation 5: check password validation
        if (password.length < 8) {
            proceed = false;
            res.send({
                type: "error",
                msg: "Password Should Have be more then 8 charters"
            })
        }

        // @business logic
        if (proceed) {
            const token = getToken("UI")
            const newUser = new User({
                token,
                name,
                email,
                password
            })
            const user = {
                token,
                name,
                email
            };
            await newUser.save(async (err) => {
                if (err) {
                    res.send({
                        type: 'error',
                        msg: 'some thing is wrong'
                    })
                } else {
                    sessionInfo = await createSession(user, deviceToken);
                    res.send(sessionInfo)
                }
            });
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {welcome, addUser}