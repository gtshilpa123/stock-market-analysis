import { getSummary } from "./index.js";
let st;
export default async function fetchAndCreateChart(
  range = "5y",
  stockName = "AAPL",
) {
  const url = `https://stock-market-api-k9vl.onrender.com/api/stocksdata`;
  st = stockName;
  try {
    const response = await fetch(url);
    const result = await response.json();
    const value = result.stocksData[0][st][range].value;
    const timeStamps = result.stocksData[0][st][range].timeStamp;

    const timeStamp = timeStamps.map((item) => {
      return new Date(item * 1000).toLocaleDateString();
    });
    drawChart(value, timeStamp, st);
    getSummary(st);
  } catch (error) {
    console.error(error);
  }
}

const month1Btn = document.getElementById("btn1d");
const month3Btn = document.getElementById("btn1mo");
const year1Btn = document.getElementById("btn1y");
const year5Btn = document.getElementById("btn5y");

month1Btn.addEventListener("click", () => {
  fetchAndCreateChart("1mo", st);
});
month3Btn.addEventListener("click", () => {
  fetchAndCreateChart("3mo", st);
});
year1Btn.addEventListener("click", () => {
  fetchAndCreateChart("1y", st);
});
year5Btn.addEventListener("click", () => {
  fetchAndCreateChart("5y", st);
});

function drawChart(value, timestamp, st) {
  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");
  const chartHeight = canvas.height - 40;
  const chartWidth = canvas.width - 60;
  const valueMax = Math.max(...value);
  const valueMin = Math.min(...value);
  const valueDiff = valueMax - valueMin;
  const stepY = valueDiff > 0 ? chartHeight / valueDiff : 0;
  const stepX = chartWidth / (value.length - 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw the curve in chart

  ctx.beginPath();
  ctx.moveTo(0, chartHeight - (value[0] - valueMin) * stepY);
  for (let i = 1; i < value.length; i++) {
    ctx.lineTo(i * stepX, chartHeight - (value[i] - valueMin) * stepY);
  }
  ctx.strokeStyle = "#39FF14";
  ctx.lineWidth = 2;
  ctx.stroke();

  // draw the dotted horizontal line in chart

  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  const zeroY = chartHeight - (0 - valueMin) * stepY;
  ctx.moveTo(0, zeroY);
  ctx.lineTo(canvas.width, zeroY);
  ctx.strokeStyle = "#ccc";
  ctx.stroke();
  ctx.setLineDash([]);

  // tooltips and x-axis value on hover

  const tooltip = document.getElementById("tooltip");
  const xAxisLabel = document.getElementById("xAxisLabel");

  canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const valueIndex = Math.min(Math.floor(x / stepX), value.length - 1);
    const currentValue = value[valueIndex].toFixed(2);
    const xAxisDate = timestamp[valueIndex];

    tooltip.style.display = "block";
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y - 20}px`;
    tooltip.textContent = `${st}: $${currentValue}`;

    xAxisLabel.style.display = "block";
    xAxisLabel.style.fontSize = "15px";
    xAxisLabel.style.fontWeight = "bolder";
    xAxisLabel.style.left = `${x}px`;
    xAxisLabel.textContent = xAxisDate;

    ctx.clearRect(0, 0, canvas.width, chartHeight);
    ctx.clearRect(
      0,
      chartHeight + 20,
      canvas.width,
      canvas.height - chartHeight - 20,
    );

    ctx.beginPath();
    ctx.moveTo(0, chartHeight - (value[0] - valueMin) * stepY);
    for (let i = 1; i < value.length; i++) {
      ctx.lineTo(i * stepX, chartHeight - (value[i] - valueMin) * stepY);
    }
    ctx.strokeStyle = "#39FF14";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(0, zeroY);
    ctx.lineTo(canvas.width, zeroY);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, chartHeight);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      x,
      chartHeight - (value[valueIndex] - valueMin) * stepY,
      6,
      0,
      2 * Math.PI,
    );
    ctx.fillStyle = "#39FF14";
    ctx.fill();
  });

  canvas.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
    xAxisLabel.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawChart(value, timestamp, st);
  });
}
