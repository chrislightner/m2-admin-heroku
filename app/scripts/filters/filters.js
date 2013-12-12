angular.module('m2AdminApp')
	.filter('datetimeToDate', function(){
			// Turns MySQL datetime into Javascript Date Object
			return function(input) {
				// Split timestamp into [ Y, M, D, h, m, s ]
				var t = input.split(/[- :]/);

				// Apply each element to the Date function
				var output = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
				return output;
			}
		})
	.filter('jobNumberToShortName', function(){
			return function(input) {
				if(input){
					var t = input.split("-");
					var output =  t[1];
					return output;
				}
			}
		})
	.filter('capitalize', function(){
			return function(input) {
				if(input){
					return input.charAt(0).toUpperCase() + input.slice(1);
				}
			}
		});