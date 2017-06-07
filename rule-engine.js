
function Rule(options){
  this.conditions = options.conditions;
  
}



Rule.prototype.run = function(facts){
    for(var key in this.conditions){
      if (this.conditions.hasOwnProperty(key)) {
         return Rule.execCondition(key, this.conditions[key], facts);
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

Rule.execCondition = function(operator, conditions, facts){
    var result, condition;
    if(operator === 'any'){
      for(var i = 0; i < conditions.length; i++){
        condition = conditions[i];
        if(condition.hasOwnProperty('any')){
            result = Rule.execCondition('any', condition['any'], facts);
        } else if(condition.hasOwnProperty('all')){
            result = Rule.execCondition('all', condition['all'], facts);
        } else if(condition.hasOwnProperty('operator')) {
          Rule.execExpression(expression, facts);
        }
        if(result){
          return result;
        }
      }
      return false;
    } else if(operator === 'all'){
      for(var j = 0; j < conditions.length; j++){
        condition = conditions[j];
        if(condition.hasOwnProperty('any')){
            result = Rule.execCondition('any', condition['any'], facts);
        } else if(condition.hasOwnProperty('all')){
            result = Rule.execCondition('all', condition['all'], facts);
        } else if(condition.hasOwnProperty('operator')) {
            result = Rule.execExpression(condition, facts);
        }
        if(!result){
          return result;
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
    age: 406
  }
}));
