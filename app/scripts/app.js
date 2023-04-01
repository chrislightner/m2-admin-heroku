'use strict';

angular.module('m2AdminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ngAnimate',
    'textAngular',
    'Constants'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/login'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/campaigns', {
        templateUrl: 'views/campaigns.html',
        controller: 'CampaignsCtrl'
      })
      .when('/campaigns/new', {
        templateUrl: 'views/create-campaign.html',
        controller: 'CreateCampaignCtrl'
      })
      .when('/campaigns/:campaignid', {
        templateUrl: 'views/edit-campaign.html',
        controller: 'CampaignCtrl'
      })
      .when('/groups', {
        templateUrl: 'views/groups.html',
        controller: 'GroupsCtrl'
      })
      .when('/groups/new', {
        templateUrl: 'views/create-group.html',
        controller: 'CreateGroupCtrl'
      })
      .when('/groups/:groupShortName', {
        templateUrl: 'views/edit-group.html',
        controller: 'GroupCtrl'
      })
      .when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductsCtrl'
      })
      .when('/products/new', {
        templateUrl: 'views/create-product.html',
        controller: 'CreateProductCtrl'
      })
      .when('/products/:productShortName', {
        templateUrl: 'views/edit-product.html',
        controller: 'ProductCtrl'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl'
      })
      .when('/users/new', {
        templateUrl: 'views/create-user.html',
        controller: 'CreateUserCtrl'
      })
      .when('/users/:username', {
        templateUrl: 'views/edit-user.html',
        controller: 'UserCtrl'
      }).
    otherwise({
      redirectTo: '/login'
    });
  })
  .run(function ($rootScope, $http, $log, $window, $location) {

    $rootScope.logout = function () {
      $log.warn("Logged Out");
      docCookies.removeItem("zgAuth");
      docCookies.removeItem("zgAuth-user");
      $rootScope.currentUser.loggedIn = false;
      $location.url("/login");
    }

    $rootScope.textAngularOpts = {
      toolbar: [
        ['bold', 'italics', 'h1', 'h2', 'h3'],
        ['ul', 'ol'],
        ['undo', 'redo'],
        ['html', 'insertLink']
      ],
      classes: {
        toolbar: 'btn-toolbar',
        toolbarGroup: 'btn-group',
        toolbarButton: 'btn btn-default',
        toolbarButtonActive: 'active',
        textEditor: 'form-control',
        htmlEditor: 'form-control'
      }
    };

    var checkLogin = function () {
      console.log('checkLogin reporting');
      var username = docCookies.getItem("zgAuth-user");
      console.log('username: ' + username);
      var token = docCookies.getItem("zgAuth");
      console.log('token: ' + token);

      $rootScope.currentUser = {
        "username": username,
        "token": token,
        "isLoggedIn": false
      }

      // $rootScope.currentUser = {
      //   "username": 'chris',
      //   "token": '$2y$10$.9dOpaQK3pj3yyHgSQ18tekNez3lIJHnw5XJJ2KlvBt9lVPWvbTNe',
      //   "isLoggedIn": false
      // }

      // $rootScope.currentUser = {
      //   "username": 'chris',
      //   "token": '$2y$10$XkhdXAbhvY8KTQP3Hu2xpOs.dyOBsSEDSsid4uEyGAMCkl/0CxnGi',
      //   "isLoggedIn": false
      // }

      if ($rootScope.currentUser.username) {
        //$http.post('//coveragedetails.net/api/index.php/users/check', $rootScope.currentUser)
        $http.post('https://api.coveragedetails.net/index.php/users/check', $rootScope.currentUser)
        //$http.post('https://m2-api-nest-test.herokuapp.com/users/check', $rootScope.currentUser)
          .success(function (data) {
            if (data.status !== "success") {
              if (data.error == 1) {
                $log.warn("Login Expired");
                console.log("Login Expired")
                $log.warn(data);
                docCookies.removeItem("zgAuth");
                docCookies.removeItem("zgAuth-user");
                $rootScope.currentUser = {};
                $rootScope.currentUser.loggedIn = false;
                $location.url("/login");
                return false;
              } else {
                $log.warn("Login Failed");
                console.log("Login Failed");
                $rootScope.currentUser.isLoggedIn = false;
                $rootScope.currentUser = {};
                $location.url("/login");
                return false;
              }
            } else {
              $log.info("Login Successful");
              console.log("Login Successful");
              $rootScope.currentUser.role = parseInt(data.role);
              $rootScope.currentUser.isLoggedIn = true;
              if ($location.path() === "/login") {
                $location.url("/campaigns");
              }
              return true;
            }
          })
          .error(function (data) {
            $log.warn("Error: " + data);
            $rootScope.currentUser = {};
            $location.url("/login");
            return false;
          });
      } else {
        $log.warn("Not Logged In");
        $rootScope.currentUser.isLoggedIn = false;
        $rootScope.currentUser = {};
        $location.url("/login");
        return false;
      }
    }

    $rootScope.$on('$routeChangeStart', checkLogin);
  });
