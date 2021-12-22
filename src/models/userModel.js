let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: "first name is mandatory"
    },
    lname: {
        type: String,
        required: " last name is mandatory"
    },

    email: {
        type: String,
        required: " email is mandatory",
        unique: "email must be unique"
    },

    profileImage: {
        type: String,
        required: "profile image in mandatory"
    }, // s3 link

    phone: {
        type: String,
        required: "phone number is mandatory",
        unique: "number must be unique"
    },

    password: {
        type: String,
        required: "please enter password",
        minLen: 8,
        maxLen: 15
    }, // encrypted password

    address: {
        shipping: {
            street: {
                type: String,
                required: "enter your address"
            },
            city: {
                type: String,
                require: "enter your city"
            },
            pincode: {
                type: Number,
                required: "enter pinCode its mandatory"
            }
        },

        billing: {
            street: {
                type: String,
                required: "billing address is mandatory"
            },
            city: {
                type: String,
                require: "enter your city"
            },
            pincode: {
                type: Number,
                required: "enter pinCode its mandatory"
            }
        }
    }
}, {timestamps: true} );

module.exports = mongoose.model('USERS', userSchema);