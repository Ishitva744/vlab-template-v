let currentStep = 0;
let rows;
let ptype = "";
let tempi = 0;

document.getElementById("submit").addEventListener("click", () => {
  const rowsInput = document.getElementById("rows");
  rows = Number(rowsInput.value);

  let code = {
    pyramid: [
      `//Code for Pyramid Pattern
let num = ${rows};
let pattern = '';
for (let i = 0; i < num; i++) {
    for (let j = 0; j < (num - i - 1); j++) {
        pattern += '  '; // Add spaces
    }
    for (let k = 0; k < (2 * i + 1); k++) {
        pattern += '* '; // Add stars
    } 
    pattern += '\\n';
}`,
    ],
    rpyramid: [
      `//Code for Reverse Pyramid Pattern
let num = ${rows};
let pattern = '';
for (let i = 0; i < num; i++) {
    for (let j = 0; j < i; j++) {
        pattern += '  '; // Add spaces
    }
    for (let k = 0; k < (2 * (num - i) - 1); k++) {
        pattern += '* '; // Add stars
    }
pattern += '\\n';
}`,
    ],
    sgrid: [
      `//Code for Square Grid Pattern
let num = ${rows};
let pattern = '';
for (let i = 0; i < num; i++) {
    pattern += '* '; // Add stars
    pattern += '\\n';
}`,
    ],
    diamond: [
      `//Code for Diamond Pattern
let num = ${rows};
let pattern = '';
  
let num1 =  Math.ceil(num/2);
let num2 = Math.floor(num/2);

for (let i = 0; i < num1; i++) { // upward pyramid
    for (let j = 0; j < (num1 - i - 1); j++) {
        pattern += '  '; // Add spaces
    }
    for (let k = 0; k < (2 * i + 1); k++) {
        pattern += '* '; // Add stars
    } 
    pattern += '\\n';
}
pattern+='  '; // extra space to shift pyramid to right
for (let i = 0; i < num2; i++) { // downward pyramid
    for (let j = 0; j < i; j++) {
        pattern += '  '; // Add spaces
    }
    for (let k = 0; k < (2 * (num2 - i) - 1); k++) {
        pattern += '* '; // Add stars
    }
pattern += '\\n  '; //extra space
}

console.log(pattern);   //printing star to console
`,
    ],
  };

  document.getElementById("pattern-container").innerHTML = "";
  document.getElementById("variables-display").style.display = "block";
  ptype = document.getElementById("type").value;

  document.getElementById("i-value").innerText = "0";
  document.getElementById("j-value").innerText = "0";
  document.getElementById("k-value").innerText = "0";
  document.getElementById("pattern-value").innerText = "";

  document.getElementById("code-area").innerHTML = code[ptype][0];

  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });

  currentStep = 0;
  document.getElementById("next").disabled = false;
});

document.getElementById("next").addEventListener("click", () => {
  if (currentStep < rows) {
    pattern(ptype);
  } else {
    document.getElementById("next").disabled = true;
  }
});

function pattern(ptype) {
  const container = document.getElementById("pattern-container");
  let stars = "";
  let i = 0,
    j = 0,
    k = 0;

  switch (ptype) {
    case "pyramid":
      i = currentStep;
      stars = "  ".repeat(rows - i - 1) + "* ".repeat(2 * i + 1);
      for (j = 0; j < rows - i - 1; j++) {}
      for (k = 0; k < 2 * i + 1; k++) {}

      document.getElementById("i-value").innerText = i;
      document.getElementById("j-value").innerText = j;
      document.getElementById("k-value").innerText = k;
      document.getElementById("pattern-value").innerText = stars.trim();

      break;

    case "rpyramid":
      i = currentStep;
      stars = "  ".repeat(i) + "* ".repeat(2 * (rows - i) - 1);
      for (j = 0; j < i; j++);
      for (k = 0; k < 2 * (rows - i) - 1; k++);

      document.getElementById("i-value").innerText = i;
      document.getElementById("j-value").innerText = j;
      document.getElementById("k-value").innerText = k;
      document.getElementById("pattern-value").innerText = stars.trim();

      break;

    case "sgrid":
      i = currentStep;
      stars = "* ".repeat(rows);
      document.getElementById("i-value").innerText = i;
      document.getElementById("pattern-value").innerText = stars.trim();

      break;

    case "diamond":
      i = currentStep;
      if (i < rows / 2) {
        stars = "  ".repeat(rows - i - 1) + "* ".repeat(2 * i + 1);
        for (j = 0; j < rows - i - 1; j++) {}
        for (k = 0; k < 2 * i + 1; k++) {}

        document.getElementById("i-value").innerText = i;
        document.getElementById("j-value").innerText = j;
        document.getElementById("k-value").innerText = k;
        document.getElementById("pattern-value").innerText = stars.trim();
      } else {
        let newrows = Math.floor(rows / 2);
        stars += "  ";
        stars = "  ".repeat(tempi) + "* ".repeat(2 * (newrows - tempi) - 1);
        stars += "  ";
        for (j = 0; j <= tempi; j++);
        for (k = 0; k < 2 * (newrows - tempi) - 1; k++);

        document.getElementById("i-value").innerText = tempi;
        document.getElementById("j-value").innerText = j;
        document.getElementById("k-value").innerText = k;
        document.getElementById("pattern-value").innerText = stars.trim();

        tempi++;
      }
      break;

    /* i = currentStep;
      if (i < rows / 2) {
        for (j = 0; j < rows - i - 1; j++) {}
        for (k = 0; k < 2 * i + 1; k++) {}
        stars = "  ".repeat(rows / 2 - i - 1) + "* ".repeat(2 * i + 1);
      } else {
        for (j = 0; j < i; j++);
        for (k = 0; k < 2 * (rows - i) - 1; k++);
        stars = "  ".repeat(i - rows / 2) + "* ".repeat(2 * (rows - i) - 1);
      } */

    default:
      break;
  }

  let stepText = document.createElement("span");
  stepText.innerText = stars.trim();

  stepText.style.color = "red";

  container.appendChild(stepText);

  setTimeout(() => {
    stepText.style.color = "black";
  }, 500);

  currentStep++;

  console.log(`step ${currentStep}: ${stars}`);
}
