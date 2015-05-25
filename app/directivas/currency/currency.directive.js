(function() {
    'use strict';

    angular
        .module('app')
        .directive('ptCurrency', ptCurrency);

    ptCurrency.$injector = [
        '$log', 
        '$filter',
        '$locale'
    ];

    function ptCurrency($log, $filter, $locale) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                var SEPARADOR_MILES = '.';
                var SEPARADOR_DECIMAL = ',';

                function fromUser(text) {
                    console.log('text', text.indexOf(SEPERADOR_DECIMAL))
                    if (text.indexOf(SEPERADOR_DECIMAL) >= 0)
                        text = text.replace(/[SEPERADOR_DECIMAL]/gi, '');
//                    text = text.replace(/[.]/g, ',');
                    var transformedInput = text.replace(/[^0-9,\-]/gi, '');
                    console.log('transformado', transformedInput);
                    if(transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                };

                function clear(value){
                    return value.replace()
                };

                ngModelCtrl.$parsers.push(fromUser);

                ngModelCtrl.$formatters.push(function toView(value) {
                    $log.info('formatters', $filter('number')(value, 2));
                    return $filter('number')(value);
                })
            }
        }
    }
})();