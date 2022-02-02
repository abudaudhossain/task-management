
const welcome = (req, res) => {
    res.send("Welcome to my world")
}

//add new user
const addUser = (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const deviceToken = req.headers.devicetoken;

        // @validation part
        //  => validation 1: required are not empty
        // @business logic

        console.log(name, email, password, deviceToken)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { welcome, addUser }