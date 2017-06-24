var r = new Rule({
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
