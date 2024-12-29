function createField(fieldName = "", fieldValue = 50) {
  const container = document.createElement("div");
  container.className = "field-group";

  const label = document.createElement("input");
  label.type = "text";
  label.placeholder = "Enter field name";
  label.value = fieldName;
  label.required = true;

  const range = document.createElement("input");
  range.type = "range";
  range.min = "1";
  range.max = "100";
  range.value = fieldValue;
  range.required = true;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-field";
  removeBtn.textContent = "×";
  removeBtn.onclick = () => container.remove();

  container.appendChild(label);
  container.appendChild(range);
  container.appendChild(removeBtn);

  return container;
}

function getChartData() {
  const name = document.getElementById("name").value.trim();
  const chartColor = document.getElementById("chartColor").value;
  const fieldGroups = document.querySelectorAll(".field-group");

  if (fieldGroups.length === 0) {
    alert("Please add at least one field.");
    return null;
  }

  const labels = [];
  const values = [];

  fieldGroups.forEach((group) => {
    const label = group.querySelector('input[type="text"]').value.trim();
    const value = parseInt(group.querySelector('input[type="range"]').value);

    if (label && !isNaN(value)) {
      labels.push(label);
      values.push(value);
    }
  });

  if (labels.length === 0) {
    alert("Please fill out all fields correctly.");
    return null;
  }

  return { name, labels, values, chartColor };
}

const form = document.getElementById("chartForm");
const fieldsContainer = document.getElementById("fields-container");
const addFieldBtn = document.getElementById("addField");
const radarCanvas = document.getElementById("radarChart");
const ctx = radarCanvas.getContext("2d");
const width = radarCanvas.width;
const height = radarCanvas.height;
const centerX = Math.floor(width / 2);
const centerY = Math.floor(height / 2);
const radius = Math.min(width, height) / 3;
const maxScore = 100;
const levels = 5;

// Add initial fields
fieldsContainer.appendChild(createField("Maths"));
fieldsContainer.appendChild(createField("Science"));
fieldsContainer.appendChild(createField("Social Studies"));

addFieldBtn.addEventListener("click", () => {
  fieldsContainer.appendChild(createField());
});

function drawLine(x0, y0, x1, y1, color = "black") {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawGrid(sides) {
  const angleStep = (2 * Math.PI) / sides;
  for (let level = 1; level <= levels; level++) {
    const r = (radius / levels) * level;
    drawPolygon(sides, r, "gray");
  }

  for (let i = 0; i < sides; i++) {
    const x = centerX + radius * Math.cos(i * angleStep);
    const y = centerY + radius * Math.sin(i * angleStep);
    drawLine(centerX, centerY, x, y, "black");
  }
}

function drawPolygon(sides, r, color) {
  const angleStep = (2 * Math.PI) / sides;
  ctx.beginPath();
  ctx.moveTo(centerX + r * Math.cos(0), centerY + r * Math.sin(0));

  for (let i = 1; i <= sides; i++) {
    ctx.lineTo(
      centerX + r * Math.cos(i * angleStep),
      centerY + r * Math.sin(i * angleStep)
    );
  }

  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawData(values, labels, color) {
  const angleStep = (2 * Math.PI) / values.length;

  // Draw filled area
  ctx.beginPath();
  ctx.moveTo(
    centerX + (values[0] / maxScore) * radius * Math.cos(0),
    centerY + (values[0] / maxScore) * radius * Math.sin(0)
  );

  for (let i = 1; i <= values.length; i++) {
    const r = (values[i % values.length] / maxScore) * radius;
    const x = centerX + r * Math.cos(i * angleStep);
    const y = centerY + r * Math.sin(i * angleStep);
    ctx.lineTo(x, y);
  }

  ctx.fillStyle = color + "33"; // Add transparency
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();

  // Draw points and labels
  for (let i = 0; i < values.length; i++) {
    const r = (values[i] / maxScore) * radius;
    const x = centerX + r * Math.cos(i * angleStep);
    const y = centerY + r * Math.sin(i * angleStep);

    ctx.fillStyle = color;
    ctx.fillRect(x - 2, y - 2, 4, 4);

    const labelX = centerX + (radius + 20) * Math.cos(i * angleStep);
    const labelY = centerY + (radius + 20) * Math.sin(i * angleStep);
    ctx.fillStyle = "black";
    ctx.fillText(labels[i], labelX, labelY);
  }
}

function drawTitle(name) {
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(name, centerX, 30);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const chartData = getChartData();
  if (chartData) {
    ctx.clearRect(0, 0, width, height);
    drawTitle(chartData.name);
    drawGrid(chartData.labels.length);
    drawData(chartData.values, chartData.labels, chartData.chartColor);
  }
});
