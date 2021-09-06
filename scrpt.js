
/*LOGICA*/

/*LOGICA DEL PROGRAMA*/

var VariableTermino = function (variable,esafirmacion) {
    this.variable = variable;
    this.esafirmacion = esafirmacion;
};

var FuncionBooleana = function(cantidadVariables, terminos) {
    this.cantidadVariables = cantidadVariables;
    this.terminos = terminos;
};

var TablaVerdad = function (fxbooleana) {
    this.fxbooleana = fxbooleana;

    this.crearTablaValores = function () {
        var matrizVariables = [];
        //crea una tabla [variable0s1s][agrupar0s1s][0s1s]
        for (var i = this.fxbooleana.cantidadVariables; i >= 1; i--) {
            var filaValoresVar = [];
            for (var j = Math.pow(2,this.fxbooleana.cantidadVariables-i); j >= 1; j--) {
                filaValoresVar.push(generateTrueTableBool(i));
            }
            matrizVariables.push(filaValoresVar);
        }

        var tv = [];
        //matriz vacia para la tabla de verdad con columna de resultados
        for (var i = 0; i < matrizVariables[0][0].length; i++) {
            tv.push(new Array(matrizVariables.length+1));
        }

        //llenar 0s y 1s en la matriz
        for (var i = 0; i < matrizVariables.length; i++) {
            for (var j = 0; j < matrizVariables[i].length; j++) {
                for (var k= 0; k < matrizVariables[i][j].length; k++) {
                    var aux = (matrizVariables[i][j].length*j) + k%(matrizVariables[i][j].length);
                    tv[aux][i]=matrizVariables[i][j][k];
                }
            }
        }
        return tv;
    }

    function generateTrueTableBool(cant){
        var columnBool = [];
        var cantBool = Math.pow(2, cant)/2;
        for (var i = 0; i < cantBool; i++) {
            columnBool.push(0);
        }
        for (var i = 0; i < cantBool; i++) {
            columnBool.push(1);
        }
        return columnBool;
    }

    this.tablaValores = this.crearTablaValores();

    this.calculateResultColumn = function() {
        for (var i = 0; i < this.tablaValores.length; i++) {
            var auxt = 0;
            for (var j = 0; j < this.fxbooleana.terminos.length; j++) {
                var auxv = 1;
                for (var k = 0; k < this.fxbooleana.cantidadVariables; k++) {
                    if(this.fxbooleana.terminos[j][k].esafirmacion) {
                        auxv *= this.tablaValores[i][k];
                    } else {
                        auxv *= (!this.tablaValores[i][k]);
                    }
                }
                auxt += auxv;
            }
            this.tablaValores[i][this.fxbooleana.cantidadVariables] = Boolean(auxt)*1;
        }
    }
};

