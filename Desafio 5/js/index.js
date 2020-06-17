// This is the container of all Entities
const rootElement = document.getElementById('root');

const hud = new HUD(rootElement);
const grid = new Grid(rootElement, 10, 10);

function frame () {
    hud.frame();
}

setInterval(frame, 1000);