(function (global) {

	function Rule(options) {
		this.conditions = options.conditions;
	}

	function deepFind(obj, path) {
		var paths = path.split('.'),
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

	function execExpression(expression, facts) {
		var lhsValue = typeof expression.lhs === 'object' ? deepFind(facts, expression.lhs[0]) : expression.lhs;
		var rhsValue = typeof expression.rhs === 'object' ? deepFind(facts, expression.rhs[0]) : expression.rhs;

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

	function execCondition(condition, facts) {
		if (condition.hasOwnProperty('any')) {
			return execConditions('any', condition.any, facts);
		} else if (condition.hasOwnProperty('all')) {
			return execConditions('all', condition.all, facts);
		} else if (condition.hasOwnProperty('operator')) {
			return execExpression(condition, facts);
		}
	}

	function execConditions(operator, conditions, facts) {
		var result,
		condition;
		if (operator === 'any') {
			for (var i = 0; i < conditions.length; i++) {
				if (execCondition(conditions[i], facts)) {
					return true;
				}
			}
			return false;
		} else if (operator === 'all') {
			for (var j = 0; j < conditions.length; j++) {
				if (!execCondition(conditions[j], facts)) {
					return false;
				}
			}
			return true;
		}
	}

	Rule.prototype = {
		run : function (facts) {
			for (var key in this.conditions) {
				if (this.conditions.hasOwnProperty(key)) {
					return execConditions(key, this.conditions[key], facts);
				}
			}
		}
	};

	global.Rule = Rule;

})(this);

r = new Rule({
		conditions : {
			any : [{
					all : [{
							lhs : ['student.age'],
							operator : 'lessThan',
							rhs : 40
						}
					]
				}
			]
		}
	});

console.log(r.run({
		student : {
			age : 44
		}
	}));
