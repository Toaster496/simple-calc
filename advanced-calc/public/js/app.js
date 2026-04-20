// Advanced Calculator Frontend Application

let currentExpression = '';
let angleMode = 'DEG';
let history = [];

// Tab switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
    
    if (tabId === 'graphing') {
        setTimeout(initGraph, 100);
    }
}

// Angle mode
function setAngleMode(mode) {
    angleMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(mode.toLowerCase() + 'Btn').classList.add('active');
}

// Calculator functions
function appendValue(val) {
    currentExpression += val;
    updateDisplay();
}

function appendFunc(func) {
    currentExpression += func;
    updateDisplay();
}

function clearAll() {
    currentExpression = '';
    document.getElementById('result').textContent = '0';
    updateDisplay();
}

function clearEntry() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

function toggleSign() {
    // Simple implementation - wraps in negative
    if (currentExpression.startsWith('-')) {
        currentExpression = currentExpression.substring(1);
    } else {
        currentExpression = '-' + currentExpression;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('expression').textContent = currentExpression || '0';
}

async function calculate() {
    if (!currentExpression) return;
    
    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                expression: currentExpression,
                angleMode: angleMode
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('result').textContent = data.formatted;
            addToHistory(currentExpression, data.formatted);
            currentExpression = data.formatted.toString();
        } else {
            document.getElementById('result').textContent = 'Error';
        }
    } catch (error) {
        document.getElementById('result').textContent = 'Error';
        console.error('Calculation error:', error);
    }
}

