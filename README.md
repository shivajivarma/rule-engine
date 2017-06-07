# Rule Engine

```js
engine.addRule({
	conditions: {
		any: [{
				all: [{
						variable: 'student.age',
						operator: 'equal',
						value: 40
					}, {
						variable: 'student.name',
						operator: 'greaterThanInclusive',
						variable: 'user.fullname'
					}
				]
			}, {
				forEach: {
					array: 'student.subjects',
					as: 'subject'
					all: [{
							variable: 'subject.mark',
							operator: 'equal',
							value: 48
						}, {
							variable: 'subject.name',
							operator: 'greaterThanInclusive',
							value: 'maths'
						}
					]
				}

			}
		]
	}
});
```

## Operators

Each rule condition must begin with a boolean operator(```all``` or ```any```) at its root.

The ```operator``` compares the value returned by the ```fact``` to what is stored in the ```value``` property.  If the result is truthy, the condition passes.

### String and Numeric operators:

  ```equal``` - _fact_ must equal _value_

  ```notEqual```  - _fact_ must not equal _value_

  _these operators use strict equality (===) and inequality (!==)_

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
