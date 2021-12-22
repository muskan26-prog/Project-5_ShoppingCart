let userModel = require('../models/userModel');
let validate = require('./validator');

//register user - localhost:3000/register ----------->

let registerUser = async function (req, res) {

    try {
        let reqBody = req.body

        if (!validate.isValidrequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "no user Details found" })
        }

        let { fname, lname, email, profileImage, phone, password, address } = reqBody

        if (!validate.isValid(fname)) {
            res.status(400).send({ status: false, message: "username field is not be empty" })
        }

        if (!validate.isValid(lname)) {
            res.status(400).send({ status: false, message: "last name field is not be empty" })
        }

        if (!validate.isValid(email)) {
            res.status(400).send({ status: false, message: "email field is not be empty" })
        }

        if (!validate.isValidEmail(email)) {
            res.status(400).send({ status: false, message: `${email} is not a valid email` })
        }

        let findEmail = await userModel.findOne({ email })

        if (findEmail) {
            res.status(400).send({ status: false, message: `${email} is already registered please login` })
        }

        if (!validate.isValid(profileImage)) {
            res.status(400).send({ status: false, message: "profileImage is mendatory" })
        }

        if (!validate.isValid(phone)) {
            res.status(400).send({ status: false, message: "phone field is not be empty" })
        }

        if (!validate.isValidPhone(phone)) {
            res.status(400).send({ status: false, message: `${phone} is not a valid phone` })
        }

        let findPhone = await userModel.findOne({ phone })

        if (findPhone) {
            res.status(400).send({ status: false, message: `${phone} is already registered please login` })
        }

        if (!validate.isValid(password)) {
            res.status(400).send({ status: false, message: "password is mendatory" })
        }

        if (!(password.length >= 8 && password.length <= 15)) {
            res.status(400).send({ status: false, message: "password length must be 8 to 15" })
        }

        if (!validate.isValid(address)) {
            res.status(400).send({ status: false, message: "address field is required" })
        }

        let saveData = { fname, lname, email, profileImage, phone, password, address }
        let createUser = await userModel.create(saveData);
        res.status(200).send({ status: false, message: "user successfully registerd", data: createUser })

    } catch(error) {
        res.status(500).send({ status: false, message: error.message })
    }
};

module.exports = { registerUser };