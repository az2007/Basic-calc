const resultInput = document.getElementById("result");
const historyList = document.getElementById("history-list");

let currentInput = "0";
let operator = null;
let previousInput = "";
let shouldResetDisplay = false;
let history = [];

function updateDisplay() {
  resultInput.value = currentInput;
}

function updateHistory() {
  historyList.innerHTML = "";
  history
    .slice()
    .reverse()
    .forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      historyList.appendChild(listItem);
    });
}

function appendNumber(number) {
  if (shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else if (currentInput === "0" && number !== ".") {
    currentInput = number;
  } else if (number === "." && currentInput.includes(".")) {
    return;
  } else {
    currentInput += number;
  }
  updateDisplay();
}

function appendConstant(constant) {
  if (shouldResetDisplay || currentInput === "0") {
    currentInput = constant.toString();
  } else {
    currentInput = constant.toString();
  }
  shouldResetDisplay = true;
  updateDisplay();
}

function appendOperator(op) {
  if (operator !== null && !shouldResetDisplay) {
    calculateResult();

    if (currentInput.includes("Error")) {
      return;
    }
  }
  previousInput = currentInput;
  operator = op;
  shouldResetDisplay = true;
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) {
    return NaN;
  }
  if (n === 0) {
    return 1;
  }
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

function calculateSpecial(type) {
  let value = parseFloat(currentInput);
  let result;
  let operationText = "";

  if (type !== "pi" && type !== "e" && isNaN(value)) {
    currentInput = "Error";
    updateDisplay();
    shouldResetDisplay = true;
    return;
  }

  switch (type) {
    case "percent":
      result = value / 100;
      operationText = `${value}% = ${result}`;
      break;
    case "sqrt":
      if (value < 0) {
        currentInput = "Error: Negative square root";
        updateDisplay();
        shouldResetDisplay = true;
        return;
      }
      result = Math.sqrt(value);
      operationText = `√${value} = ${result}`;
      break;
    case "reciprocal":
      if (value === 0) {
        currentInput = "Error: Division by 0";
        updateDisplay();
        shouldResetDisplay = true;
        return;
      }
      result = 1 / value;
      operationText = `1/${value} = ${result}`;
      break;
    case "factorial":
      if (value < 0 || !Number.isInteger(value)) {
        currentInput = "Error: Invalid factorial";
        updateDisplay();
        shouldResetDisplay = true;
        return;
      }
      result = factorial(value);
      operationText = `${value}! = ${result}`;
      break;
    case "log":
      if (value <= 0) {
        currentInput = "Error: log(0) or log(negative)";
        updateDisplay();
        shouldResetDisplay = true;
        return;
      }
      result = Math.log10(value);
      operationText = `log(${value}) = ${result}`;
      break;
    case "ln":
      if (value <= 0) {
        currentInput = "Error: ln(0) or ln(negative)";
        updateDisplay();
        shouldResetDisplay = true;
        return;
      }
      result = Math.log(value);
      operationText = `ln(${value}) = ${result}`;
      break;
    case "power":
      if (operator === "^") {
        return;
      } else {
        appendOperator("^");
        shouldResetDisplay = true;
        return;
      }
    case "powerOfTen":
      result = Math.pow(10, value);
      operationText = `10^(${value}) = ${result}`;
      break;
    case "exp":
      result = Math.exp(value);
      operationText = `e^(${value}) = ${result}`;
      break;
    case "pi":
      appendConstant(Math.PI);
      return;
    case "e":
      appendConstant(Math.E);
      return;
    default:
      return;
  }

  if (typeof result === "number" && !isNaN(result)) {
    currentInput = result.toFixed(10).replace(/\.?0+$/, "");
  } else {
    currentInput = result.toString();
  }

  if (type !== "pi" && type !== "e") {
    history.push(operationText);
    updateHistory();
  }
  updateDisplay();
  shouldResetDisplay = true;
}

function calculateResult() {
  if (operator === null || shouldResetDisplay) {
    if (history.length > 0 && history[history.length - 1].includes("=")) {
      return;
    }
    if (currentInput !== "0" && previousInput === "" && operator === null) {
      return;
    }
    return;
  }

  let calculation;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) {
    currentInput = "Error";
    updateDisplay();
    shouldResetDisplay = true;
    operator = null;
    return;
  }

  const operationString = `${previousInput} ${operator} ${currentInput}`;

  switch (operator) {
    case "+":
      calculation = prev + current;
      break;
    case "-":
      calculation = prev - current;
      break;
    case "*":
      calculation = prev * current;
      break;
    case "/":
      if (current === 0) {
        currentInput = "Error: Division by 0";
        operator = null;
        previousInput = "";
        shouldResetDisplay = true;
        updateDisplay();
        return;
      }
      calculation = prev / current;
      break;
    case "^":
      calculation = Math.pow(prev, current);
      break;
    default:
      return;
  }

  currentInput = calculation.toFixed(10).replace(/\.?0+$/, "");
  history.push(`${operationString} = ${currentInput}`);
  updateHistory();
  operator = null;
  previousInput = "";
  shouldResetDisplay = true;
  updateDisplay();
}

function clearDisplay() {
  currentInput = "0";
  operator = null;
  previousInput = "";
  shouldResetDisplay = false;
  updateDisplay();
}

function clearHistory() {
  history = [];
  updateHistory();
}

updateDisplay();
updateHistory();
