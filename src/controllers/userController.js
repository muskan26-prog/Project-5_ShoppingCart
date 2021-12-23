let userModel = require('../models/userModel');
let validate = require('./validator');
let bcryptjs = require('bcryptjs')
let jwt = require('jsonwebtoken')
let awsCon = require('./awsController')

//!register user - localhost:3000/register ----------->
let registerUser = async function (req, res) {

    try {
        let reqBody = req.body;
        let files = req.files

        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "no user Details found" })
            return
        }

        let { fname, lname, email, profileImage, phone, password, address } = reqBody

        if (!validate.isValid(fname)) {
            res.status(400).send({ status: false, message: "username field is not be empty" })
            return
        }

        if (!validate.isValid(lname)) {
            res.status(400).send({ status: false, message: "last name field is not be empty" })
            return
        }

        if (!validate.isValid(email)) {
            res.status(400).send({ status: false, message: "email field is not be empty" })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `${email} is not a valid email` })
            return
        }

        let findEmail = await userModel.findOne({ email })

        if (findEmail) {
            res.status(400).send({ status: false, message: `${email} is already registered please login` })
            return
        }

        // if (!validate.isValid(profileImage)) {
        //     res.status(400).send({ status: false, message: "profileImage is mendatory" })
        //     return
        // }

        if (!validate.isValid(phone)) {
            res.status(400).send({ status: false, message: "phone field is not be empty" })
            return
        }

        if (!validate.isValidPhone(phone)) {
            res.status(400).send({ status: false, message: `${phone} is not a valid phone` })
            return
        }

        let findPhone = await userModel.findOne({ phone })

        if (findPhone) {
            res.status(400).send({ status: false, message: `${phone} is already registered please login` })
            return
        }

        if (!validate.isValid(password)) {
            res.status(400).send({ status: false, message: "password is mendatory" })
            return
        }

        if (!(password.length >= 8) && (password.length <= 15)) {
            res.status(400).send({ status: false, message: "password length must be 8 to 15" })
            return
        }

        //todo address.shipping.street || address.shipping.city || address.shipping.pincode || address.billing.street || address.billing.street || address.billing.pincode

        if (!validate.isValid(address)) {
            res.status(400).send({ status: false, message: "address field is required" })
            return
        }

        if (!validate.isValid(address.shipping)) {
            res.status(400).send({ status: false, msg: "Invalid request parameters. Please Provide valid shipping address!!" })
            return
        }
        if (!validate.isValid(address.shipping.street)) {
            res.status(400).send({ status: false, msg: "Invalid request parameters. Please Provide valid street in shipping address!!" })
            return
        }
        if (!validate.isValid(address.shipping.city)) {
            res.status(400).send({ status: false, msg: "Invalid request parameters. Please Provide valid city in shipping address!!" })
            return
        }
        // if(!validate.isValid(address.shipping.pincode)){
        //     res.status(400).send({status: false, msg: "Invalid request parameters. Please Provide valid pincode in shipping address!!"})
        //     return
        // }
        if (!validate.isValid(address.billing)) {
            res.status(400).send({ status: false, msg: "Invalid request parameters. Please Provide valid billing address!!" })
            return
        }
        if (!validate.isValid(address.billing.street)) {
            res.status(400).send({ status: false, msg: "Invalid request parameters. Please Provide valid street in billing address!!" })
            return
        }
        if (!validate.isValid(address.billing.city)) {
            res.status(400).send({ status: false, msg: "Invalid request parameters. Please Provide valid city in billing address!!" })
            return
        }
        // if(!validate.isValid(address.billing.pincode)){
        //     res.status(400).send({status: false, msg: "Invalid request parameters. Please Provide valid pincode in billing address!!"})
        // }

        if (files && files.length > 0) {
            //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
            let uploadedFileURL = await awsCon.uploadFile(files[0]); // expect this function to take file as input and give url of uploaded file as output
            // reqBody.profileImage = uploadedFileURL;
            //pasword encryption-------->
            let encryptPass = await bcryptjs.hash(password, 10)
            let saveData = {
                fname,
                lname,
                email,
                profileImage: uploadedFileURL,
                phone,
                password: password ? encryptPass : "password is required",
                address
            };
            let createUser = await userModel.create(saveData);
            res.status(201).send({ status: false, message: "user successfully registerd", data: createUser })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
};

