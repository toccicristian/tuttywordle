jsonFileUrl="../p5l.json"; // habilitar para liveserver y deshabilitar para github pages
// jsonFileUrl="./p5l.json";  //deshabilitar con liveserver y habilitar para github pages

 function cargar_palabras(jsonFileUrl){
     return fetch(jsonFileUrl).then((response) => response.json()).then((j) => {
         let arr = Object.keys(j);
         let randomindex = Math.floor(Math.random() * arr.length);
         return j[randomindex];
     })
 }

class TablaLetras{
    constructor (){
        this.tabla = {};
    }

    cuenta_letra (l){
        let tlista = Object.keys(this.tabla);
        for (let i = 0; i < tlista.length;i++){
            if(tlista[i] == l){
                return this.tabla[l];
            }
        }
        return 0;
    }

    agrega_letra(l){

        if (this.cuenta_letra(l) == 0){
            this.tabla[l] = 0;
        }
        this.tabla[l]++;
        return this.tabla[l];
    }

    resta_letra(l){
        if (this.cuenta_letra(l) == 0){
            return false;
        }
        this.tabla[l]--;
        return this.tabla[l];
    }
}

class PalabraDelDia{
    constructor (){
        this.palabradeldia = cargar_palabras(jsonFileUrl).then( x => {return x});

    }
    get string (){
        return this.palabradeldia
    }
}

class PalabraIngresada{
    constructor(palabraingresada){
        this.palabraingresada=palabraingresada;
    }
    get normalizada(){
        var norm = this.palabraingresada.toString().toUpperCase();
        return norm;    
    }
}

class Teclado{
    constructor(){
        this.abecedario="QWERTYUIOPASDFGHJKLÑZXCVBNM";
        this.teclas={};
        for (let i=0; i < this.abecedario.length; i++){
            this.teclas[this.abecedario[i]]=this.abecedario[i];
        }
    }
    anula_tecla(t){
        this.teclas[t]="_";
    }

    get teclado(){
        this.tecladostr=""
        for (let i = 0; i < this.abecedario.length; i++){
            if (this.abecedario[i] == "A"){
                this.tecladostr = this.tecladostr + "&nbsp&nbsp";
            }
            if (this.abecedario[i] == "Z"){
                this.tecladostr = this.tecladostr + "&nbsp&nbsp&nbsp&nbsp";
            }
            this.tecladostr = this.tecladostr + '<div class="tecla">' + this.teclas[this.abecedario[i]]+"</div>";
            if((this.abecedario[i] == "T") || 
               (this.abecedario[i] == "G") || 
               (this.abecedario[i] == "B")){
                this.tecladostr = this.tecladostr + "&nbsp&nbsp";
            }
            if ((this.abecedario[i] == "P") || 
                (this.abecedario[i] == "Ñ") || 
                (this.abecedario[i] == "M")){
                    this.tecladostr = this.tecladostr + "<br>";
            }
        }
        return this.tecladostr;
    }

    muestra_teclas(){
        const teclado = document.getElementById("teclado");
        teclado.innerHTML=""
        for (let i = 0; i < this.abecedario.length; i++){
            if (this.abecedario[i] == "A"){
                teclado.innerHTML = teclado.innerHTML + "&nbsp&nbsp";
                }
            if (this.abecedario[i] == "Z"){
                teclado.innerHTML = teclado.innerHTML + "&nbsp&nbsp&nbsp&nbsp";
                }
            teclado.innerHTML=teclado.innerHTML+"["+this.teclas[this.abecedario[i]]+"]";
            if ((this.abecedario[i] == "T") || 
                (this.abecedario[i] == "G") || 
                (this.abecedario[i] == "B")){
                    teclado.innerHTML = teclado.innerHTML + "&nbsp&nbsp";
            }
            if ((this.abecedario[i] == "P") || 
                (this.abecedario[i] == "Ñ") || 
                (this.abecedario[i] == "M")){
                    teclado.innerHTML = teclado.innerHTML + "<br>";
            } 
        }
    }
}

function cant_letra(letra,arr){
    var cantletra=0;
    for (let i = 0; i < arr.length; i++){
        if (arr[i] == letra){
            cantletra +=1
        }
    }
    return cantletra;
}

