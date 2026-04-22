let currentTab = 'scientific';

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    currentTab = tabName;

    if(tabName === 'graphing') {
        drawGraph(); // Draw default or empty graph on switch
    }
}

// Scientific Calculator Logic
function appendInput(val) {
    const input = document.getElementById('sci-input');
    input.value += val;
}

function clearInput() {
    document.getElementById('sci-input').value = '';
    document.getElementById('sci-result').innerText = '0';
}

async function calculateSci() {
    const input = document.getElementById('sci-input').value;
    const mode = document.getElementById('angle-mode').value;
    const resultDiv = document.getElementById('sci-result');

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: input, angleMode: mode })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        resultDiv.innerText = data.result;
    } catch (err) {
        resultDiv.innerText = 'Error';
    }
}

// Graphing Logic
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const scale = 20; // pixels per unit

function drawGrid() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y <= height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
}

async function drawGraph() {
    drawGrid();
    const expr = document.getElementById('graph-expr').value || 'x';
    
    try {
        const response = await fetch('/api/graph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expression: expr,
                range: { start: -centerX/scale, end: (width-centerX)/scale },
                step: 0.5
            })
        });
        const data = await response.json();
        
        if (data.points && data.points.length > 0) {
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            data.points.forEach((point, index) => {
                const plotX = centerX + (point.x * scale);
                const plotY = centerY - (point.y * scale); // Invert Y for canvas
                
                if (index === 0) ctx.moveTo(plotX, plotY);
                else ctx.lineTo(plotX, plotY);
            });
            ctx.stroke();
        }
    } catch (err) {
        console.error("Graphing error", err);
    }
}

// Algebra Logic
async function solveAlgebra() {
    const expr = document.getElementById('algebra-expr').value;
    const type = document.getElementById('algebra-type').value;
    const resultBox = document.getElementById('algebra-result');

    try {
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: expr, type: type, variable: 'x' })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        const label = type === 'derive' ? "Derivative:" : "Result:";
        resultBox.innerHTML = `<strong>${label}</strong> ${data.result}`;
    } catch (err) {
        resultBox.innerText = 'Error solving expression';
    }
}

// Initialize
drawGrid();