//!get user details // localhost:3000/user/:userId/profile------------>
const getUser = async function (req, res) {
    try {
        let userId = req.params.userId

        if (!validate.isValidObjectId(userId)) {
            res.status(404).send({ status: false, message: `${userId} is not valid user id ` })
            return
        }
        let getUser = await userModel.findOne({ _id: userId })
        if (!getUser) {
            return res
                .status(404)
                .send({ status: false, msg: "Provide valid UserId" });
        }
        res.status(200).send({ status: true, message: "User profile details", data: getUser })
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: err.message });
    }
}

//!update user details  localhost:3000/user/:userId/profile----------->
const updateUserDetailes = async function (req, res) {

    try {
        const reqParams = req.params.userId
        const requestUpdateBody = req.body
        let files = req.file

        if (!validate.isValidObjectId(reqParams)) {
            return res.status(404).send({ status: false, message: "Invalid userId." })
        }

        if (!validate.isValidRequestBody(requestUpdateBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details to update.' })
        }

        const { fname, lname, email, profileImage, phone, password, address } = requestUpdateBody;

        if (fname || lname || email || profileImage || phone || password || address) {

            if (!validate.isValid(fname)) {
                return res.status(400).send({ status: false, message: "fname is required or check its key & value" })
            }

            if (!validate.isValid(lname)) {
                return res.status(400).send({ status: false, message: "lname is required or check its key & value." })
            };

            if (!validate.isValid(email)) {
                return res.status(400).send({ status: false, message: "email is required or check its key & value" })
            };

            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
                res.status(400).send({ status: false, message: `${email} is not a valid email` })
                return
            }

            // if (!validate.isValid(profileImage)) {
            //     return res.status(400).send({ status: false, message: "profileImage is required or check its key & value." })
            // };

            if (!validate.isValid(phone)) {
                return res.status(400).send({ status: false, message: "phone is required or check its key & value." })
            };

            if (!validate.isValid(password)) {
                return res.status(400).send({ status: false, message: "password is required or check its key & value." })
            };

            if (!validate.isValid(address)) {
                return res.status(400).send({ status: false, message: "address is required or check its key & value." })
            };
        }

        const searchUser = await userModel.findById({ _id: reqParams })
        if (!searchUser) {
            return res.status(404).send({ status: false, message: `user does not exist by this ${reqParams}.` })
        }
        //..........................
        // if (searchUser.userId != req.userId) {
        //     return res.status(401).send({status: false, message: "Unauthorized access."})
        // }
        //....................
        const findEmail = await userModel.findOne({ email })
        if (findEmail) {
            return res.status(403).send({ status: false, message: `nothing to update ${email} is already in use.` })
        }

        const findPhone = await userModel.findOne({ phone })
        if (findPhone) {
            return res.status(403).send({ status: false, message: `nothing to update ${phone} is already in use.` })
        }

        if (files && files.length > 0) {
            let uploadedFileURL = await awsCon.uploadFile(files[0]);

            let encryptPass = await bcryptjs.hash(password, 10)
            const updateDetails = await userModel.findOneAndUpdate({ _id: reqParams }, {
                fname: fname,
                lname: lname,
                email: email,
                profileImage: uploadedFileURL,
                phone: phone,
                password: password ? encryptPass : "pasword must be updated",
                address: address
            }, { new: true })

            res.status(201).send({ status: true, message: "Successfully updated User details.", data: updateDetails })

        }

    } catch (err) {
        return res.status(500).send({ status: false, message: "Something went wrong", Error: err.message })
    }
}

//!login user localhost:3000/user/:userId/profile-------->

const login = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validate.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        // Extract params
        const { email, password } = requestBody;
        // Validation starts
        if (!validate.isValid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` })
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `${email} is not a valid email` })
            return
        }

        if (!validate.isValid(password)) {
            return res.status(400).send({ status: false, message: `Password is required` })
        }
        // Validation ends
        const user = await userModel.findOne({ email: email });
        // const userId = user._id

        if (!user) {
            return res.status(401).send({ status: false, message: `Invalid login credentials` });
        }

        let decPass = await bcryptjs.compare(password, user.password)
        if (decPass) {
            const token = jwt.sign({ userId: user._id }, 'radium', {
                expiresIn: "2h"
            })
            return res.status(200).send({ status: true, message: `User login successfull`, data: { userId: user._id, token } });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { registerUser, getUser, updateUserDetailes, login };



