const canvas = document.querySelector("canvas"),
  toolbtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  eras = document.querySelector("#eraser"),
  ctx = canvas.getContext("2d");
// global variable with default value
let prevMouseX, prevMouseY, snapshot,selectColor = "#000";
(isdraw = false), (brushsize = 6), (selectedtool = "brush");

const setCanvasBackgound = () =>{
  // setting whole canvas background to color , so the downloaded img background will be colored
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = selectColor; // it'will be the  brush color;
}

window.addEventListener("load", () => {
  // setting canvas width/ height .. offsetwidth/height returns viewable with/height of an element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackgound();
});
// Triangle
const drawTriangle = (e) => {
  ctx.beginPath(); // creating a new path to draw Triangle
  ctx.moveTo(prevMouseX, prevMouseY); // moving Triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// circle
const drawCircle = (e) => {
  ctx.beginPath(); // creating a new path to draw circle
  // getting a radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseX - e.offsetX, 2)
  );

  // creating circle according to the mouse pointer
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
  fillColor.checked ? ctx.fill() : ctx.stroke(); // if fill color is checked fill circle else draw border CIRCLE
};
// rectangle
const drawReact = (e) => {
  // if fillcolor isn't checked draw a rect with border else draw rect with background
  if (!fillColor.checked) {
    // creating circle according to the mouse pointer
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const startdraw = (e) => {
  isdraw = true;

  prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX values
  prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY values

  ctx.beginPath(); // creating  new path to draw
  ctx.lineWidth = brushsize; // passing brush size as line width ....
  // copying canvas data & passing as snapshot value .. this avoids dragging the image
  ctx.strokeStyle = selectColor;
  ctx.fillStyle = selectColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const draw = (e) => {
  if (!isdraw) return;
  ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
  if (selectedtool === "brush" ||selectedtool === "eraser" ) {
    // ctx.strokeStyle = selectedtool === "eraser "? "#CDE8E5" : selectColor; 
    ctx.lineTo(e.offsetX, e.offsetY); // creating a line according to the mouse pointer
    ctx.stroke(); // drawing/filling line with color
  } else if (selectedtool === "rectangle") {
    drawReact(e);
  } else if (selectedtool === "circle") {
    drawCircle(e);
  } else if (selectedtool === "triangle") {
    drawTriangle(e);
  }
};
toolbtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding click event to all tool option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedtool = btn.id;
    // console.log(selectedtool);
  });
});

sizeSlider.addEventListener("change", () => {
  brushsize = sizeSlider.value;
});
canvas.addEventListener("mousedown", startdraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
  isdraw = false;
});
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
     selectColor= window.getComputedStyle(btn).getPropertyValue("Background-color");
  
  });
});

colorPicker.addEventListener("change",()=>{
  // passing picked color value from color picker to last color btn background
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

eras.addEventListener("click",()=>{
  selectColor= "#fff";
  // console.log(selectColor);
  ctx.strokeStyle = selectColor;
});

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackgound();
});

saveImg.addEventListener("click",()=>{
  const link = document.createElement("a"); // creating <A> element
  link.download = `${Date.now()}.jpg`; // passing current date as link download value
  link.href = canvas.toDataURL(); // passing canvas data as a link href download value
  link.click(); // clicking link to download image
});

// Disable right-click on the webpage
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
  alert("! sorry you don't have permissions.. to open files...");
});

