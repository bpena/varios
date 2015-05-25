(function() {
    'use strict';

    angular
        .module('app')
        .controller('pController', PruebaController);

    PruebaController.$injector = [];

    function PruebaController() {
        var vm = this;

        vm.nombre = "12,20022";

        console.log("hola", vm.nombre);
    }
})();