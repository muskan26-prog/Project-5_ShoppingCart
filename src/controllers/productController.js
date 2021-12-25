let validate = require('./validator')
let productModel = require('../models/productModel')
let userModel = require('../models/userModel')
let awsCon = require('./awsController')

let releaseProduct = async function (req, res) {

    try {
        let reqBody = req.body
        let files = req.files

        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "request body is required" })
            return
        }

        let { title, description, price, currencyId, currencyFormat, productImage, style, availableSizes } = reqBody

        // let availSiz = JSON.parse(availableSizes)
        console.log(typeof availableSizes)
        if (!validate.isValid(title)) {
            res.status(400).send({ status: false, message: "enter valid title" })
            return
        }

        if (!validate.isValid(description)) {
            res.status(400).send({ status: false, message: "enter valid description" })
            return
        }

        if (!validate.isValid(price)) {
            res.status(400).send({ status: false, message: "price is required" })
            return
        }

        if (!validate.isValid(currencyId)) {
            res.status(400).send({ status: false, message: "currencyId is required" })
            return
        }

        if (!validate.isValid(currencyFormat)) {
            res.status(400).send({ status: false, message: "currencyFormat is required" })
            return
        }

        // a

        if (!validate.isValid(availableSizes)) {
            res.status(400).send({ status: false, message: "size is required" })
            return
        }

        // if (!validate.isValidSize(availableSizes)) {
        //     res.status(400).send({ status: false, message: "size is required" })
        //     return
        // }

        let findTitle = await productModel.findOne({ title })
        if (findTitle) {
            res.status(403).send({ status: false, message: "product with this title already exist it must be unique" })
            return
        }

        if (files && files.length > 0) {
            let uploadedFileURL = await awsCon.uploadFile(files[0])

            let saveProductData = {
                title,
                description,
                price,
                currencyId,
                currencyFormat,
                availableSizes,
                productImage: uploadedFileURL,
                style
            }
            console.log(typeof availSiz)

            let createProduct = await productModel.create(saveProductData)
            res.status(200).send({ status: false, message: `product ${title} created successfully`, data: createProduct })
            return
        } else {
            res.status(400).send({ status: false, message: "somthing unexpected happen" })
            return
        }
    } catch (error) {
        res.status(500).send({ seatus: false, message: error.message })
    }
}

// get product by query localhost:3000/
const getProduct = async function(req,res){
    try{

        if(req.query.size || req.query.name || req.query.priceGreaterThan || req.query.priceLessThan ){
            let availableSizes = req.query.size
            let title = req.query.name
            let priceGreaterThan = req.query.priceGreaterThan
            let priceLessThan = req.query.priceLessThan
            obj = {}
            if(availableSizes){
                obj.availableSizes = availableSizes
            }
            if(title){
                obj.title = {  $regex: '.*' + title.toLowerCase() + '.*' }
            }
            if(priceGreaterThan){
                obj.price = { $gt: priceGreaterThan}
            }
            if(priceLessThan){
                obj.price = { $lt: priceLessThan}
            }
            obj.isDeleted = false
            console.log(obj)
            const getProductsList = await productModel.find(obj).sort({price : 1})
            // console.log(getProductsList)
            if(!getProductsList || getProductsList.length == 0){
                res.status(400).send({status: false, message: `${title} is not available right now.`})
            }else{
                res.status(200).send({status: true, message:'Success', data: getProductsList})
            }
        }else{
            const getListOfProducts = await productModel.find({isDeleted:false}).sort({price:1})
            res.status(200).send({status: true, message:'Success', data: getListOfProducts })
        }
    }catch(err){
        res.status(500).send({status: false, msg : err.message})
    }

}

// const getProduct = async (req, res) => {
//     try {

//         let query = req.query;
//         const { size, name, priceGreaterThan, priceLessThan } = query

//         if (size || name || priceGreaterThan || priceLessThan) {
//             let get = { isDeleted: false, deletedAt: null };

//             if (size) {
//                 get.availableSizes = size
//             }
//             if (name) {
//                 // get.title = { $regex: '.' + name + '.' }
//                 get.title = { $regex: '.*' + name + '.*' }
//             }
//             console.log(name)
//             //console.log(get.title)
//             if (priceGreaterThan) {
//                 get.price = { $gt: priceGreaterThan }
//                 //console.log(get.price)
//             }
//             if (priceLessThan) {
//                 get.price = { $lt: priceLessThan }
//                 //console.log(get.price)
//             }
//             console.log(get)
//             if (priceGreaterThan && priceLessThan) {
//                 get.price = { $gt: priceGreaterThan, $lt: priceLessThan }
//                 // console.log(get.price)
//             }


//             // let productFound = await productModel.find(get)
//             let productFound = await productModel.find(get).select({
//                 _id: 1, title: 1, description: 1, price: 1, currencyId: 1, currencyFormat: 1, isFreeShipping: 1, productImage: 1, style: 1,
//                 availableSizes: 1, installments: 1, deletedAt: 1, isDeleted: 1
//             })


//             if (!(productFound.length > 0)) {
//                 return res.status(404).send({ status: false, message: "no such product found" });
//             }

//             return res.status(200).send({ status: true, message: 'Product list', data: productFound });

//         } else {
//             let Found = await productModel.find({ isDeleted: false })
//             return res.status(200).send({ status: true, message: "Success", data: Found });
//         }
//     }
//     catch (err) {
//         return res.status(500).send({ status: false, msg: err.message });
//     }
// }

module.exports = { releaseProduct, getProduct }
