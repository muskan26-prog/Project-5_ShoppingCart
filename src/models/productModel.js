let mongoose = require('mongoose')

let productSchema = new mongoose.Schema( {

        title: {
            type: String, 
            required: "product title is mandatory", 
            unique: "product title must be unique",
            lowercase: true
        },

        description: {
            type: String, 
            required: "discribe your product!"
        },

        price: {
            type: Number, 
            required: "please provide product price" 
            },

        currencyId: {
            type: String, 
            required: "provide your currency Id"
        },

        currencyFormat: {
            type: String, 
            required: "currency formate is mandatory" 
            },

        isFreeShipping: {
            type: Boolean, 
            default: false
        },

        productImage: {
            type: String, 
            required: "please provide product image"
        },  // s3 link
        style: {
            type: String
        },

        availableSizes: {
            
            type: [String], 
            enum: ["S", "XS","M","X", "L","XXL", "XL"]
        },

        installments: { Number },

        deletedAt: {
            type: Date,
            default: null
        }, 

        isDeleted: {
            type: Boolean, 
            default: false
        },
}, {timestamps: true});

module.exports = mongoose.model( 'Product', productSchema )