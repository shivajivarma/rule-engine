
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
  var lhs = deepFind(facts, expression.variable); 
  var rhs = expression.value;
  
  switch(expression.operator){
    case 'equal':
      if(lhs === rhs){
         return true;
      }
      break;
    case 'notEqual':
      if(lhs !== rhs){
         return true;
      }
      break;
    case 'lessThan':
      if(typeof lhs === 'number' && typeof rhs === 'number' && lhs < rhs){
         return true;
      }
      break;
    case 'lessThanInclusive':
      if(typeof lhs === 'number' && typeof rhs === 'number' && lhs <= rhs){
         return true;
      }
      break;
   case 'greaterThan':
      if(typeof lhs === 'number' && typeof rhs === 'number' && lhs < rhs){
         return true;
      }
      break;
    case 'greaterThanInclusive':
      if(typeof lhs === 'number' && typeof rhs === 'number' && lhs <= rhs){
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
						variable: 'student.age',
						operator: 'lessThan',
						value: 40
					}
				]
			}
		]
	}
});

console.log(r.run({
  student : {
    age: '4'
  }
}));
