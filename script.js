let initial = true;
let isRunning = true;
let interval1, interval2, intermittentInterval;
let isIntermittent = false;
let manualInitial = false;

const semaforoActivo = {
  ciclo1: 0,
  ciclo2: 0,
};

const trafficLight1 = {
  direction: 0,
  currentLight: 0, // 0 for red, 1 for yellow, 2 for green
};

const trafficLight2 = {
  direction: 2,
  currentLight: 2,
};

const lights1 = document
  .querySelectorAll(".traffic-light")[0]
  .querySelectorAll(".light");
const lights2 = document
  .querySelectorAll(".traffic-light")[1]
  .querySelectorAll(".light");
const toggleButton = document.getElementById("toggleButton");
const toggleIntermittentButton = document.getElementById(
  "toggleIntermittentButton"
);
const advanceButton = document.getElementById("advanceButton");

const getCurrentLight = (trafficLight, nsemaforo) => {
  const { direction } = trafficLight;
  trafficLight.currentLight = direction;

  if (nsemaforo === 1) {
    trafficLight1.direction =
      trafficLight1.direction === 0 ? 2 : trafficLight1.direction === 2 ? 1 : 0;
  } else {
    trafficLight2.direction =
      trafficLight2.direction === 2 ? 1 : trafficLight2.direction === 1 ? 0 : 2;
  }
};

const changeLight1 = (isAutomatic = false) => {
  lights1[trafficLight1.currentLight].style.background = "#555";
  getCurrentLight(trafficLight1, 1);
  lights1[trafficLight1.currentLight].style.background = getColor(
    trafficLight1.currentLight
  );
  if (initial) {
    initial = false;
    return;
  }
  if (!manualInitial && !isAutomatic) return;
  semaforoActivo.ciclo2++;
};

const changeLight2 = () => {
  lights2[trafficLight2.currentLight].style.background = "#555";
  getCurrentLight(trafficLight2, 2);
  lights2[trafficLight2.currentLight].style.background = getColor(
    trafficLight2.currentLight
  );
  semaforoActivo.ciclo1++;
};

const getColor = (colorNumber) => {
  const possibleColors = {
    0: "red",
    1: "yellow",
    2: "green",
  };

  return possibleColors[colorNumber];
};

const stopIntermittent = () => {
  clearInterval(intermittentInterval);
  clearInterval(interval2);
  isIntermittent = false;
  lights1[1].style.background = "#555";
  lights2[1].style.background = "#555";
  clearLigths();
  toggleIntermittentButton.textContent = "Activar Intermitentes";
};

const stopAutomatic = () => {
  clearInterval(interval1);
  isRunning = false;
  toggleButton.textContent = "Activar Semáforo Automático";
};

const toggleLights = () => {
  if (isRunning) {
    isRunning = false;
    clearInterval(interval1);
    toggleButton.textContent = "Activar Semáforo Automático";
  } else {
    isRunning = true;
    if (isIntermittent) {
      stopIntermittent();
    } else {
      clearLigths();
    }
    manualInitial = false;
    interval1 = setInterval(() => {
      if (semaforoActivo.ciclo1 <= 2) {
        if (initial) changeLight1(true);
        if (semaforoActivo.ciclo1 === 2) {
          changeLight1(true);
        }
        changeLight2();
      } else {
        if (semaforoActivo.ciclo2 <= 3) {
          if (semaforoActivo.ciclo2 === 2) {
            changeLight2();
          }
          changeLight1(true);
          if (semaforoActivo.ciclo2 > 2) {
            semaforoActivo.ciclo1 = 1;
            semaforoActivo.ciclo2 = 0;
          }
        }
      }
    }, 1000);

    toggleButton.textContent = "Detener Semáforo Automático";
  }
};

toggleButton.addEventListener("click", toggleLights);

toggleIntermittentButton.addEventListener("click", () => {
  if (isIntermittent) {
    stopIntermittent();
    return;
  }
  if (isRunning) {
    stopAutomatic();
  }
  isIntermittent = true;
  lights1[0].style.background = "#555";
  lights1[2].style.background = "#555";
  lights2[0].style.background = "#555";
  lights2[2].style.background = "#555";
  lights1[1].style.background = "#555";
  lights2[1].style.background = "#555";

  intermittentInterval = setInterval(() => {
    lights1[1].style.background = "#555";
    lights2[1].style.background = "#555";
    interval2 = setTimeout(() => {
      lights1[1].style.background = getColor(1);
      lights2[1].style.background = getColor(1);
    }, 500); // (0.5 segundos) de intervalo para la luz amarilla
  }, 1000); // (1 segundo) de intervalo para las luces intermitentes

  toggleIntermittentButton.textContent = "Detener Intermitentes";
});

const initialManualPrint = () => {
  changeLight1();
  changeLight2();
  manualInitial = !manualInitial;
};

advanceButton.addEventListener("click", () => {
  if (isRunning) {
    stopAutomatic();
  }
  if (isIntermittent) {
    stopIntermittent();
  }
  if (!manualInitial) {
    clearLigths();
    initialManualPrint();
    return;
  }

  if (semaforoActivo.ciclo1 <= 2) {
    if (semaforoActivo.ciclo1 === 2) {
      changeLight1();
    }
    changeLight2();
  } else if (semaforoActivo.ciclo2 <= 3) {
    if (semaforoActivo.ciclo2 === 2) {
      changeLight1();
      changeLight2();
      return;
    }
    if (semaforoActivo.ciclo2 === 3) {
      semaforoActivo.ciclo1 = 1;
      semaforoActivo.ciclo2 = 0;
      manualInitial = !manualInitial;
      trafficLight1.direction = 0;
      trafficLight1.currentLight = 0;
      initialManualPrint();
    } else {
      changeLight1();
    }
  }
});

toggleLights();

function clearLigths() {
  lights1[0].style.background = "#555";
  lights1[2].style.background = "#555";
  lights2[0].style.background = "#555";
  lights2[2].style.background = "#555"; 
  lights1[1].style.background = "#555";
  lights2[1].style.background = "#555";
  semaforoActivo.ciclo1 = 0;
  semaforoActivo.ciclo2 = 0;
  trafficLight1.direction = 0;
  trafficLight1.currentLight = 0;
  trafficLight2.direction = 2;
  trafficLight2.currentLight = 2;
  initial = true;
  manualInitial = false;
}
