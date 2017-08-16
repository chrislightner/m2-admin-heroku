'use strict';

angular.module('m2AdminApp')

.controller('IndexCtrl', function(){
})
//coveragedetails.net/api/index.php/
.controller('LoginCtrl', function($scope, $http, $log, $location){

	$scope.checkLogin = function(credentials){
		$http.post('//coveragedetails.net/api/index.php/login', credentials)
			.success(function(data){
				$log.info(data);
				if(data.status === 'success'){
					$http.get('//coveragedetails.net/api/index.php/users/' + data.username)
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

	$http.get('//coveragedetails.net/api/index.php/campaigns/campaignAll/')
		.success(function(data){
			data.forEach(function(e){
				e.groupShortName = e.group.shortName;
				e.productShortName = e.product.shortName;
			});
			$scope.campaigns = data;
			console.log(data);
		})
		.error(function(data){
			$log.info(data);
		});

    $http.get('//coveragedetails.net/api/index.php/groups')
      .success(function(groups){
        $scope.groups = groups;
      });

    $http.get('//coveragedetails.net/api/index.php/products')
      .success(function(products){
        $scope.products = products;
      });

	$scope.sortBy = function(sortBy){
		$scope.campaignSort = sortBy;
		$scope.campaignSortReverse = !$scope.campaignSortReverse;
	}

	$scope.$watch('campaignFilter.groupShortName', function(newValue){
      // console.log(newValue, oldValue);
      console.log(newValue);
      if(newValue === null){
        $scope.campaignFilter.groupShortName = '';
      }
    });

    $scope.$watch('campaignFilter.productShortName', function(newValue){
      // console.log(newValue, oldValue);
      console.log(newValue);
      if(newValue === null){
        $scope.campaignFilter.productShortName = '';
      }
    });

    $scope.clearFilter = function(){
      $scope.campaignFilter = {};
    };

})
.controller('CampaignCtrl', function($scope, $http, $routeParams, $log, $location, $modal, $filter){

	$http.get('//coveragedetails.net/api/index.php/campaigns/campaignAllById/' + $routeParams.campaignid)
		.success(function(data){
			$scope.campaign = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('//coveragedetails.net/api/index.php/groups')
		.success(function(data){
			$scope.groups = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('//coveragedetails.net/api/index.php/products')
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

		$http.put('//coveragedetails.net/api/index.php/campaigns', campaign)
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
				$http['delete']('//coveragedetails.net/api/index.php/campaigns/' + $scope.campaign.id )
				.success(function(data){
					console.log(data);
					$location.url('/campaigns');
				})
				.error(function(data){
					$log.info('Error ', data);
				});
			}
		}, function () {

		});
	};

	$scope.duplicateCampaign = function(campaign) {


		// validator: make sure they've given a new job number and short name
		if ($("#new-job-number").val() != "") {

			// change the job number
			campaign.jobNumber = $("#new-job-number").val();

			// change the short name
			campaign.shortName = $("#new-job-number").val().substr($("#new-job-number").val().indexOf("-")+1,$("#new-job-number").val().length);

			// set compliance approved to "no"
			campaign.complianceApproval = 0;

			// set in development to "yes"
			campaign.isInDevelopment = 1;

			// create the campaign
			$http.post('//coveragedetails.net/api/index.php/campaigns/new', campaign)
				.success(function(data){
					$log.info('Saved ', data);
					$location.url('/campaigns');
				})
				.error(function(data){
					$log.info('Error ', data);
				});
			// validator message
		} else {
			alert("Please fill out the form");
		}
		
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

	// $http.get('//coveragedetails.net/api/index.php/campaigns')
	// 	.success(function(data){
	// 		$scope.campaigns = data;
	// 	})
	// 	.error(function(data){
	// 		$log.info(data);
	// 	});

	$scope.syncJobNumber = function(){
		$scope.campaign.shortName = $filter('jobNumberToShortName')($scope.campaign.jobNumber);
	}

	$http.get('//coveragedetails.net/api/index.php/groups')
		.success(function(data){
			$scope.groups = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('//coveragedetails.net/api/index.php/products')
		.success(function(data){
			$scope.products = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.submitCreateCampaign = function(campaign){

		// validator
		if ($("#jobNumber").val() == "") {
			alert("Please enter a job number");
		} else if ($("#segmentio-id").val() == "") {
			alert("Please enter a Segment.io ID");
		} else { // success
			$http.post('//coveragedetails.net/api/index.php/campaigns/new', campaign)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/campaigns');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
		}

	};

})
.controller('GroupsCtrl', function($scope, $http, $routeParams, $log){

	$http.get('//coveragedetails.net/api/index.php/groups')
	.success(function(data){
		$scope.groups = data;
	})
	.error(function(data){
		$log.info(data);
	});

})
.controller('GroupCtrl', function($scope, $http, $routeParams, $log, $location, $modal){

	$http.get('//coveragedetails.net/api/index.php/groups/' + $routeParams.groupShortName)
		.success(function(data){
			$scope.group = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$http.get('//coveragedetails.net/api/index.php/tpas')
		.success(function(data){
			$scope.tpas = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.saveGroup = function(group){
		$http.put('//coveragedetails.net/api/index.php/groups', group)
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
				$http['delete']('//coveragedetails.net/api/index.php/groups/' + $scope.group.id ).success(function(){
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

	$http.get('//coveragedetails.net/api/index.php/tpas')
		.success(function(data){
			$scope.tpas = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.submitCreateGroup = function(group){
		$http.post('//coveragedetails.net/api/index.php/groups/new', group)
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

	$http.get('//coveragedetails.net/api/index.php/products')
	.success(function(data){
		$scope.products = data;
	})
	.error(function(data){
		$log.info(data);
	});

})
.controller('ProductCtrl', function($scope, $http, $routeParams, $log, $location, $modal){

	$http.get('//coveragedetails.net/api/index.php/products/' + $routeParams.productShortName)
		.success(function(data){
			$scope.product = data;
		});

	$scope.saveProduct = function(product){

		$http.put('//coveragedetails.net/api/index.php/products', product)
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
				$http['delete']('//coveragedetails.net/api/index.php/products/' + $scope.product.id )
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

		$http.post('//coveragedetails.net/api/index.php/products/new', product)
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

	$http.get('//coveragedetails.net/api/index.php/users').success(function(data){
		$scope.users = data;
	});

})
.controller('UserCtrl', function($scope, $http, $routeParams, $log, $location, $modal){

	$http.get('//coveragedetails.net/api/index.php/users/' + $routeParams.username)
		.success(function(data){
			$scope.user = data;
		});

	$http.get('//coveragedetails.net/api/index.php/userRoles')
		.success(function(data){
			$scope.roles = data;
		});

	$scope.saveUser = function(user){

		$http.put('//coveragedetails.net/api/index.php/users', user)
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
				$http['delete']('//coveragedetails.net/api/index.php/users/' + $scope.user.id )
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

	$http.get('//coveragedetails.net/api/index.php/userRoles')
		.success(function(data){
			$scope.roles = data;
		})
		.error(function(data){
			$log.info(data);
		});

	$scope.submitCreateUser = function(user){

		$http.post('//coveragedetails.net/api/index.php/users/new', user)
			.success(function(data){
				$log.info('Saved ', data);
				$location.url('/users');
			})
			.error(function(data){
				$log.info('Error ', data);
			});
	};

});
