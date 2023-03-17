const { OPERATOR_FUNCTIONS, OPERATORS } = require('../constants/constant')


exports.createPropertiesArray = (properties) => {
    return Object.entries(properties).map(([name, value]) => ({ name, value }))
}

exports.createPropertiesObjectFromArray = (properties) => {
    if (properties.length === 0) {
        return {}
    }
    return properties.reduce((obj, item) => {
        obj[item.name] = item.value
        return obj
    }, {})
}

exports.queryGenerator = (req) => {
    if (Array.isArray(req)) {
        let que = []
        req.forEach(predicate => {
            que = que.concat(this.baseOperatorBuilder(predicate))
        })
        return que
    } else {
        return (this.baseOperatorBuilder(req))
    }
}

exports.baseOperatorBuilder = (predicate) => {
    const arr = []
    const que = {}
    switch (predicate.type) {
        case 'and':
            que.$and = que.$and || []
            que.$and = que.$and.concat(this.queryGenerator(predicate.predicates))
            break
        case 'or':
            que.$or = que.$or || []
            que.$or = que.$or.concat(this.queryGenerator(predicate.predicates))
            break
        default: {
            const query = {}

            // Convert the value to appropritate data type => Number
            if (predicate.type && predicate.type === 'number') { predicate.value = Number.parseInt(predicate.value) }

            // Should not add "name" key as for known and unknown we need to compare with "property" key
            if ((predicate.comparison === OPERATORS.KNOWN || predicate.comparison === OPERATORS.UNKNOWN)) {
                query.name = OPERATOR_FUNCTIONS[predicate.comparison](predicate)
            } else {
                query.name = predicate.property
                query.value = OPERATOR_FUNCTIONS[predicate.comparison](predicate)
            }

            arr.push(Object.assign({}, { properties: { $elemMatch: query } }))
            break
        }
    }
    // que = arr;
    return arr.length ? arr : que
}
