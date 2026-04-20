# Advanced Mathematical Calculator

A full-featured scientific calculator with graphing capabilities and algebra solving, built with Node.js/Express backend and vanilla JavaScript frontend.

## Features

### Scientific Calculator
- Basic arithmetic operations (+, -, *, /)
- Trigonometric functions (sin, cos, tan, asin, acos, atan)
- Logarithmic functions (log, ln, exp)
- Power and root functions (x^y, sqrt)
- Constants (pi, e)
- Factorial function
- Angle modes: Degrees, Radians, Gradians
- Calculation history
- Keyboard support

### Graphing
- Plot multiple functions simultaneously
- Customizable x and y axis ranges
- Interactive canvas-based rendering
- Support for complex mathematical expressions
- Real-time graph updates

### Algebra Solver
- Equation solving using numerical methods (Newton-Raphson)
- Expression simplification
- Step-by-step solution display
- Support for polynomial equations
- Variable specification

## Project Structure

```
advanced-calc/
├── server.js           # Express backend server
├── package.json        # Node.js dependencies
├── public/
│   ├── index.html      # Main HTML file with UI
│   └── js/
│       └── app.js      # Frontend JavaScript application
├── src/                # Source directory (for future expansion)
│   ├── components/
│   ├── utils/
│   ├── algebra/
│   └── graphing/
└── tests/              # Test directory
```

## Installation

1. Navigate to the project directory:
```bash
cd advanced-calc
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### POST /api/calculate
Evaluate mathematical expressions.

**Request:**
```json
{
  "expression": "sin(pi/2) + sqrt(16) * 2",
  "precision": 14
}
```

**Response:**
```json
{
  "success": true,
  "input": "sin(pi/2) + sqrt(16) * 2",
  "result": 9,
  "formatted": "9",
  "type": "number"
}
```

### POST /api/solve
Solve algebraic equations or simplify expressions.

**Request:**
```json
{
  "equation": "x^2 - 4 = 0",
  "variable": "x"
}
```

**Response:**
```json
{
  "success": true,
  "input": "x^2 - 4 = 0",
  "solution": {
    "roots": [-2, 2],
    "variable": "x",
    "method": "numerical (Newton-Raphson)"
  },
  "steps": [...]
}
```

### POST /api/graph
Generate data points for function graphing.

**Request:**
```json
{
  "expressions": ["sin(x)", "x^2"],
  "range": {"min": -10, "max": 10},
  "points": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": [{"x": -10, "y0": ..., "y1": ...}, ...],
  "range": {"min": -10, "max": 10},
  "expressions": ["sin(x)", "x^2"]
}
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Math Engine:** math.js
- **Frontend:** Vanilla JavaScript, HTML5 Canvas
- **Styling:** CSS3 with modern features (gradients, backdrop-filter)

## Usage Examples

### Calculator
- `sin(30)` - Calculate sine of 30 degrees
- `sqrt(144)` - Square root of 144
- `2^10` - 2 raised to power 10
- `log(100)` - Base-10 logarithm
- `fact(5)` - Factorial of 5

### Graphing
- `sin(x)` - Sine wave
- `x^2 - 4` - Parabola
- `cos(x) * exp(-x/10)` - Damped cosine
- `sqrt(x)` - Square root function

### Algebra
- `x^2 - 4 = 0` - Solve quadratic equation
- `x^3 - 2x + 1 = 0` - Solve cubic equation
- `simplify (x+1)^2` - Expand expression

## Notes

- The algebra solver uses numerical methods and may not find all roots for complex equations
- Graphing performance depends on the number of points requested
- Angle mode affects trigonometric calculations in the calculator
- Maximum calculation precision is 14 significant digits