var MapaKarnaugh = function(tablaVerdad) {
    var filasVars = [];
    var columnasVars = [];
    var coordenadasFilas = [];
    var coordenadasColumnas = [];

    function generarMatrizVacia(){
        var filasTV = tablaVerdad.tablaValores.length;
        var nfilas,ncolumnas; //las filas serán las mayores

        if (tablaVerdad.fxbooleana.cantidadVariables % 2 == 0) { //si la cantidad de ariables es par
            nfilas = Math.sqrt(filasTV);
            ncolumnas = nfilas;
            for (var i = 0; i < tablaVerdad.fxbooleana.cantidadVariables/2; i++) {//0 <4/2 //1
                filasVars.push(tablaVerdad.fxbooleana.terminos[0][i].variable); //ioA  //i1B
                columnasVars.push(tablaVerdad.fxbooleana.terminos[0][ i + tablaVerdad.fxbooleana.cantidadVariables/2].variable);//i2C //i3D
            }
        } else { //si es impar
            nfilas = Math.sqrt(filasTV*2);
            ncolumnas = nfilas/2;
            for (var i = 0; i < tablaVerdad.fxbooleana.cantidadVariables/2; i++) { //0 < 3/2 //1 \\5/2 \ 0\1\2
                filasVars.push(tablaVerdad.fxbooleana.terminos[0][i].variable); //i0A  //i1B \\i0A \ i1B\i2C
            }
            for (var i =Math.round(tablaVerdad.fxbooleana.cantidadVariables/2); i < tablaVerdad.fxbooleana.cantidadVariables; i++) { //2 < 3 \\3<5 \ 4
                columnasVars.push(tablaVerdad.fxbooleana.terminos[0][i].variable); //i2C  \\i3D \i4E
            }
        }
        
        var auxMK = [];
        for (var i = 0; i < nfilas; i++) {
            var varaux = [];
            for (var j = 0; j < ncolumnas; j++) {
                varaux.push(0);
            }
            auxMK.push(varaux);
        }
        return auxMK;
    }

    function llenarCoordenadas(matriz) {
        var bi = [[0],[1]];

        //colección de coordenadas por fila
        //ABC 3
        var boolAuxF = codigoGray(bi,filasVars.length);
        for (var i = 0; i < matriz.length; i++) {  //0 - 3 / 0
            var arraux = [];
            for (var j = 0; j < filasVars.length; j++) { //0-1 / 0 / 1 \\0 \ 1
                var varaux = new VariableTermino(filasVars[j],boolAuxF[i][j]); //fj0A,i0j0.0 / fj1B, i0j1.0 \\fj0A\i1j0.0\fj1B i1j0 0 \ i1j1.1
                arraux.push(varaux);
            }
            coordenadasFilas.push(arraux);
        }

        //colección de coordenadas por columna
        var boolAuxC = codigoGray(bi,columnasVars.length);
        for (var i = 0; i < matriz[0].length; i++) {  //0 - 1 / 0
            var arraux = [];
            for (var j = 0; j < columnasVars.length; j++) { //0-1 / 0 / 1 \\0 \ 1
                var varaux = new VariableTermino(columnasVars[j],boolAuxC[i][j]); //fj0A,i0j0.0 / fj1B, i0j1.0 \\fj0A\i1j0.0\fj1B i1j0 0 \ i1j1.1
                arraux.push(varaux);
            }
            coordenadasColumnas.push(arraux);
        }
    }


    function generarMatrizMapa() {
        var auxMK = generarMatrizVacia();
        llenarCoordenadas(auxMK);

        /*
        por cada fila agregar su correspondiente variable
        coorfila es coleccion de variables agrupadas
                 C0 C1
A0B0 |  x    x
A0B1 |  x    x
A1B1 |  x    x
A1B0 |  x    x
*/
        //por cada fila y columna hay coordenadas, buscar cordenadas en la tabla de verdad

        for (var i = 0; i < auxMK.length; i++) { 
            for (var j = 0; j < auxMK[0].length; j++) { 
                var auxBuscar = [];
                var buscar = "";
                for (var k = 0; k < coordenadasFilas[i].length; k++) {
                    auxBuscar.push(coordenadasFilas[i][k]);
                    buscar+=  "f" + coordenadasFilas[i][k].variable + coordenadasFilas[i][k].esafirmacion;
                }
                for (var k = 0; k < coordenadasColumnas[j].length; k++) {
                    auxBuscar.push(coordenadasColumnas[j][k]);
                    buscar+= "c" + coordenadasColumnas[j][k].variable + coordenadasColumnas[j][k].esafirmacion;
                }
                if(buscarResultEnTVPorCoordenadas(auxBuscar) == 1){
                    auxMK[i][j] = buscarResultEnTVPorCoordenadas(auxBuscar);
                }
            }
        }
        return auxMK;
    }


        /*
     A           B          C            S
0[0][0] 0[0][1] 0[0][2]   [0][3]
0[1][0] 0[1][1] 1[1][2]   [1][3]
0[2][0] 1[2][1] 0[2][2]   [2][3]
0[3][0] 1[3][1] 1[3][2]   [3][3]
1[4][0] 0[4][1] 0[4][2]   [4][3]
1[5][0] 0[5][1] 1[5][2]   [5][3]
1[6][0] 1[6][1] 0[6][2]   [6][3]
1[7][0] 1[7][1] 1[7][2]   [7][3]

        colocar por coordenadas
                        C0[0]  C1[1]
A0B0 [0] | [0][3]  [1][3]
A0B1 [1] | [2][3]  [3][3]
A1B1 [2] | [6][3]  [7][3]
A1B0 [3] | [4][3]  [5][3]

Por cada fila de la matriz busco en la tabla de verdad las coordenadas
por cada columna de la matriz busco en la tabla de verdad las coordenadas
        */

    function buscarResultEnTVPorCoordenadas(arrayVariables) { //A1B0C1
        //var txt = "";
        for (var i = 0; i < tablaVerdad.tablaValores.length; i++) { //0-7 /0 // 4
            //txt+= "|";
            for (var j = 0; j < tablaVerdad.fxbooleana.cantidadVariables; j++) { //0-2 /0 //0/1/2
                //txt+= ","+tablaVerdad.tablaValores[i][j]+arrayVariables[j].variable+arrayVariables[j].esafirmacion+",";
                if (tablaVerdad.tablaValores[i][j]==arrayVariables[j].esafirmacion) { //tv40.1=av0.1? / tv41.0=av1.0?/tv42.0=av2.1?
                    if ( j == tablaVerdad.fxbooleana.cantidadVariables-1) {
                        //txt+= "+"+tablaVerdad.tablaValores[i][tablaVerdad.fxbooleana.cantidadVariables];
                        return  tablaVerdad.tablaValores[i][tablaVerdad.fxbooleana.cantidadVariables];
                    }
                } else {break;}
            }
        }
    }

    var codigoGray = function (arrayGray,cantVarheader) {//[0][1]
        if (cantVarheader > 1 ) {
            var auxgray = [];
            for (var i = 0; i < arrayGray.length; i++) {
                var aux = [0];
                for (var j = 0; j < arrayGray[i].length; j++) {
                    aux.push(arrayGray[i][j]);
                }
                auxgray.push(aux);
            }
            for (var i = arrayGray.length - 1; i >= 0; i--) {
                var aux = [1];
                for (var j = 0; j < arrayGray[i].length; j++) {
                    aux.push(arrayGray[i][j]);
                }
                auxgray.push(aux);
            }

            if (auxgray.length<Math.pow(2,cantVarheader)) {
                return codigoGray(auxgray,cantVarheader);
            } else {
                return auxgray;
            }
        } else {
            return arrayGray;
        }
    };


    /*GENERAR AGRUPACIONES*/
    function generarAgrupaciones(matriz){
        var arrayCoordenadasUnos = [];
        var txtAux ="";

        /*Reconocer Coordenadas de los 1s*/
        for (var i = 0; i < coordenadasFilas.length; i++) {
            for (var j = 0; j < coordenadasColumnas.length; j++) {
                if (Boolean(matriz[i][j])) {
                    var auxAgrup = [];
                    for (var k = 0; k < filasVars.length; k++) {
                        auxAgrup.push(coordenadasFilas[i][k]);
                    }
                    for (var k = 0; k < columnasVars.length; k++) {
                        auxAgrup.push(coordenadasColumnas[j][k]);
                    }
                    var auxGroupGroup = []; //para que entre en la funcion recursiva
                    auxGroupGroup.push(auxAgrup)
                    arrayCoordenadasUnos.push(auxGroupGroup);
                }
            }
        }

        var agruparCoordenadas = function (arrayAcumulado,arrayAnterior,cantVarAgrup) {
            //iniciamos con 4 o 3. Usamos el array acumulado y el array nuevo simplificado
            //arrayacumulado llena todas las agrupaciones
            //arrayAnterior solo las del resultado de esta
            //cantVarAgrup es la cantidad de variables que habrá a abreviar
            this.arrayAcumulado = arrayAcumulado;
            var auxArrayNuevo = [];

            if (arrayAnterior.length > 1) {
                for (var i = 0; i < cantVarAgrup; i++) {
                    for (var j= 0; j < arrayAnterior.length; j++) {
                        var posResult = arrayAnterior[j].length-1;

                        var auxCoordenadasABuscar = [];
                        Array.prototype.push.apply(auxCoordenadasABuscar, arrayAnterior[j][posResult]);
                        auxCoordenadasABuscar.splice(i,1);

                        var auxCoincidentes = [];
                        
                        if (j+1 < arrayAnterior.length) {
                            for (var k = j+1; k < arrayAnterior.length; k++) {
                                
                                var auxCoordenadaCoincidente = [];
                                Array.prototype.push.apply(auxCoordenadaCoincidente, arrayAnterior[k][posResult]);
                                auxCoordenadaCoincidente.splice(i,1);
                                var escoincidente = false;

                                if (arrayAnterior[k][posResult][i].variable == arrayAnterior[j][posResult][i].variable){
                                    if (arrayAnterior[k][posResult][i].esafirmacion != arrayAnterior[j][posResult][i].esafirmacion){
                                        for (var v = 0; v < auxCoordenadasABuscar.length; v++) {
                                            if (auxCoordenadaCoincidente[v].variable == auxCoordenadasABuscar[v].variable){
                                                if (auxCoordenadaCoincidente[v].esafirmacion == auxCoordenadasABuscar[v].esafirmacion) {
                                                    escoincidente = true;
                                                } else {escoincidente=false; break;}
                                            } else {escoincidente=false; break;}
                                        }
                                    }
                                } else {escoincidente=false; break;}
                              txtAux+= "-"; 

                                if (escoincidente==true) {
                                    auxCoincidentes.push(arrayAnterior[k][posResult]);
                                }
                            }
                        }
                        if (auxCoincidentes.length>0) {
                            auxCoincidentes.unshift(arrayAnterior[j][posResult]);
                            auxCoincidentes.push(auxCoordenadasABuscar);
                            auxArrayNuevo.push(auxCoincidentes);
                        } 
                    }
                }
                Array.prototype.push.apply(this.arrayAcumulado, auxArrayNuevo);
                cantVarAgrup --;

                if (cantVarAgrup>1 ) {
                    return agruparCoordenadas(this.arrayAcumulado,auxArrayNuevo,cantVarAgrup);
                } else {return this.arrayAcumulado;}
            }
            return this.arrayAcumulado;
        };

        var auxAgrupaciones = agruparCoordenadas(arrayCoordenadasUnos,arrayCoordenadasUnos,tablaVerdad.fxbooleana.cantidadVariables);
        //alert(auxAgrupaciones[0][0]);
        Array.prototype.push.apply(auxAgrupaciones);

        return auxAgrupaciones;
    }



    this.tablaVerdad = tablaVerdad;
    this.filasVars = filasVars;
    this.columnasVars = columnasVars;
    this.coordenadasFilas = coordenadasFilas;
    this.coordenadasColumnas = coordenadasColumnas;
    this.matrizMapa = generarMatrizMapa();
    this.agrupaciones = generarAgrupaciones(this.matrizMapa);
};

