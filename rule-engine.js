
function Rule(options){
  this.conditions = options.conditions;
  
}

function deepFind(obj, path) {
  var paths = path.split('.'), 
      current = obj, i;

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] === undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
}

Rule.prototype.run = function(facts){
    for(var key in this.conditions){
      if (this.conditions.hasOwnProperty(key)) {
         return Rule.execConditions(key, this.conditions[key], facts);
      }
    }
  
};

Rule.execExpression = function(expression, facts){
  var lhsValue = typeof expression.lhs === 'object' ? deepFind(facts, expression.lhs[0]) : expression.lhs; 
  var rhsValue = typeof expression.rhs === 'object' ? deepFind(facts, expression.rhs[0]) : expression.rhs; 
  
  switch(expression.operator){
    case 'equal':
      if(lhsValue === rhsValue){
         return true;
      }
      break;
    case 'notEqual':
      if(lhsValue !== rhsValue){
         return true;
      }
      break;
    case 'lessThan':
      if(typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue < rhsValue){
         return true;
      }
      break;
    case 'lessThanInclusive':
      if(typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue <= rhsValue){
         return true;
      }
      break;
   case 'greaterThan':
      if(typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue > rhsValue){
         return true;
      }
      break;
    case 'greaterThanInclusive':
      if(typeof lhsValue === 'number' && typeof rhsValue === 'number' && lhsValue >= rhsValue){
         return true;
      }
      break;
  }
  
  
};

Rule.execCondition = function(condition, facts){
  if(condition.hasOwnProperty('any')){
      return Rule.execConditions('any', condition.any, facts);
  } else if(condition.hasOwnProperty('all')){
      return Rule.execConditions('all', condition.all, facts);
  } else if(condition.hasOwnProperty('operator')) {
      return Rule.execExpression(condition, facts);
  }
};

Rule.execConditions = function(operator, conditions, facts){
    var result, condition;
    if(operator === 'any'){
      for(var i = 0; i < conditions.length; i++){
        if(Rule.execCondition(conditions[i], facts)){
          return true;
        }
      }
      return false;
    } else if(operator === 'all'){
      for(var j = 0; j < conditions.length; j++){
        if(!Rule.execCondition(conditions[j], facts)){
          return false;
        }
      }
      return true;
    }
};


r = new Rule({
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
  student : {
    age: 4
  }
}));
