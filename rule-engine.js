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

	function execCondition(subject, facts) {

		if (subject.hasOwnProperty('any')) {
			return execConditions('any', subject.any, facts);
		} else if (subject.hasOwnProperty('all')) {
			return execConditions('all', subject.all, facts);
		} else if (subject.hasOwnProperty('forEach')) {
            
            var subFacts = deepFind(facts, subject.forEach.array);
            if(subFacts){
              for (var k = 0; k < subFacts.length; k++) {
                var subFact = {};
                    subFact[subject.forEach.as] = subFacts[k];
                if (subject.forEach.hasOwnProperty('all')) {
					return execConditions('all', subject.forEach['all'], subFact);
				} else {
                    return execConditions('any', subject.forEach['any'], subFact);
				}
              }
            }
          
            return false;
		} else if (subject.hasOwnProperty('operator')) {
			return execExpression(subject, facts);
		}
	}

	function execConditions(operator, conditions, facts) {
		var result,
            length = conditions.length;
     
		if (operator === 'any') {
			for (var i = 0; i < length; i++) {
				if (execCondition(conditions[i], facts)) {
					return true;
				}
			}
			return false;
		} else if (operator === 'all') {
			for (var j = 0; j < length; j++) {
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
