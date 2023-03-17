const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const { queryGenerator } = require('../helpers')

const userSchema = new Schema(
    {
        properties: [
            {
                _id: false,
                name: String,
                value: Mixed
            }
        ],
        name: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

const User = mongoose.model('Users', userSchema)

exports.create = async (userData) => {
    // TODO: destructure properties here
    const newUser = new User({
        ...userData
    })
    return await newUser.save()
}

exports.getAll = async ({ query }) => {
    let que = {
        //   Add Additional Filter if Required
        // name:"Govindram"
    }

    if (query) {
        que = { ...queryGenerator(query) }
    }

    return await User.aggregate([
        {
            $match: que
        },
        {
            $project: {
                _id: 1,
                role: 1,
                properties: {
                    $arrayToObject: {
                        $map: {
                            input: '$properties',
                            in: {
                                k: '$$this.name',
                                v: '$$this.value'
                            }
                        }
                    }
                }
            }
        }

    ]).exec()
}