function aciertos (pdeldia, pingresada){
    resultados=[];
    var acierto = "a";
    var parcial = "p";
    var error = "e";

    for (i = 0; i < pingresada.length; i++){

        resultados.push([pingresada[i],error]);

        for (j = 0; j < pdeldia.length; j++){
            if (pingresada[i] == pdeldia[j]){
                resultados[i] = [pingresada[i],parcial];
            }
        }

        if (pingresada[i] == pdeldia[i]){
            resultados[i] = [pingresada[i], acierto];
        } 
    }

    let tabla_ingresada = new TablaLetras();
    let tabla_deldia = new TablaLetras();
    for (let i = 0; i < pingresada.length; i ++){
        tabla_ingresada.agrega_letra(pingresada[i]);
        tabla_deldia.agrega_letra(pdeldia[i]);
    }
    for (let i = 0; i < pingresada.length; i ++){
        if ((tabla_deldia.cuenta_letra(pingresada[i]) < tabla_ingresada.cuenta_letra(pingresada[i]))
        && (resultados[i][1] != acierto)){
            resultados[i][1] = error;
            tabla_ingresada.resta_letra(pingresada[i]);
        }
    }
    return resultados;
}


var palabra = new PalabraDelDia();
var teclado = new Teclado();
var doc_adivinando=document.getElementById("adivinando");
var doc_teclado = document.getElementById("teclado");
var doc_boton = document.getElementById("boton-probar");
var doc_entrada = document.getElementById("entrada");
var doc_mensajes = document.getElementById("mensajes");
var intentos=0;


function probar(){
    if (doc_entrada.value.length!=5){
        doc_mensajes.innerHTML='<p class="error">LA PALABRA INGRESADA DEBE CONTAR CON 5 CARACTERES</p>';
        return false;
    }
    var pingresada = new PalabraIngresada(entrada.value);
    palabra.string.then(x => {
        var a = aciertos(x, pingresada.normalizada);

        //ACOMODO LAS LETRAS EN PANTALLA:
        var anteriores="";
        if (intentos>0){
            anteriores = doc_adivinando.innerHTML+"<br>";
        }
        doc_adivinando.innerHTML=anteriores;
        clase ="";
        for(let i = 0; i < a.length; i++){
            if(a[i][1] == 'a'){clase="acierto";
            }
            if(a[i][1] == 'p'){clase="parcial";
            }
            if(a[i][1] == 'e'){clase="letra-error";
                teclado.anula_tecla(a[i][0]);
                doc_teclado.innerHTML = teclado.teclado;
                
            }
            doc_adivinando.innerHTML=doc_adivinando.innerHTML+'<div class="letra '+clase+'">&nbsp'+a[i][0]+'&nbsp</div>';
        }
        //REVISO SI GANE:
        var ganaste = true;
        for (let i = 0; i < a.length; i ++){
            if (a[i][1] != "a"){ganaste = false;
            }
        }
        //SI GANE INFORMO, DETENGO EL BOTON Y SALGO
        if (ganaste == true){
            doc_mensajes.innerHTML='<p class="error"> GANASTE!!!!';
            doc_boton.removeEventListener("click",arguments.callee,false);
            // document.getElementById("boton-probar").removeEventListener("click",arguments.callee,false);
            return true;
        }

        //SI ME QUEDO SIN INTENTOS INFORMO, DETENGO Y SALGO
        intentos+=1;
        if (intentos == 5){
            doc_mensajes.innerHTML='<p class="error"> NO QUEDAN INTENTOS! LA PALABRA ERA <span class="palabraqueera">'+x+'</span></p>';
            // document.getElementById("boton-probar").removeEventListener("click",arguments.callee,false);
            doc_boton.removeEventListener("click",arguments.callee,false);
            return true;
        }
    })
    
}


for (let i = 0; i < 5; i++){
    doc_adivinando.innerHTML=adivinando.innerHTML+"&nbsp_&nbsp"
}
doc_teclado.innerHTML = teclado.teclado;



 // palabra.string.then (x => console.log(x));

// ingresada = new PalabraIngresada ("hueso");
// console.log(ingresada.normalizada);

//console.log(aciertos("ESTER","ASTRO"));


