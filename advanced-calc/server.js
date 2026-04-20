const express = require('express');
const cors = require('cors');
const math = require('mathjs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Algebra solver endpoint
app.post('/api/solve', (req, res) => {
    try {
        const { equation, variable = 'x' } = req.body;
        
        if (!equation) {
            return res.status(400).json({ error: 'Equation required' });
        }

        let solution;
        
        // Check if it's an equation (contains =)
        if (equation.includes('=')) {
            try {
                // Split equation into left and right sides
                const parts = equation.split('=');
                const left = parts[0].trim();
                const right = parts[1] ? parts[1].trim() : '0';
                
                // Create expression: left - right = 0
                // For quadratic equations, we can use the quadratic formula
                // For now, we'll provide numerical solutions using root finding
                
                // Try to find roots numerically
                const solutions = findRoots(left, right, variable);
                solution = solutions;
            } catch (e) {
                solution = { error: 'Could not solve equation', message: e.message };
            }
        } else {
            // Simplify expression
            try {
                const simplified = math.simplify(equation);
                solution = {
                    simplified: simplified.toString(),
                    type: 'expression'
                };
            } catch (e) {
                solution = { error: 'Could not simplify expression', message: e.message };
            }
        }

        res.json({ 
            success: true, 
            input: equation,
            solution: solution,
            steps: generateSteps(equation, solution)
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Numerical root finding function
function findRoots(left, right, variable) {
    const expr = `(${left}) - (${right})`;
    const func = math.compile(expr);
    
    const roots = [];
    const tolerance = 1e-6;
    
    // Try Newton-Raphson method from multiple starting points
    const startPoints = [-10, -5, -2, -1, -0.5, 0.5, 1, 2, 5, 10];
    
    for (const start of startPoints) {
        let x = start;
        let prevX = x;
        const h = 1e-6;
        
        for (let i = 0; i < 100; i++) {
            try {
                const fx = func.evaluate({ [variable]: x });
                const fxPlusH = func.evaluate({ [variable]: x + h });
                const derivative = (fxPlusH - fx) / h;
                
                if (Math.abs(derivative) < tolerance) break;
                
                x = x - fx / derivative;
                
                if (Math.abs(x - prevX) < tolerance) {
                    // Check if this is a valid root
                    const finalValue = func.evaluate({ [variable]: x });
                    if (Math.abs(finalValue) < 0.001) {
                        // Round to reasonable precision
                        const roundedRoot = Math.round(x * 1000000) / 1000000;
                        if (!roots.some(r => Math.abs(r - roundedRoot) < 0.001)) {
                            roots.push(roundedRoot);
                        }
                    }
                    break;
                }
                prevX = x;
            } catch (e) {
                break;
            }
        }
    }
    
    roots.sort((a, b) => a - b);
    
    if (roots.length === 0) {
        return { message: 'No real roots found in search range', method: 'numerical' };
    }
    
    return {
        roots: roots,
        variable: variable,
        method: 'numerical (Newton-Raphson)'
    };
}

// Graphing data endpoint
app.post('/api/graph', (req, res) => {
    try {
        const { expressions, range = { min: -10, max: 10 }, points = 1000 } = req.body;
        
        if (!expressions || !Array.isArray(expressions)) {
            return res.status(400).json({ error: 'Expressions array required' });
        }

        const data = [];
        const step = (range.max - range.min) / points;
        
        for (let i = 0; i <= points; i++) {
            const x = range.min + (i * step);
            const point = { x };
            
            expressions.forEach((expr, index) => {
                try {
                    const scope = { x };
                    const result = math.evaluate(expr, scope);
                    point[`y${index}`] = result;
                } catch (e) {
                    point[`y${index}`] = null;
                }
            });
            
            data.push(point);
        }

        res.json({
            success: true,
            data,
            range,
            expressions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Advanced calculation endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const { expression, precision = 14 } = req.body;
        
        if (!expression) {
            return res.status(400).json({ error: 'Expression required' });
        }

        const result = math.evaluate(expression);
        const formatted = math.format(result, { precision });

        res.json({
            success: true,
            input: expression,
            result: result,
            formatted: formatted,
            type: getType(result)
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Helper functions
function getType(value) {
    if (typeof value === 'number') return 'number';
    if (math.isComplex(value)) return 'complex';
    if (math.isFraction(value)) return 'fraction';
    if (Array.isArray(value)) return 'array';
    if (math.isMatrix(value)) return 'matrix';
    return 'unknown';
}

function generateSteps(equation, solution) {
    // Simplified step generation
    return [
        `Parsed equation: ${equation}`,
        `Applied algebraic rules`,
        `Solution: ${JSON.stringify(solution)}`
    ];
}

app.listen(PORT, () => {
    console.log(`Advanced Calculator API running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('  POST /api/calculate - Evaluate mathematical expressions');
    console.log('  POST /api/solve - Solve algebraic equations');
    console.log('  POST /api/graph - Generate graph data');
});
