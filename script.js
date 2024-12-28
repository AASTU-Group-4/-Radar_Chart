
// Function to capture and validate user input data
function getChartData() {
    const name = document.getElementById('name').value.trim();
    const maths = parseInt(document.getElementById('maths').value);
    const science = parseInt(document.getElementById('science').value);
    const social = parseInt(document.getElementById('social').value);
    const music = parseInt(document.getElementById('music').value);
    const art = parseInt(document.getElementById('art').value);

    // Validate the input data
    if (!name || isNaN(maths) || isNaN(science) || isNaN(social) || isNaN(music) || isNaN(art)) {
        alert("Please fill out all fields correctly.");
        return null;
    }

    // Prepare data for radar chart
    const labels = ['Maths', 'Science', 'Social Studies', 'Music', 'Art'];
    const values = [maths, science, social, music, art];

    return { name, labels, values };
}

// Event listener for the form submission
document.getElementById('chartForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const chartData = getChartData();
    if (chartData) {
        
        // Call your function to render the radar chart here
    }
});

// Radar chart rendering logic

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("chartForm");
    const radarCanvas = document.getElementById("radarChart");
    const ctx = radarCanvas.getContext("2d");
    const width = radarCanvas.width;
    const height = radarCanvas.height;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const radius = Math.min(width, height) / 3; // Dynamically fit canvas
    const maxScore = 100; // Maximum score for normalization
    const levels = 5; // Number of concentric levels in the radar chart

    // Bresenham's Line Algorithm
    function drawLine(x0, y0, x1, y1, color = "black") {
        let dx = Math.abs(x1 - x0),
            dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        ctx.fillStyle = color;
        while (true) {
            ctx.fillRect(x0, y0, 1, 1); // Plot pixel
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }

    // Midpoint Circle Algorithm
    function drawCircle(cx, cy, r, color = "black") {
        let x = r,
            y = 0,
            p = 1 - r;

        while (x >= y) {
            plotCirclePoints(cx, cy, x, y, color);
            y++;
            if (p <= 0) {
                p += 2 * y + 1;
            } else {
                x--;
                p += 2 * y - 2 * x + 1;
            }
        }
    }

    function plotCirclePoints(cx, cy, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(cx + x, cy + y, 1, 1);
        ctx.fillRect(cx - x, cy + y, 1, 1);
        ctx.fillRect(cx + x, cy - y, 1, 1);
        ctx.fillRect(cx - x, cy - y, 1, 1);
        ctx.fillRect(cx + y, cy + x, 1, 1);
        ctx.fillRect(cx - y, cy + x, 1, 1);
        ctx.fillRect(cx + y, cy - x, 1, 1);
        ctx.fillRect(cx - y, cy - x, 1, 1);
    }

    // Draw the radar chart grid
    function drawGrid(sides) {
        const angleStep = (2 * Math.PI) / sides;
        for (let level = 1; level <= levels; level++) {
            const r = (radius / levels) * level;
            drawPolygon(sides, r, "gray");
        }

        // Draw radial lines
        for (let i = 0; i < sides; i++) {
            const x = centerX + radius * Math.cos(i * angleStep);
            const y = centerY + radius * Math.sin(i * angleStep);
            drawLine(centerX, centerY, Math.floor(x), Math.floor(y), "black");
        }
    }

    // Draw a polygon with a specified number of sides and radius
    function drawPolygon(sides, r, color) {
        const angleStep = (2 * Math.PI) / sides;
        let x1 = centerX + r * Math.cos(0);
        let y1 = centerY + r * Math.sin(0);

        for (let i = 1; i <= sides; i++) {
            const x2 = centerX + r * Math.cos(i * angleStep);
            const y2 = centerY + r * Math.sin(i * angleStep);
            drawLine(Math.floor(x1), Math.floor(y1), Math.floor(x2), Math.floor(y2), color);
            x1 = x2;
            y1 = y2;
        }
    }

    // Plot the data points
    function drawData(values, labels) {
        const angleStep = (2 * Math.PI) / values.length;
        let x1 = centerX + (values[0] / maxScore) * radius * Math.cos(0);
        let y1 = centerY + (values[0] / maxScore) * radius * Math.sin(0);

        for (let i = 1; i <= values.length; i++) {
            const r = (values[i % values.length] / maxScore) * radius;
            const x2 = centerX + r * Math.cos(i * angleStep);
            const y2 = centerY + r * Math.sin(i * angleStep);
            drawLine(Math.floor(x1), Math.floor(y1), Math.floor(x2), Math.floor(y2), "red");
            ctx.fillStyle = "blue";
            ctx.fillRect(Math.floor(x2) - 2, Math.floor(y2) - 2, 4, 4); // Marker


            // Draw labels near the edges
            const labelX = centerX + (radius + 20) * Math.cos(i * angleStep);
            const labelY = centerY + (radius + 20) * Math.sin(i * angleStep);
            ctx.fillStyle = "black";
            ctx.fillText(labels[i % labels.length], labelX, labelY);

            x1 = x2;
            y1 = y2;
        }
    }

    // Form submission handler
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const labels = [];
        const values = [];

        formData.forEach((value, key) => {
            if (key !== "name") {
                labels.push(key);
                values.push(parseInt(value, 10));
            }
        });

        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Draw the radar chart
        drawGrid(labels.length); // Grid and axes
        drawData(values, labels); // Plot data
    });
});
