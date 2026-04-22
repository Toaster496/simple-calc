<div align="center">

![header](https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1D9E75,100:378ADD&height=200&section=header&text=Advanced%20Calculator&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Scientific%20%C2%B7%20Graphing%20%C2%B7%20Algebra%20%C2%B7%20REST%20API&descSize=18&descAlignY=58&descColor=b0c4de)

<br/>

![Node.js](https://img.shields.io/badge/Node.js-v14%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Math.js](https://img.shields.io/badge/Math.js-Engine-FF6B35?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Canvas_API-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

<br/>

**A full-stack web calculator with scientific mode, real-time function graphing, and a symbolic algebra solver — all backed by a REST API.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Installation](#-installation) · [API Docs](#-api-endpoints) · [Usage](#-usage-guide)

</div>

---

## Features

<table>
<tr>
<td width="33%" valign="top">

### 🧮 Scientific
- Full arithmetic `+ - * /`
- Trig: `sin`, `cos`, `tan`
- Angle modes: DEG / RAD / GRAD
- Exponents `^` and `sqrt()`
- Constant `π`
- Complex parenthetical expressions

</td>
<td width="33%" valign="top">

### 📈 Graphing
- Plot any `f(x)` dynamically
- e.g. `x^2`, `sin(x)`, `x^3 - 2x`
- Interactive canvas with grid + axes
- Auto-scaling across ranges
- Responsive canvas layout

</td>
<td width="33%" valign="top">

### ∂ Algebra Solver
- Symbolic **derivatives** w.r.t. `x`
- Expression **simplification**
- Powered by Math.js symbolic engine
- Instant results via REST API

</td>
</tr>
</table>

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│         HTML5 · CSS3 · Vanilla JS · Canvas API              │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP / REST
┌────────────────────────▼────────────────────────────────────┐
│                    Express.js Server                        │
│     POST /api/calculate · /api/graph · /api/solve           │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Math.js Engine                          │
│       Parsing · Evaluation · Symbolic Differentiation       │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js v14+ | Server environment |
| Framework | Express.js | HTTP routing & middleware |
| Math engine | Math.js | Parsing, evaluation, symbolic math |
| Frontend | HTML5 / CSS3 / Vanilla JS | UI & interaction |
| Visualization | HTML5 Canvas API | Function graphing |

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v14 or higher
- npm (bundled with Node.js)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Toaster496/simple-calc.git
cd simple-calc

# 2. Install dependencies
npm install

# 3. Start the server
node server.js

# Or with auto-restart for development
npx nodemon server.js
```

Open **http://localhost:3000** in your browser.

---

## Project Structure

```
advanced-calc/
├── public/
│   ├── index.html      # Main UI structure
│   ├── style.css       # Styling and layout
│   └── app.js          # Frontend logic and API calls
├── server.js           # Express server and API endpoints
├── package.json        # Project metadata and dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## API Endpoints

### `POST /api/calculate`
Evaluate a scientific expression.

```json
{ "expression": "sin(90)", "angleMode": "deg" }
→ { "result": 1 }
```

### `POST /api/graph`
Generate coordinate data points for plotting.

```json
{ "expression": "x^2", "range": { "start": -10, "end": 10 }, "step": 0.5 }
→ { "points": [[-10, 100], [-9.5, 90.25], "..."] }
```

### `POST /api/solve`
Perform algebraic operations.

```json
{ "expression": "x^2 + 2*x", "type": "derive", "variable": "x" }
→ { "result": "2 * x + 2" }
```

| Method | Endpoint | Operation |
|--------|----------|-----------|
| `POST` | `/api/calculate` | Scientific expression evaluation |
| `POST` | `/api/graph` | Function data point generation |
| `POST` | `/api/solve` | Symbolic derivative / simplification |

---

## Usage Guide

### Scientific mode
1. Choose your angle unit — **RAD**, **DEG**, or **GRAD** — from the dropdown
2. Build your expression using the on-screen buttons or type directly
3. Press `=` to evaluate

### Graphing mode
1. Enter a function of `x` — e.g. `x^2`, `sin(x) * x`, `x^3 - 2*x + 1`
2. Click **Plot**
3. The canvas renders with automatic axis scaling

### Algebra mode
1. Enter any mathematical expression
2. Select **Derivative** to compute `f′(x)` or **Simplify** to evaluate
3. Click **Solve**

---

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the **ISC License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

![footer](https://capsule-render.vercel.app/api?type=waving&color=0:378ADD,50:1D9E75,100:0d1117&height=100&section=footer)

Built with ❤️ by [Toaster496](https://github.com/Toaster496) using Node.js and Math.js

</div>
