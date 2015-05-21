(function() {
    'use strict';

    angular
        .module('app')
        .controller('pController', PruebaController);

    PruebaController.$injector = [];

    function PruebaController() {
        var vm = this;

        vm.nombre = 'nana2';

        console.log("hola", vm.nombre);
    }
})();