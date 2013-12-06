angular.module('m2AdminApp')
	.directive('ckEditor', function() {
		return {
			require : '?ngModel',
			link : function($scope, elm, attr, ngModel) {
				
				var ck = CKEDITOR.replace(elm[0]);

				ck.on('instanceReady', function() {
					ck.setData(ngModel.$viewValue);
				});

				ck.on('change', function() {
					console.log("change");
					$scope.$apply(function() {
						ngModel.$setViewValue(ck.getData());
					});
				});

				ck.on('mode', function() {
					console.log("mode");
					$scope.$apply(function() {
						ngModel.$setViewValue(ck.getData());
					});
				});

				ck.on('blur', function() {
					console.log("blur");
					$scope.$apply(function() {
						ngModel.$setViewValue(ck.getData());
					});
				});

				ngModel.$render = function(value) {
					ck.setData(ngModel.$modelValue);
				};
			}
		};
	})