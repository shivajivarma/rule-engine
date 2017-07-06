class Rule {
    constructor(options) {
        this.conditions = options.conditions;
    }

    static deepFind(obj, path) {
        let paths = path.split('.'),
            current = obj,
            i;

        for (i = 0; i < paths.length; ++i) {
            if (current[paths[i]] === undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }

    static execExpression(expression, facts) {
        let lhsValue = typeof expression.lhs === 'object' ? Rule.deepFind(facts, expression.lhs[0]) : expression.lhs;
        let rhsValue = typeof expression.rhs === 'object' ? Rule.deepFind(facts, expression.rhs[0]) : expression.rhs;

        switch (expression.operator) {
            case 'equal':
                if (lhsValue === rhsValue) {
                    return true;
                }
                break;
            case 'notEqual':
                if (lhsValue !== rhsValue) {
                    return true;
                }
                break;
            case 'lessThan':
                if (typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue < rhsValue) {
                    return true;
                }
                break;
            case 'lessThanInclusive':
                if (typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue <= rhsValue) {
                    return true;
                }
                break;
            case 'greaterThan':
                if (typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue > rhsValue) {
                    return true;
                }
                break;
            case 'greaterThanInclusive':
                if (typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue >= rhsValue) {
                    return true;
                }
                break;
        }

    }

    static execCondition(subject, facts) {

        if (subject.hasOwnProperty('any')) {
            return Rule.execConditions('any', subject.any, facts);
        } else if (subject.hasOwnProperty('all')) {
            return Rule.execConditions('all', subject.all, facts);
        } else if (subject.hasOwnProperty('forEach')) {

            let subFacts = Rule.deepFind(facts, subject.forEach['array']);
            if (subFacts) {
                subFacts.forEach(function (fact) {
                    let subFact = {};
                    subFact[subject.forEach['as']] = fact;
                    if (subject.forEach.hasOwnProperty('all')) {
                        return Rule.execConditions('all', subject.forEach['all'], subFact);
                    } else {
                        return Rule.execConditions('any', subject.forEach['any'], subFact);
                    }
                });
            }

            return false;
        } else if (subject.hasOwnProperty('operator')) {
            return Rule.execExpression(subject, facts);
        }
    }

    static execConditions(operator, conditions, facts) {
        let length = conditions.length;

        if (operator === 'any') {
            for (let i = 0; i < length; i++) {
                if (Rule.execCondition(conditions[i], facts)) {
                    return true;
                }
            }
            return false;
        } else if (operator === 'all') {
            for (let j = 0; j < length; j++) {
                if (!Rule.execCondition(conditions[j], facts)) {
                    return false;
                }
            }
            return true;
        }
    }

    run(facts) {
        for (let key in this.conditions) {
            if (this.conditions.hasOwnProperty(key)) {
                return Rule.execConditions(key, this.conditions[key], facts);
            }
        }
    }

}


let r = new Rule({
    conditions: {
        any: [{
            all: [{
                lhs: ['student.age'],
                operator: 'lessThan',
                rhs: 40
            }
            ]
        }
        ]
    }
});

console.log(r.run({
    student: {
        age: 30
    }
}));