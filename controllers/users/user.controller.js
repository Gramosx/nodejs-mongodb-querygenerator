const { createPropertiesArray, createPropertiesObjectFromArray } = require("../../helpers")
const User = require("../../models/users")



exports.create = async (req, res, next) => {
    try {
        let usersData = {
            ...req.body,
        }
        if (usersData.properties) {
            const propertiesArray = createPropertiesArray(usersData.properties)

            usersData = {
                ...usersData,
                properties: propertiesArray
            }
        }

        console.l
        let newUser = await User.create(usersData)

        // Return the user object with properties as an object
        newUser = {
            ...newUser.toObject(),
            properties: createPropertiesObjectFromArray(newUser.properties)
        }

        return res.status(201).json({
            type: 'success',
            data: {
                user: newUser
            }
        })

    } catch (error) {
        return next(error)
    }
}


exports.getAll = async (req, res, next) => {
    const query = req.body.predicate

    try {
        const user = await User.getAll({ query })
        return res.status(200).json({
            type: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        // throw error;
        return next(error)
    }
}
