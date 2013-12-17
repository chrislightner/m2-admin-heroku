'use strict';

angular.module('m2AdminApp')
.controller('IndexCtrl', function(){

})
.controller('LoginCtrl', function($scope, $http, $log, $location){
	
	$scope.checkLogin = function(credentials){
		$http.post('http://zeisgroupdevelopment.com/api/login', credentials)
			.success(function(data){
				$log.info(data);
				if(data.status === 'success'){
					$http.get('http://zeisgroupdevelopment.com/api/users/' + data.username)
						.success(function(data){
							$scope.currentUser = data;
						})
						.error(function(data){
							$log.info('Error ', data);
						});
					docCookies.setItem('zgAuth', data.token, data.expires, '/');
					docCookies.setItem('zgAuth-user', data.username, data.expires, '/');
					$location.url('/campaigns');
				}else{
					$location.url('/');
				}
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};

})
.controller('CampaignsCtrl', function($scope, $http, $routeParams, $log){
	
	$scope.campaignSort = "jobNumber";
	$scope.campaignSortReverse = false;

	$http.get('http://zeisgroupdevelopment.com/api/campaigns/campaignAll/')
		.success(function(data){
			$scope.campaigns = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.sortBy = function(sortBy){
		$scope.campaignSort = sortBy;
		$scope.campaignSortReverse = !$scope.campaignSortReverse;
	}

})
.controller('CampaignCtrl', function($scope, $http, $routeParams, $log, $location, $modal, $filter){
	
	$http.get('http://zeisgroupdevelopment.com/api/campaigns/campaignAllById/' + $routeParams.campaignid)
		.success(function(data){
			$scope.campaign = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('http://zeisgroupdevelopment.com/api/groups')
		.success(function(data){
			$scope.groups = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('http://zeisgroupdevelopment.com/api/products')
		.success(function(data){
			$scope.products = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.syncJobNumber = function(){
		$scope.campaign.shortName = $filter('jobNumberToShortName')($scope.campaign.jobNumber);
	}

	$scope.saveCampaign = function(campaign){

		console.log(campaign);

		$http.put('http://zeisgroupdevelopment.com/api/campaigns', campaign)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/campaigns');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};

	$scope.deleteVerify = function(){

		var modalInstance = $modal.open({
			templateUrl: 'views/delete-campaign-modal.html',
			controller: 'deleteCampaignModalCtrl',
			resolve: {
				campaign: function(){
					return $scope.campaign;
				}
			}
		});

		modalInstance.result.then(function (deleteVerify){

			if(deleteVerify === 'delete'){
				//using $http.delete() throws a parse error in IE8, use $http['delete'] instead
				$http['delete']('http://zeisgroupdevelopment.com/api/campaigns/' + $scope.campaign.id )
				.success(function(){
					$location.url('/campaigns');
				})
				.error(function(data){
					$log.info('Error ', data);
				});
			}
		}, function () {
			
		});
	};

})
.controller('deleteCampaignModalCtrl', function($scope, $log, $modalInstance, campaign){
	
		$scope.campaign = campaign;

		$scope.ok = function(){
			$modalInstance.close('delete');
		};
		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		};
	
})
.controller('CreateCampaignCtrl', function($scope, $http, $routeParams, $log, $location, $filter){

	// $http.get('http://zeisgroupdevelopment.com/api/campaigns')
	// 	.success(function(data){
	// 		$scope.campaigns = data;
	// 	})
	// 	.error(function(data){
	// 		$log.info(data);
	// 	});

	$scope.syncJobNumber = function(){
		$scope.campaign.shortName = $filter('jobNumberToShortName')($scope.campaign.jobNumber);
	}

	$http.get('http://zeisgroupdevelopment.com/api/groups')
		.success(function(data){
			$scope.groups = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('http://zeisgroupdevelopment.com/api/products')
		.success(function(data){
			$scope.products = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.submitCreateCampaign = function(campaign){

		$http.post('http://zeisgroupdevelopment.com/api/campaigns/new', campaign)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/campaigns');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};
	
})
.controller('GroupsCtrl', function($scope, $http, $routeParams, $log){
	
	$http.get('http://zeisgroupdevelopment.com/api/groups')
	.success(function(data){
		$scope.groups = data;
	})
	.error(function(data){
		$log.info(data);
	});
	
})
.controller('GroupCtrl', function($scope, $http, $routeParams, $log, $location, $modal){	

	$http.get('http://zeisgroupdevelopment.com/api/groups/' + $routeParams.groupShortName)
		.success(function(data){
			$scope.group = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('http://zeisgroupdevelopment.com/api/tpas')
		.success(function(data){
			$scope.tpas = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.saveGroup = function(group){
		$http.put('http://zeisgroupdevelopment.com/api/groups', group)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/groups');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};

	$scope.deleteVerify = function(){

		var modalInstance = $modal.open({
			templateUrl: 'views/delete-group-modal.html',
			controller: 'deleteGroupModalCtrl',
			resolve: {
				group: function(){
					return $scope.group;
				}
			}
		});

		modalInstance.result.then(function (deleteVerify){
			if(deleteVerify === 'delete'){
				//using $http.delete() throws a parse error in IE8, use $http['delete'] instead
				$http['delete']('http://zeisgroupdevelopment.com/api/groups/' + $scope.group.id ).success(function(){
					$location.url('/groups');
				})
				.error(function(data){
					$log.info('Error ', data);
				});
			}
		}, function () {
			
		});
	};
	
})
.controller('deleteGroupModalCtrl', function($scope, $log, $modalInstance, group){

	$scope.group = group;

	$scope.ok = function(){
		$modalInstance.close('delete');
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
})
.controller('CreateGroupCtrl', function($scope, $http, $routeParams, $log, $location){

	$http.get('http://zeisgroupdevelopment.com/api/tpas')
		.success(function(data){
			$scope.tpas = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.submitCreateGroup = function(group){
		$http.post('http://zeisgroupdevelopment.com/api/groups/new', group)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/groups');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};
	
})
.controller('ProductsCtrl', function($scope, $http, $routeParams, $log){
	
	$http.get('http://zeisgroupdevelopment.com/api/products')
	.success(function(data){
		$scope.products = data;
	})
	.error(function(data){
		$log.info(data);
	});
	
})
.controller('ProductCtrl', function($scope, $http, $routeParams, $log, $location, $modal){

	$http.get('http://zeisgroupdevelopment.com/api/products/' + $routeParams.productShortName)
		.success(function(data){
			$scope.product = data;
		});

	$scope.saveProduct = function(product){

		$http.put('http://zeisgroupdevelopment.com/api/products', product)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/products');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};

	$scope.deleteVerify = function(){

		var modalInstance = $modal.open({
			templateUrl: 'views/delete-product-modal.html',
			controller: 'deleteProductModalCtrl',
			resolve: {
				product: function(){
					return $scope.product;
				}
			}
		});

		modalInstance.result.then(function (deleteVerify){
			if(deleteVerify === 'delete'){
				//using $http.delete() throws a parse error in IE8, use $http['delete'] instead
				$http['delete']('http://zeisgroupdevelopment.com/api/products/' + $scope.product.id )
					.success(function(){
						$location.url('/products');
					})
					.error(function(data){
						$log.info('Error ', data);
					});

			}
		}, function () {
			
		});
	};
	
})
.controller('deleteProductModalCtrl', function($scope, $log, $modalInstance, product){

	$scope.product = product;

	$scope.ok = function(){
		$modalInstance.close('delete');
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
})
.controller('CreateProductCtrl', function($scope, $http, $routeParams, $log, $location){
	
	$scope.submitCreateProduct = function(product){

		$log.info(product);

		$http.post('http://zeisgroupdevelopment.com/api/products/new', product)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/products');
			})
			.error(function(data){
				$log.info('Error ', data);
			});

	};
	
})
.controller('UsersCtrl', function($scope, $http){
	
	$http.get('http://zeisgroupdevelopment.com/api/users').success(function(data){
		$scope.users = data;
	});
	
})
.controller('UserCtrl', function($scope, $http, $routeParams, $log, $location, $modal){
	
	$http.get('http://zeisgroupdevelopment.com/api/users/' + $routeParams.username)
		.success(function(data){
			$scope.user = data;
		});

	$http.get('http://zeisgroupdevelopment.com/api/userRoles')
		.success(function(data){
			$scope.roles = data;
		});

	$scope.saveUser = function(user){

		$http.put('http://zeisgroupdevelopment.com/api/users', user)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/users');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};

	$scope.deleteVerify = function(){

		var modalInstance = $modal.open({
			templateUrl: 'views/delete-user-modal.html',
			controller: 'deleteUserModalCtrl',
			resolve: {
				user: function(){
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function (deleteVerify){
			if(deleteVerify === 'delete'){
				//using $http.delete() throws a parse error in IE8, use $http['delete'] instead
				$http['delete']('http://zeisgroupdevelopment.com/api/users/' + $scope.user.id )
				.success(function(){
					$location.url('/users');
				})
				.error(function(data){
					$log.info('Error ', data);
				});
			}
		}, function () {
			// Do something if delete modal is canceled
		});
	};
	
})
.controller('deleteUserModalCtrl', function($scope, $log, $modalInstance, user){
	
	$scope.user = user;

	$scope.ok = function(){
		$modalInstance.close('delete');
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
})
.controller('CreateUserCtrl', function($scope, $http, $routeParams, $log, $location){

	$http.get('http://zeisgroupdevelopment.com/api/userRoles')
		.success(function(data){
			$scope.roles = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.submitCreateUser = function(user){

		$http.post('http://zeisgroupdevelopment.com/api/users/new', user)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/users');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};
	
});