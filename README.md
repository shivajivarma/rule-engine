# Rule Engine

```js
var rule = new Rule({
	conditions: {
		any: [{
				all: [{
						lhs: ['student.age'],
						operator: 'equal',
						rhs: 40
					}, {
						lhs: ['student.name'],
						operator: 'equal',
						rhs: ['user.fullname']
					}
				]
			}, {
				forEach: {
					array: 'student.subjects',
					as: 'subject'
					all: [{
							lhs: ['subject.mark'],
							operator: 'equal',
							rhs: 48
						}, {
							lhs: ['subject.name'],
							operator: 'greaterThanInclusive',
							rhs: 'maths'
						}
					]
				}

			}
		]
	}
});

rule.run({
	student: xyzStudent,
	user: xyzUser
}).success(function(){
	// do something
}).fail(function(){
	// do something else
});



```

## Operators

Each rule condition must begin with a boolean operator(```all``` or ```any```) at its root.

The ```operator``` compares the value returned by the ```fact``` to what is stored in the ```value``` property.  If the result is truthy, the condition passes.

### String and Numeric operators:

  ```equal``` - _fact_ must equal _value_

  ```notEqual```  - _fact_ must not equal _value_

  _these operators use strict equality (===) and inequality (!==)_

### String operators:

  ```match``` - _fact_ must match _value_ (regex)

### Numeric operators:

  ```lessThan``` - _fact_ must be less than _value_

  ```lessThanInclusive```- _fact_ must be less than or equal to _value_

  ```greaterThan``` - _fact_ must be greater than _value_

  ```greaterThanInclusive```- _fact_ must be greater than or equal to _value_

### Array operators:

  ```in```  - _fact_ must be included in _value_ (an array)

  ```notIn```  - _fact_ must not be included in _value_ (an array)

  ```contains```  - _fact_ (an array) must include _value_

  ```doesNotContain```  - _fact_ (an array) must not include _value_
