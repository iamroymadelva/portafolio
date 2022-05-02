var canvas;
var canvasContext;
var ballX = 45;
var ballY = 45;
var ballSpeedX = 15;
var ballSpeedY = 5;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 100;
var showingWinScreen = false;

var paddle1Y = 300;
var paddle2Y = 300;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 15;

//La siguiente función detecta la posición del mouse dentro del espacio de juego para mover las raquetas
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var fps = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / fps);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 10; //Alinea el centro de la raqueta con la posición del mouse en el eje Y.
  });
};

//La siguiente función reinicia la pelota
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX; //cambia de dirección la pelota cuando se reinicia
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

//Función para que el computador mueva la raqueta contraria al jugador
function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 6;
  }
}

//Función para mover la pelota
function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX; //La pelota rebota contra la raqueta izquierda si está dentro del límite

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; //debe ser ANTES de ballReset()
      ballReset(); //reinicia la pelota cuando toca el lado izquierda
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX; //La pelota rebota cuando toca el lado derecho del marco

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
        player1Score++;
      ballReset(); //reinicia la pelota cuando toca el lado derecho
    }
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY; //La pelota rebota cuando toca el borde superior del marco
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY; //La pelota rebota cuando toca el borde inferior del marco
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

//* *************************** *//
function drawEverything() {
  //Esta línea pinta de negro el tablero
  colorRect(0, 0, canvas.width, canvas.height, "black");

  //* La siguiente línea muestra el mensaje de click para continuar
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";

  if (player1Score >= WINNING_SCORE) {
    canvasContext.fillStyle = "green";
    canvasContext.fillText("Jugador 1 ganó!", canvas.width * (47/100), 400);
  } else if (player2Score >= WINNING_SCORE) {
    canvasContext.fillStyle = "blue";
    canvasContext.fillText("Jugador 2 ganó!", canvas.width * (47/100), 400);
  }

  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "Haz click para continuar",canvas.width * (45 / 100),canvas.height * (50 / 100));
    return;
  }

  drawNet();

  //Esta es la raqueta del jugador del lado izquierdo
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "green");

  //Esta es la raqueta del jugador del lado derecho
  colorRect(
    canvas.width - 10,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "blue"
  );

  //La siguiente línea da forma y color a la pelota:
  colorCirculo(ballX, ballY, 10, "red");

  //*Mostrar el puntaje de los jugadores
  canvasContext.fillText(
    player1Score,
    canvas.width * (15 / 100),
    canvas.height * (10 / 100)
  );
  canvasContext.fillText(
    player2Score,
    canvas.width - canvas.width * (15 / 100),
    canvas.height * (10 / 100)
  );
}

var colorCirculo = (centroX, centroY, radio, colorRelleno) => {
  canvasContext.fillStyle = colorRelleno;
  canvasContext.beginPath();
  canvasContext.arc(centroX, centroY, radio, 0, Math.PI * 2, true);
  canvasContext.fill();
};

function colorRect(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}
