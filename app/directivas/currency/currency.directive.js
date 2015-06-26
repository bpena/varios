(function() {
    'use strict';

    angular
        .module('app')
        .directive('currency', currency);

    currency.$injector = [
        '$filter',
        '$locale'
    ];

    function currency($filter, $locale) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                min: '=min',
                max: '=max',
                useSymbol: '@',
                ngRequired: '=ngRequired',
                decimalLen: '=decimalLen'
            },
            link: function(scope, element, attrs, ngModel) {
                var SEPARADOR_MILES = $locale.NUMBER_FORMATS.GROUP_SEP;
                var SEPARADOR_DECIMAL = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                var insertaComa = false;

                /**
                 * Capturamos el evento cuando se presiona una tecla en el componente
                 */
                element.bind('keypress', function(event) {
                    if (String.fromCharCode(event.charCode) == SEPARADOR_MILES) // utilizamos el punto como separador decimal (sólo el primero)
                        insertaComa = this.value.indexOf(SEPARADOR_DECIMAL) == -1;
                    else if (event.keyCode == 32) // controlamos cuando pulsamos barra espaciadora, y eliminamos el caracter
                        toModel(this.value);
                });

                /**
                 * Capturamos el evento cuando se deja de presionar una tecla
                 */
                element.bind('keyup', function (event) {
                    if (event.keyCode == 32) // controlamos cuando la tecla pulsada era la barra espacioadora
                        toModel(this.value);// y eliminamos el caracter
                });

                /**
                 * Damos formato al texto cuando dejamos el elemento
                 */
                element.on("blur", function () {
                    element.val(toView(this.value));
                });

                /**
                 * Quitamos el formato del texto cuando el elemento obtiene el foco
                 */
                element.on("focus", function () {
                    toModel(this.value);
                });

                /**
                 * Retorna el simbolo de moneda en caso que se utilice alguno
                 * @returns {*} - el simbolo de moneda a utilizar
                 */
                function currencySymbol() {
                    if (angular.isDefined(scope.useSymbol) && scope.useSymbol) { // si está definido el usar moneda y este es un simbolo
                        return scope.useSymbol;                             // entonces usamos dicho simbolo
                    } else if (angular.isDefined(scope.useSymbol)) {             // en caso que solo se ha indicado que use el simbolo
                        return $locale.NUMBER_FORMATS.CURRENCY_SYM;              // entonces se usa el simbolo de moneda por defecto
                    } else {                                                     // si no se ha defeinido el useSymbol
                        return null;                                             // retornamos null
                    }
                }

                /**
                 * Arma una expresión regular para búsqueda del parámetro indicado
                 * @param dChar - el parámetro a buscar
                 * @returns {*} la expresión regular retornada
                 */
                function regExp(dChar) {
                    return new RegExp("\\" + dChar, 'gi');
                }

                /**
                 * Arma una expresión regular para validar números decimales
                 * utilizando la constante SEPARADOR_DECIMAL
                 * @returns {*}
                 */
                function decimalRex() {
                    return new RegExp("[^0-9"+SEPARADOR_DECIMAL+"\-]", 'gi');
                }

                /**
                 * Este método se encarga de dar formato al texto que vemos en el componente
                 * @param text - el texto que recibirá el formato
                 * @returns Number texto formateado
                 */
                function toModel(text) {
                    // Eliminamos el simbolo de moneda
                    text = text.replace(currencySymbol(), '');

                    // Eliminamos todos los 'separadores de miles' de la cadena de texto
                    if (regExp(SEPARADOR_MILES).test(text)) {
                        if (insertaComa) // en caso de querer que el separador de miles se cambie por el separador decimal.
                            text = text.replace(regExp(SEPARADOR_MILES), SEPARADOR_DECIMAL);
                        else // de lo contrario, eliminamos todos los separadores de miles
                            text = text.replace(regExp(SEPARADOR_MILES), '');

                        insertaComa = false;
                    }

                    // Eliminamos todos los signos negativos, excepto el que se encuentre al inicio de la cadena
                    if (text.length > 0)
                        text = text.substring(0,1) + text.substr(1, text.length).replace(regExp('-'), '');

                    // Eliminamos todas los separadores decimales repetidas, excepto el primero
                    var pos = text.indexOf(SEPARADOR_DECIMAL);
                    if (pos == 0 && text.lastIndexOf(SEPARADOR_DECIMAL)==pos) { // si el primero se encuentra en la posición cero,
                        text = '0' + text;  // agregamos un cero al inicio
                        pos = 1;
                    }
                    if (pos > 0) // eliminamos todos los separadores decimales repetidos
                        text = text.substring(0, pos+1) + text.substring(pos, text.length).replace(regExp(SEPARADOR_DECIMAL), '');
                    else if (pos == 0)
                        text = text.substring(1, text.length);

                    // Límpiamos lo que queda de la cadena, para eliminar lo que no sea permitido.
                    text = text.replace(decimalRex(), '');

                    // almacenamos la posición del cursor, para restaurarla luego de hacer el render
                    var cursorPos = element[0].selectionStart;
                    if (element[0].value != text) // si hay algún tipo de modificación en el texto
                        cursorPos--;              // entonces ajustamos la posición del cursor
                    // Ajustamos lo que se ve en la pantalla
                    ngModel.$setViewValue(text);
                    ngModel.$render();
                    // reubicamos el cursor a la posición que corresponde
                    element[0].selectionStart = cursorPos;
                    element[0].selectionEnd = cursorPos;

                    // Retornamos el texto formateado
                    if (text)
                        return parseFloat(text.replace(regExp(SEPARADOR_DECIMAL), '.'));
                    else
                        return null;
                }

                /**
                 *
                 * @param value
                 * @returns {Number}
                 */
                function toView(value) {
                    if (!currencySymbol())
                        return $filter('number')(value, scope.decimalLen);
                    else
                        return $filter('currency')(value, currencySymbol(), scope.decimalLen);
                }

                /**
                 * Convierte lo que está en la vista y le quita el formato y lo pasa al modelo
                 */
                ngModel.$parsers.push(function(viewValue) {
                    return toModel(viewValue);
                });

                /**
                 * Convierte el modelo en la vista, dandole el formato que necesite para ser visualizado correctamente.
                 */
                ngModel.$formatters.unshift(function(modelValue) {
                    runValidations(modelValue);
                    return toView(modelValue);
                });

                /**
                 * Un whatcher sobre el modelo, para que al realizar cambios se ejecute la validación.
                 */
                scope.$watch(function () {
                    return ngModel.$modelValue
                }, function (newValue, oldValue) {
                    runValidations(newValue);
                });

                /**
                 * Ejecuta las validaciones creadas para la directiva, y
                 * @param cVal
                 */
                function runValidations(cVal) {
                    if (isNaN(cVal)) {
                        ngModel.$setValidity(false);
                    }
                    if (scope.ngRequired && !cVal) {
                        ngModel.$setValidity(false);
                    }
                    if (scope.min) {
                        var min = parseFloat(scope.min);
                        ngModel.$setValidity('min', cVal >= min);
                    }
                    if (scope.max) {
                        var max = parseFloat(scope.max);
                        ngModel.$setValidity('max', cVal <= max);
                    }
                }
            }
        }
    }
})();