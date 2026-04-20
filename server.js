const express = require('express');
const path = require('path');
const { evaluate, derivative, resolve, parse } = require('mathjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Scientific Calculation Endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const { expression, angleMode } = req.body;
        if (!expression) return res.status(400).json({ error: 'No expression provided' });

        // Handle angle modes for trig functions
        let processedExpr = expression;
        if (angleMode === 'deg') {
            processedExpr = expression.replace(/sin\(/g, 'sin(deg(')
                                      .replace(/cos\(/g, 'cos(deg(')
                                      .replace(/tan\(/g, 'tan(deg(');
        } else if (angleMode === 'grad') {
            processedExpr = expression.replace(/sin\(/g, 'sin(grad(')
                                      .replace(/cos\(/g, 'cos(grad(')
                                      .replace(/tan\(/g, 'tan(grad(');
        }

        const result = evaluate(processedExpr);
        res.json({ result: result.toString() });
    } catch (error) {
        res.status(500).json({ error: 'Invalid expression' });
    }
});

// Graphing Data Endpoint
app.post('/api/graph', (req, res) => {
    try {
        const { expression, range, step } = req.body;
        if (!expression) return res.status(400).json({ error: 'No expression provided' });

        const start = parseFloat(range.start) || -10;
        const end = parseFloat(range.end) || 10;
        const stepSize = parseFloat(step) || 0.5;

        const dataPoints = [];
        const exprNode = parse(expression);

        for (let x = start; x <= end; x += stepSize) {
            try {
                const scope = { x: x };
                const y = exprNode.evaluate(scope);
                if (isFinite(y)) {
                    dataPoints.push({ x, y });
                }
            } catch (e) {
                // Skip points where calculation fails (e.g., division by zero)
            }
        }

        res.json({ points: dataPoints });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate graph data' });
    }
});

// Algebra Solver Endpoint (Simple derivative/solve example)
app.post('/api/solve', (req, res) => {
    try {
        const { expression, variable, type } = req.body;
        
        if (type === 'derive') {
            const result = derivative(expression, variable || 'x').toString();
            return res.json({ result, type: 'derivative' });
        } 
        // Note: Full equation solving requires more complex logic or symbolic libraries
        // This is a placeholder for expansion
        else if (type === 'simplify') {
            const result = evaluate(expression).toString();
            return res.json({ result, type: 'simplified' });
        }

        res.status(400).json({ error: 'Unknown solve type' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to solve' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
