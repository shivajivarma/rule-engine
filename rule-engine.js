
function Rule(options){
  this.conditions = options.conditions;
  
}

Rule.prototype.run = function(facts){
    for(var key in this.conditions){
      if (this.conditions.hasOwnProperty(key)) {
         return Rule.execConditions(key, this.conditions[key], facts);
      }
    }
  
}

Rule.execExpression = function(expression, facts){
  var variable = expression.variable.split('.');
  var lhs = facts[variable[0]][variable[1]];  
  if(lhs === expression.value){
     return true;
  }
  
}

Rule.execCondition = function(condition, facts){
  if(condition.hasOwnProperty('any')){
      return Rule.execConditions('any', condition.any, facts);
  } else if(condition.hasOwnProperty('all')){
      return Rule.execConditions('all', condition.all, facts);
  } else if(condition.hasOwnProperty('operator')) {
      return Rule.execExpression(condition, facts);
  }
}

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
}


r = new Rule({
	conditions: {
		any: [{
				all: [{
						variable: 'student.age',
						operator: 'equal',
						value: 40
					}
				]
			}
		]
	}
});

console.log(r.run({
  student : {
    age: 40
  }
}));
