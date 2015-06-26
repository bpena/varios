'use strict';

// la palabra reservada 'describe' es usada para definir un conjunto de pruebas.
describe('currency directive', function() {
    // declaramos algunas variables globales que serán usadas en las pruebas.
    var element,    // el elemento de la directiva (jqLite)
        scope;      // el ámbito donde la directiva es insertada

    // cargamos los módulos que queremos probar
    beforeEach(module('app'));

    /**
     * antes de cada prueba, creamos un ámbito nuevo
     * el método inject hace uso de la inyección de dependencias
     * de angularJS para obtener otros servicios en las pruebas
     * acá necesitamos el $rootScope para crear un nuevo ámbito.
     */
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.numero = 23.3;
    }));

    /**
     * función para compilar una directiva fresca XD. Con una plantilla dada o con una predeterminada
     * Compila la plantilla (tpl) con el $rootScope creado arriba.
     * Encapsula la directiva dentro de un formulario, para que sea posible probar
     * que la integración con los formularios funciona bien. (via ngModelController)
     * Al final, la instancia de la directiva es colocada en la variable global element,
     * para que sea posible utilizarla en otras pruebas.
     * @param tpl - la plantilla a compilar.
     */
    function compileDirective(tpl) {
        if (!tpl) tpl = '<input name="directiva" data-currency data-ng-model="numero" />';
        tpl = '<form name="form">' + tpl + '</form>';

        // inject permite utilizar la inyección de dependencias de angularJS
        // para obtener y utilizar otros servicios.
        inject(function($compile) {
            var form = $compile(tpl)(scope);
            element = form.find('input');
        });

        // $digest es necesario para finalizar la generación de la directiva
        scope.$digest();
    };

    describe('inicialización', function(){
        // antes de cada prueba en este bloque, generamos una nueva directiva.
        beforeEach(function() {
            compileDirective();
        });

        it('debe comprobar la validación al iniciar ', function() {
            scope.numero = null;
            expect(scope.form.$valid).toBeTruthy();
        });

        it('debe ser correcto con un número positivo', function() {
            expect(scope.numero).toBe(23.3);
        });

        it('debe ser correcto con un número negativo', function() {
            scope.numero = -23.3;
            expect(scope.numero).toBe(-23.3);
        });

        it('debe ajustar cuando se introduce un texto', function() {
            scope.form.directiva.$setViewValue('as12');
            scope.$digest();
            expect(scope.numero).toBe(12);
        });

        it('debe mostrar el simbolo de moneda', function() {
            compileDirective('<input name="directiva" data-currency data-ng-model="numero" data-use-symbol="Bs." />');
            expect(scope.form.directiva.$viewValue).toBe('Bs.23.30');
        });

        it('debe mostrar la cantidad correcta de decimales', function() {
            compileDirective('<input name="directiva" data-currency data-ng-model="numero" decimal-len="5" />');
            expect(scope.form.directiva.$viewValue).toBe('23.30000');
        })

    });

    describe('validaciones', function() {
        it('debe validar cuando es requerido', function() {
            scope.numero = null;
            compileDirective('<input data-currency data-ng-model="numero" data-ng-required="true" />');
            expect(scope.form.$valid).toBeFalsy();
        });

        it('debe validar el rango mínimo permitido', function() {
            compileDirective('<input data-currency data-ng-model="numero" data-min="100" />');
            expect(scope.form.$valid).toBeFalsy();
        });

        it('debe validar el rango máximo permitido', function() {
            compileDirective('<input data-currency data-ng-model="numero" data-max="10" />');
            expect(scope.form.$valid).toBeFalsy();
        });


    })
});