const nameValidation = (name) => {
    var re = /^[A-Za-z\s]+$/;
    if (re.test(name))
        return false;
    else
        return true;
}

const emailValidation = (e) => {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return (String(e).search(filter) != -1)
}

/*
numberSubToken() ---> create 5 digit random number
getRandomIndex() ---> create new index for array less then 52
stringSubToken() ---> create random string length 5
getToken()       ---> create final unique token
*/

const getToken = (content) => {

    const numberSubToken = () => {
        return Math.floor(Math.random() * 100000);
    }

    const getRandomIndex = () => {
        const index = Math.floor(Math.random() * 100);
        if (index < 52) {
            return index;
        } else {
            return getRandomIndex();
        }
    }

    const stringSubToken = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        let stToken = "";
        for (let i = 0; i < 5; i++) {
            stToken += characters[getRandomIndex()];
        }
        return stToken;
    }

    return numberSubToken() + stringSubToken() + content + stringSubToken() + numberSubToken()
}


const isEmpty= (items) =>{
    console.log(items)
    for(let i = 0; i < items.length; i++){
        if(items[i] === undefined){
            return true;
        }
        else if (items[i].length === 0){
            return true;
        }
    }

    return false;
}

const passwordValidation = (num) => {
    var re = /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;
    if (re.test(num))
        return false;
    else
        return true;
}

module.exports = {nameValidation, emailValidation, getToken, isEmpty, passwordValidation}
