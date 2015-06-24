# Varios

En este proyecto pretendo hacer unas cuantas directivas, como currency para el ingreso de montos/moneda, date para 
ingreso de fechas (quizás usando bootstrap como base), una directiva para rangos de montos y otra para rangos de 
fechas.

Estas directivas están basadas para usarlas en mi trabajo actual, sobretodo las de fechas, pero creo que pueden servir
a cualquiera.

## Directivas
### currency
La directiva currency le da el poder a un campo de texto HTML de permitir el ingreso de valores decimales bien formados.

Hace uso del $locale, por lo que puedes importar y usar el archivo locale correspondiente a tu país y con eso 
automágicamente usará el formato correcto para mostrar los montos en el campo de texto.

Tiene los siguientes atributos:
1. min y max, para definir rangos de valores válidos.
2. useSymbol, si no se agrega tonces no muestra simbolo de moneda, si se agrega usa el simbolo de moneda por defecto, si se agrega y se indica el simbolo de moneda a utilizar, tonces usa este simbolo. (use-symbol = "Bs.")
3. decimalLen, indica la longitud decimal

## Contacto

http://twitter.com/bpena