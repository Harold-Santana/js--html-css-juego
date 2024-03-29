const palos = ["Corazón rojo", "Brillo rojo", "Corazón negro", "Trébol negro"];
const valores = ["As(1)", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];


function mezclarMazo(mazo) {
    const mazoMezclado = [];
    while (mazo.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * mazo.length);
        const carta = mazo.splice(indiceAleatorio, 1)[0];
        mazoMezclado.push(carta);
    }
    return mazoMezclado;
}


function repartirCartasIniciales(mazo) {
    const manoJugador = [mazo[0], mazo[1]];
    const manoMaquina = [mazo[2], mazo[3]];
    mazo.splice(0, 4);
    return { manoJugador, manoMaquina };
}


function calcularValorMano(mano) {
    let suma = 0;
    let tieneAs = false;
    for (const carta of mano) {
        const valor = carta.valor;
        suma += (valor === "As(1)" ? 1 : (valor === "J" || valor === "Q" || valor === "K") ? 10 : parseInt(valor));
        if (valor === "As(1)") {
            tieneAs = true;
        }
    }
    if (tieneAs && suma + 10 <= 21) {
        suma += 10;
    }
    return suma;
}


const botonEmpezar = document.getElementById("startButton");
const botonPedirCarta = document.getElementById("hitButton");
const botonFinalizar = document.getElementById("standButton");
const divCartasJugador = document.getElementById("playerHand");
const divCartasMaquina = document.getElementById("dealerHand");
const divPuntajeJugador = document.getElementById("playerScore");
const divPuntajeMaquina = document.getElementById("dealerScore");
const divResultado = document.getElementById("result");


let mazo = [];
let manoJugador = [];
let manoMaquina = [];


function actualizarPuntaje(mano, elemento) {
    const suma = calcularValorMano(mano);
    elemento.textContent = `Total: ${suma}`;
}


function mostrarCartas(mano, elemento) {
    elemento.innerHTML = ""; 
    for (const carta of mano) {
        const cardDiv = document.createElement("div");
        cardDiv.textContent = carta.valor;
        cardDiv.classList.add("card", carta.palo === "Corazón rojo" || carta.palo === "Brillo rojo" ? "red" : "black");
        elemento.appendChild(cardDiv);
    }
}


function determinarGanador() {
    const sumaJugador = calcularValorMano(manoJugador);
    const sumaMaquina = calcularValorMano(manoMaquina);

    if (sumaJugador > 21 || (sumaMaquina <= 21 && sumaMaquina > sumaJugador)) {
        return "Máquina";
    } else if (sumaMaquina > 21 || sumaJugador > sumaMaquina) {
        return "Jugador";
    } else {
        return "Empate";
    }
}


function limpiarResultados() {
    divResultado.textContent = "";
}


botonEmpezar.addEventListener("click", () => {
    limpiarResultados(); 

    
    mazo = [];
    for (const palo of palos) {
        for (const valor of valores) {
            mazo.push({ palo, valor });
        }
    }
    mazo = mezclarMazo(mazo);

    
    manoJugador = [];
    manoMaquina = [];

    
    const manos = repartirCartasIniciales(mazo);
    manoJugador = manos.manoJugador;
    manoMaquina = manos.manoMaquina;

    
    mostrarCartas(manoJugador, divCartasJugador);
    mostrarCartas(manoMaquina, divCartasMaquina);
    actualizarPuntaje(manoJugador, divPuntajeJugador);
    actualizarPuntaje(manoMaquina, divPuntajeMaquina);

    
    botonPedirCarta.disabled = false;
    botonFinalizar.disabled = false;
    botonEmpezar.disabled = true;
});


botonPedirCarta.addEventListener("click", () => {
    if (mazo.length > 0) {
        const nuevaCarta = mazo[0];
        manoJugador.push(nuevaCarta);
        mazo.splice(0, 1);
        actualizarPuntaje(manoJugador, divPuntajeJugador);
        mostrarCartas(manoJugador, divCartasJugador);

        const sumaJugador = calcularValorMano(manoJugador);
        if (sumaJugador > 21) {
            finalizarJuego("Máquina");
        }
    }
});


botonFinalizar.addEventListener("click", () => {
    while (calcularValorMano(manoMaquina) < 17 && mazo.length > 0) {
        manoMaquina.push(mazo[0]);
        mazo.splice(0, 1);
    }
    actualizarPuntaje(manoMaquina, divPuntajeMaquina);
    mostrarCartas(manoMaquina, divCartasMaquina);

    finalizarJuego(determinarGanador());
});


function finalizarJuego(ganador) {
    botonPedirCarta.disabled = true;
    botonFinalizar.disabled = true;
    botonEmpezar.disabled = false;
    divResultado.textContent = `¡${ganador} gana! Jugador: ${calcularValorMano(manoJugador)}, Máquina: ${calcularValorMano(manoMaquina)}`;
}
// Función para obtener el tipo de carta en base al valor
function obtenerTipoCarta(valor) {
    if (valor === "As(1)") {
        return "As";
    } else if (valor === "J") {
        return "Jota";
    } else if (valor === "Q") {
        return "Reina";
    } else if (valor === "K") {
        return "Rey";
    } else {
        return "Número";
    }
}

// ... (Código anterior)

// Función para obtener el tipo de carta en base al palo
function obtenerTipoPalo(palo) {
    if (palo === "Trébol negro") {
        return "Trébol";
    } else if (palo === "Corazón negro") {
        return "Corazón Negro";
    } else if (palo === "Corazón rojo") {
        return "Corazón Rojo";
    } else if (palo === "Brillo rojo") {
        return "Brillo Rojo";
    } else {
        return "Desconocido";
    }
}

function mostrarCartasConTipos(mano, elemento) {
    elemento.innerHTML = "";
    for (const carta of mano) {
        const cardDiv = document.createElement("div");
        cardDiv.textContent = `${carta.valor} de ${obtenerTipoPalo(carta.palo)}`;
        cardDiv.classList.add("card", carta.palo === "Corazón rojo" || carta.palo === "Brillo rojo" ? "red" : "black");
        elemento.appendChild(cardDiv);
    }
}

botonEmpezar.addEventListener("click", () => {
    mostrarCartasConTipos(manoJugador, divCartasJugador);
    mostrarCartasConTipos(manoMaquina, divCartasMaquina);
});
botonPedirCarta.addEventListener("click", () => {
    mostrarCartasConTipos(manoJugador, divCartasJugador);
});

botonFinalizar.addEventListener("click", () => {
    mostrarCartasConTipos(manoMaquina, divCartasMaquina);
});