function addToHistory(expr, result) {
    history.unshift({ expression: expr, result: result });
    if (history.length > 20) history.pop();
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="loadFromHistory(${index})">
            <strong>${item.expression}</strong> = ${item.result}
        </div>
    `).join('');
}

function loadFromHistory(index) {
    currentExpression = history[index].result;
    updateDisplay();
}

// Graphing functions
let graphCanvas, graphCtx;

function initGraph() {
    graphCanvas = document.getElementById('graphCanvas');
    if (!graphCanvas) return;
    
    const container = graphCanvas.parentElement;
    graphCanvas.width = container.clientWidth - 60;
    graphCanvas.height = 500;
    graphCtx = graphCanvas.getContext('2d');
    
    drawGrid();
}

function drawGrid() {
    if (!graphCtx) return;
    
    const width = graphCanvas.width;
    const height = graphCanvas.height;
    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const yMin = parseFloat(document.getElementById('yMin').value) || -10;
    const yMax = parseFloat(document.getElementById('yMax').value) || 10;
    
    graphCtx.clearRect(0, 0, width, height);
    
    // Background
    graphCtx.fillStyle = '#0a0a1a';
    graphCtx.fillRect(0, 0, width, height);
    
    // Grid lines
    graphCtx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
    graphCtx.lineWidth = 1;
    
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    
    // Vertical lines
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        const screenX = ((x - xMin) / xRange) * width;
        graphCtx.beginPath();
        graphCtx.moveTo(screenX, 0);
        graphCtx.lineTo(screenX, height);
        graphCtx.stroke();
    }
    
    // Horizontal lines
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        const screenY = height - ((y - yMin) / yRange) * height;
        graphCtx.beginPath();
        graphCtx.moveTo(0, screenY);
        graphCtx.lineTo(width, screenY);
        graphCtx.stroke();
    }
    
    // Axes
    graphCtx.strokeStyle = '#00d9ff';
    graphCtx.lineWidth = 2;
    
    // X-axis
    if (yMin <= 0 && yMax >= 0) {
        const xAxisY = height - ((0 - yMin) / yRange) * height;
        graphCtx.beginPath();
        graphCtx.moveTo(0, xAxisY);
        graphCtx.lineTo(width, xAxisY);
        graphCtx.stroke();
    }
    
    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
        const yAxisX = ((0 - xMin) / xRange) * width;
        graphCtx.beginPath();
        graphCtx.moveTo(yAxisX, 0);
        graphCtx.lineTo(yAxisX, height);
        graphCtx.stroke();
    }
}

async function plotGraph() {
    const expr1 = document.getElementById('graphExpr1').value;
    const expr2 = document.getElementById('graphExpr2').value;
    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;
    const yMin = parseFloat(document.getElementById('yMin').value) || -10;
    const yMax = parseFloat(document.getElementById('yMax').value) || 10;
    
    const expressions = [expr1];
    if (expr2) expressions.push(expr2);
    
    try {
        const response = await fetch('/api/graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                expressions: expressions,
                range: { min: xMin, max: xMax },
                points: 500
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            drawGrid();
            drawFunctions(data.data, expressions, xMin, xMax, yMin, yMax);
        }
    } catch (error) {
        console.error('Graphing error:', error);
    }
}

function drawFunctions(data, expressions, xMin, xMax, yMin, yMax) {
    if (!graphCtx) return;
    
    const width = graphCanvas.width;
    const height = graphCanvas.height;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    
    const colors = ['#00d9ff', '#ff6b6b', '#4ecdc4', '#ffe66d'];
    
    expressions.forEach((expr, index) => {
        graphCtx.strokeStyle = colors[index % colors.length];
        graphCtx.lineWidth = 2;
        graphCtx.beginPath();
        
        let firstPoint = true;
        
        data.forEach(point => {
            const y = point[`y${index}`];
            
            if (y !== null && isFinite(y)) {
                const screenX = ((point.x - xMin) / xRange) * width;
                const screenY = height - ((y - yMin) / yRange) * height;
                
                if (firstPoint) {
                    graphCtx.moveTo(screenX, screenY);
                    firstPoint = false;
                } else {
                    graphCtx.lineTo(screenX, screenY);
                }
            } else {
                firstPoint = true;
            }
        });
        
        graphCtx.stroke();
    });
}

// Algebra solver functions
async function solveAlgebra() {
    const equation = document.getElementById('algebraEq').value;
    const variable = document.getElementById('algebraVar').value || 'x';
    
    if (!equation) {
        document.getElementById('solutionResult').textContent = 'Please enter an equation';
        return;
    }
    
    try {
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ equation, variable })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displaySolution(data);
        } else {
            document.getElementById('solutionResult').textContent = 'Error: ' + data.error;
        }
    } catch (error) {
        document.getElementById('solutionResult').textContent = 'Error: ' + error.message;
    }
}

function displaySolution(data) {
    const resultDiv = document.getElementById('solutionResult');
    const stepsDiv = document.getElementById('solutionSteps');
    
    if (typeof data.solution === 'string') {
        resultDiv.textContent = data.solution;
    } else if (Array.isArray(data.solution)) {
        resultDiv.textContent = 'Solutions: ' + data.solution.join(', ');
    } else if (data.solution.simplified) {
        resultDiv.textContent = 'Simplified: ' + data.solution.simplified;
    } else {
        resultDiv.textContent = JSON.stringify(data.solution);
    }
    
    if (data.steps && data.steps.length > 0) {
        stepsDiv.innerHTML = '<h3 style="color: #00d9ff; margin: 15px 0 10px;">Steps:</h3>' +
            data.steps.map((step, i) => `<div class="step">${i + 1}. ${step}</div>`).join('');
    } else {
        stepsDiv.innerHTML = '';
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (document.getElementById('calculator').classList.contains('active')) {
        const key = e.key;
        
        if (/[0-9]/.test(key)) {
            appendValue(key);
        } else if (['+', '-', '*', '/', '(', ')', '^', '.'].includes(key)) {
            appendValue(key);
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Escape') {
            clearAll();
        } else if (key === 'Backspace') {
            clearEntry();
        }
    }
});

// Initialize
window.addEventListener('load', () => {
    setTimeout(initGraph, 500);
});

window.addEventListener('resize', () => {
    if (graphCanvas) {
        const container = graphCanvas.parentElement;
        graphCanvas.width = container.clientWidth - 60;
        drawGrid();
    }
});
