const updateUser = async (req, res) => {
    try {
        userId = req.params.userId;
        let requestBody = req.body;
        let profileImage = req.files
        let decodedUserId = req.userId
        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: 'No paramateres passed. Book unmodified' })

        const UserFound = await userModel.findOne({ _id: userId})
        if (!UserFound) return res.status(404).send({ status: false, message: `User not found with given UserId` });

        if (!decodedUserId == userId) return res.status(400).send({ status: false, message: "userId in url param and in token is not same" });

        if (profileImage && profileImage.length > 0) {
            var uploadedFileURL = await awsFile.uploadFile(profileImage[0]);
            requestBody.profileImage = uploadedFileURL
        };
        requestBody.address = JSON.parse(requestBody.address)

        if (Object.prototype.hasOwnProperty.call(requestBody, 'email')) {
            if (!(validator.validEmail.test(requestBody.email))) {
                res.status(400).send({ status: false, message: `Email should be a valid email address` })
                return
            };
            const isEmailAlreadyUsed = await userModel.findOne({ email: requestBody.email });
            if (isEmailAlreadyUsed) {
                res.status(400).send({ status: false, message: `${requestBody.email} email address is already registered` })
                return
            };
        };
        if (Object.prototype.hasOwnProperty.call(requestBody, 'password')) {
            requestBody.password = requestBody.password.trim();
            if (!(requestBody.password.length > 7 && requestBody.password.length < 16)) {
                res.status(400).send({ status: false, message: "password should between 8 and 15 characters" })
                return
            };
            var salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(requestBody.password, salt)
            // console.log(password)
            requestBody.password = password;
        };
        requestBody.UpdatedAt = new Date()
        const upatedUser = await userModel.findOneAndUpdate({ _id: userId }, requestBody, { new: true })
        res.status(200).send({ status: true, message: 'User updated successfully', data: upatedUser });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};