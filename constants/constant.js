const { startOfDay, endOfDay } = require('date-fns')

const OPERATORS = Object.freeze({
    EQUAL: 'is',
    NOT_EQUAL: 'is not',
    GREATER_THAN: 'greater than',
    LESS_THAN: 'less than',
    STARTS_WITH: 'starts with',
    ENDS_WITH: 'ends with',
    CONTAINS: 'has',
    NOT_CONTAINS: "doesn't have",
    KNOWN: 'known',
    UNKNOWN: 'unknown',

    // Date
    // ABSOLUTE
    ON: 'on',
    BEFORE: 'before',
    AFTER: 'after',
    BETWEEN: 'between',

    // RELATIVE
    EXACTLY: 'exactly', // CAN BE REMOVED with 'is'
    MORE_THAN: 'more than'
    // LESS THAN --ALREADY PRESENT
})

const OPERATOR_FUNCTIONS = Object.freeze({
    [OPERATORS.EQUAL]: ({ type, value }) => type === 'string'
        ? { $regex: new RegExp('^' + value + '$', 'i') }
        : value,
    [OPERATORS.NOT_EQUAL]: ({ value }) => ({ $ne: value }),
    [OPERATORS.GREATER_THAN]: ({ type, value }) => {
        if (type === 'date') {
            const dt = new Date()
            dt.setDate(dt.getDate() - value)
            return {
                $gte: startOfDay(dt).toISOString()
            }
        } else {
            return { $gte: value }
        }
    },
    [OPERATORS.LESS_THAN]: ({ type, value }) => {
        if (type === 'date') {
            const dt = new Date()
            dt.setDate(dt.getDate() - value)
            return {
                $gte: endOfDay(new Date(dt)).toISOString()
            }
        } else {
            return { $lte: value }
        }
    },
    [OPERATORS.STARTS_WITH]: ({ value }) => ({ $regex: `^${value}`, $options: 'i' }),
    [OPERATORS.ENDS_WITH]: ({ value }) => ({ $regex: `${value}$`, $options: 'i' }),
    [OPERATORS.CONTAINS]: ({ value }) => ({ $regex: value, $options: 'i' }),
    [OPERATORS.NOT_CONTAINS]: ({ value }) => ({ $not: { $regex: value, $options: 'i' } }),
    [OPERATORS.KNOWN]: ({ property }) => ({ $eq: property }), // Change imolementation of known and unknown to equal and notequal as we store data in key value
    [OPERATORS.UNKNOWN]: ({ property }) => ({ $ne: property }),

    // DATE
    [OPERATORS.BEFORE]: ({ value }) => ({ $lte: endOfDay(new Date(value)).toISOString() }),
    [OPERATORS.AFTER]: ({ value }) => ({ $gte: startOfDay(new Date(value)).toISOString() }),
    [OPERATORS.EXACTLY]: ({ value }) => ({
        $gte: startOfDay(new Date(value)).toISOString(),
        $lte: endOfDay(new Date(value)).toISOString()
    }),

    [OPERATORS.BETWEEN]: ({ value }) => ({
        $gte: startOfDay(new Date(value[0])).toISOString(),
        $lte: endOfDay(new Date(value[1])).toISOString()
    }),
    [OPERATORS.MORE_THAN]: ({ value }) => {
        const dt = new Date()
        dt.setDate(dt.getDate() - value)
        return {
            $lte: startOfDay(dt).toISOString()
        }
    }
})

const SUPPORTED_OPERATORS = Object.freeze({
    string: [
        OPERATORS.EQUAL,
        OPERATORS.NOT_EQUAL,
        OPERATORS.STARTS_WITH,
        OPERATORS.ENDS_WITH,
        OPERATORS.CONTAINS,
        OPERATORS.NOT_CONTAINS
    ],
    number: [
        OPERATORS.EQUAL,
        OPERATORS.NOT_EQUAL,
        OPERATORS.GREATER_THAN,
        OPERATORS.LESS_THAN
    ],
    date: [
        OPERATORS.BEFORE,
        OPERATORS.AFTER,
        OPERATORS.BETWEEN,
        OPERATORS.EXACTLY,
        OPERATORS.MORE_THAN,
        OPERATORS.LESS_THAN
    ]
})

module.exports = {
    SUPPORTED_OPERATORS,
    OPERATORS,
    OPERATOR_FUNCTIONS
}