/*INTERFACE*/
$(document).ready(function() {

var varsunkn = ['A','B','C','D','E','F'];
//var terminosAgrupados = new Array();
var funcionBooleana = {};
var tablaVerdad = {};
var mapakarnaugh = {};

function addTerm(cantidad) {
    var termHtml = '<div class="term">';
    var variablesTermino = [];
    for (var i = 0; i < cantidad; i++) {
        var varTerm = new VariableTermino(varsunkn[i],true);
        variablesTermino.push(varTerm);
        termHtml += '<button class="term-var" value=' + varTerm.esafirmacion+ '>'+varTerm.variable+'</button>';
    }
    funcionBooleana.terminos.push(variablesTermino);
    termHtml += '</div>';

    return termHtml;
};

function actualizarResultadoTablaVerdad() {
    tablaVerdad.calculateResultColumn();
    actualizarMapaKarnaugh();

    for (var i = 0; i < tablaVerdad.tablaValores.length; i++) {
        $('#true-table tbody tr:nth-child('+ (i+1) +') td.result').removeClass('r-true');
        $('#true-table tbody tr:nth-child('+ (i+1) +') td.result').html(tablaVerdad.tablaValores[i][funcionBooleana.cantidadVariables]);
        if (tablaVerdad.tablaValores[i][funcionBooleana.cantidadVariables]) {
            $('#true-table tbody tr:nth-child('+ (i+1) +') td.result').addClass('r-true');
        }
    }
}

function actualizarMapaKarnaugh() {
    mapakarnaugh = new MapaKarnaugh(tablaVerdad);

    $("#kVarsHvalues").html("");
    $("#kVarsVvalues").html("");
    $("#k-map").html("");
    $("#k-agrupaciones").html("");

    //$("#Karnaugh");
    $("#kVarsH").html(mapakarnaugh.columnasVars);
    for (var i = 0; i < mapakarnaugh.coordenadasColumnas.length; i++) {
        var auxtxt="<div>";
        for (var j = 0; j < mapakarnaugh.coordenadasColumnas[i].length; j++) {
            auxtxt += (mapakarnaugh.coordenadasColumnas[i][j].esafirmacion*1);
        }
        auxtxt+= "</div>";
        $("#kVarsHvalues").append(auxtxt);
    }
    $("#kVarsV").html(mapakarnaugh.filasVars);
    for (var i = 0; i < mapakarnaugh.coordenadasFilas.length; i++) {
        var auxtxt="<div>";
        for (var j = 0; j < mapakarnaugh.coordenadasFilas[i].length; j++) {
            auxtxt += (mapakarnaugh.coordenadasFilas[i][j].esafirmacion*1);
        }
        auxtxt+= "</div>";
        $("#kVarsVvalues").append(auxtxt);
    }

    var auxTxtMapa = "";
    for (var i = 0; i < mapakarnaugh.matrizMapa.length; i++) {
        auxTxtMapa += "<tr>";
        for (var j = 0; j < mapakarnaugh.matrizMapa[i].length; j++) {
            auxTxtMapa += "<td ";
            if (mapakarnaugh.matrizMapa[i][j]==1) {auxTxtMapa += 'class="r-true"';}
            auxTxtMapa += ">"+mapakarnaugh.matrizMapa[i][j];+"<td>";
        }
        auxTxtMapa += "</tr>";
    }
    $("k-map").css("height","calc(50px*"+mapakarnaugh.matrizMapa.length+")");
    $("k-map").css("width","calc(50px*"+mapakarnaugh.matrizMapa[0].length+")");
    $("#k-map").append(auxTxtMapa);
    for (var i = 0; i < mapakarnaugh.agrupaciones.length; i++) {
        if (mapakarnaugh.agrupaciones[i].length-1!=0) {
            var agrupacionHtml = "<li>";
            for (var j = 0; j < mapakarnaugh.agrupaciones[i].length; j++) {
                if ( j == (mapakarnaugh.agrupaciones[i].length-1)) { agrupacionHtml+= " = "; } else { agrupacionHtml+= "[ "; }
                for (var k = 0; k < mapakarnaugh.agrupaciones[i][j].length; k++) {
                    agrupacionHtml+= mapakarnaugh.agrupaciones[i][j][k].variable + mapakarnaugh.agrupaciones[i][j][k].esafirmacion*1 + " ";
                }
                if ( j != (mapakarnaugh.agrupaciones[i].length-1)) { agrupacionHtml+= "]"; }
            }
            agrupacionHtml += "</li>";
            $("#k-agrupaciones").append(agrupacionHtml);
        }
    }
    var txtFxResultante = "f = ";
    for (var i = 0; i < mapakarnaugh.agrupaciones.length; i++) {
        var posResult = mapakarnaugh.agrupaciones[i].length-1;
        var auxResultAgrup = mapakarnaugh.agrupaciones[i][posResult];
        if (posResult!=0) {
            for (var k = 0; k < auxResultAgrup.length; k++) {
                txtFxResultante+= auxResultAgrup[k].variable;
                if (auxResultAgrup[k].esafirmacion == 0) {txtFxResultante+="'";}
            }
            if ( i != mapakarnaugh.agrupaciones.length-1) {
                txtFxResultante+= " + ";
                if ( i != 0 && i % 3 == 0) {
                    txtFxResultante+= " </br> ";
                }
            }
        }
    }
    $("#fx-result").html(txtFxResultante);//f = ABC  +  AB'C
    
}
$("#cant-vars button").click(function(event) {
    for (var i = 0; i < $("#cant-vars").children().length; i++) {
        $(this).parent().children(i).removeClass('btnCircleActive');
    }
    $(this).addClass('btnCircleActive');
    var cant = $(this).attr('value');
    $("#terms-fx").html('f = ');
    funcionBooleana = new FuncionBooleana(cant,new Array());
    //Se ingresa el primer valor por default
    $("#terms-fx").append(addTerm(cant));
    //GENERANDO LA TABLA DE VERDAD y el mapa
    tablaVerdad = new TablaVerdad(funcionBooleana);

    //Colocando las cabeceras
    $("#true-table").html("");
    $("#true-table").append('<thead><tr><td class="tr-count">N</th><th>S</th></tr></thead>')
    for (var i = cant-1; i >= 0 ; i--) {
        $("#true-table .tr-count").after('<th>'+varsunkn[i]+'</th>');
    }

    //generar vista de tabla de verdad
    var cuerpoTablaVHtml = '<tbody>';
    for (var i = 0; i < tablaVerdad.tablaValores.length; i++) {
        cuerpoTablaVHtml += '<tr><td class="tr-count">'+(i+1)+'</td>';
        for (var j = 0; j < tablaVerdad.tablaValores[i].length-1; j++) {
            cuerpoTablaVHtml += '<td>'+tablaVerdad.tablaValores[i][j];+'</td>';
        }
        cuerpoTablaVHtml += '<td class="result"></td></tr>'; //class r-true
    }
    cuerpoTablaVHtml += '</tbody>';
    $("#true-table").append(cuerpoTablaVHtml);
    actualizarResultadoTablaVerdad();
});

//Inicializando el botón de delete en estado
var isdeleteactive = false;

//agregar terminos
$( "#term_add" ).click(function( event ) {
    if (funcionBooleana.cantidadVariables!=null) {
        $("#terms-fx div:last-child").after('<span> + </span>' + addTerm(funcionBooleana.cantidadVariables));
    } else { alert("No se ha determinado la cantidad de variables");}
    if (isdeleteactive) {highlightTermDel();}
    actualizarResultadoTablaVerdad();
});

//eliminar terminos
$("#t-delete-msj").attr("hidden",true);

function highlightTermDel() {
    $("#terms-fx .term").on( "mouseenter", function (event) {
        $(this).removeClass('todelete');
        $(this).addClass('todelete');
    });
    $("#terms-fx .term").on( "mouseleave", function (event) {
        $(this).removeClass('todelete');
    });
};

$( "#term_delete" ).click(function( event ) {
    if ($("#terms-fx").children().length == 0) {
        alert("No hay elementos a eliminar");
        return;
    }
    if (isdeleteactive == false) {
        $("#t-delete-msj").attr("hidden",false);
        $("#term_delete").addClass('btnCircleActive');
        isdeleteactive = true;
        highlightTermDel();
    } else if (isdeleteactive == true) {
        $("#t-delete-msj").attr("hidden",true);
        $("#term_delete").removeClass('btnCircleActive');
        $("#terms-fx .term").unbind('mouseenter mouseleave');
        isdeleteactive = false;
    }
});

$("#terms-fx").on("click", "button.term-var", function(event){
    var termPos = $(this).parent().index("#terms-fx .term");

    if (isdeleteactive) {
        if ($( "#terms-fx").children().length>1) {
            if ($(this).parent().index() == 0) {
                $("#terms-fx span")[termPos].remove();
            }
            else {
                $("#terms-fx span")[termPos-1].remove();
            }
            funcionBooleana.terminos.splice(termPos,1);
            actualizarResultadoTablaVerdad();
            $( this ).parent().remove();
        }
        else { alert("Una funcion debe tener al menos un término"); }
    }
        /* si el botón de delete no está activo
        los botones sobre las variables son para negarlas o afirmarlas*/
    else {
        var vartxt = $(this).html();
        if ($(this).attr('value') == "true") { //si la variable está sin negar
            vartxt += "'";
            funcionBooleana.terminos[termPos][$(this).index()].esafirmacion = false;
            $(this).attr('value',false);
        }
        else { //si la variable está negada
            vartxt = vartxt.charAt(0);
            funcionBooleana.terminos[termPos][$(this).index()].esafirmacion = true;
            $(this).attr('value',true);
        }
        $(this).html(vartxt);
        actualizarResultadoTablaVerdad();
    }
});

//OCULTAR/MOSTRAR LINEAS DE AGRUPACIONES
var esactivoagrupaciones = true;
$("#km-group-visibility").click(function(event) {
    /* Act on the event */
    if (esactivoagrupaciones) {
        $("#kResults .group").attr("hidden",true);
        $("#km-group-visibility").html("Mostrar agrupaciones");
        esactivoagrupaciones = false;
    } else {
        $("#kResults .group").attr("hidden",false);
        $("#km-group-visibility").html("Ocultar agrupaciones");
        esactivoagrupaciones = true;
    }
});


});
