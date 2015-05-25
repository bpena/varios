(function() {
    'use strict';

    angular
        .module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('index', {
                    url: "/", // root route
                    controller: 'pController', // This view will use PruebaController loaded below in the resolve
                    controllerAs: 'ctrl',
                    templateUrl: 'prueba/prueba.template.html',
                    resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            // you can lazy load files for an existing module
                            return $ocLazyLoad
                                .load(['prueba/prueba.controller.js',
                                    'directivas/currency/currency.directive.js']);
                        }]
                    }
                });

            $locationProvider.html5Mode({
                enabled: true,
            });
        }]);
})();