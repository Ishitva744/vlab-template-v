let currentStep = 0;
let rows;
let ptype = "";

let code = {
  pyramid: [
    `let num = ${rows};
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
    `let num = ${rows};
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
    `let num = ${rows};
let pattern = '';
for (let i = 0; i < num; i++) {
    pattern += '* '; // Add stars
    pattern += '\\n';
}`,
  ],
  diamond: [
    `let num = ${rows};
let pattern = '';
for (let i = 1; i <= num; i++) {    //first 'for loop' for upward pyramid
    for (let j = 1; j <= ((num) - i); j++) {    //second 'for loop' to add 'spaces' before upward pyramid
        pattern += "  ";
    }
    for (let k = 1; k <= ((2 * i) - 1); k++) {      //third 'for loop' to add * to upward pyramid
        pattern += "* ";
    }
    pattern += "\\n";    //new line after row completion
}
for (let i = num-1; i >=1; i--) {       //fourth 'for loop' for downward pyramid
    for (let j = 1; j <= ((num) - i); j++) {    //fifth 'for loop' to add 'spaces' before downward pyramid
        pattern += "  ";
    }
    for (let k = 1; k <= ((2 * i) - 1); k++) {      //sixth 'for loop' to add * to downward pyramid
        pattern += "* ";
    }
    pattern += "\\n";    //new line after row completion
}
console.log(pattern);   //printing star to console
}`,
  ],
};

document.getElementById("submit").addEventListener("click", () => {
  const rowsInput = document.getElementById("rows");
  rows = Number(rowsInput.value);
  if (isNaN(rows)) {
    alert("Empty row field!");
    return;
  }

  document.getElementById("pattern-container").innerHTML = "";
  document.getElementById("variables-display").style.display = "block";
  ptype = document.getElementById("type").value;
  
  document.getElementById("i-value").innerText = "0";
  document.getElementById("j-value").innerText = "0";
  document.getElementById("k-value").innerText = "0";
  document.getElementById("pattern-value").innerText = "";

  document.getElementById("code-area").innerHTML = code[ptype][0];

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
  let i, j, k;

  switch (ptype) {
    case "pyramid":
      i = currentStep;
      stars = "  ".repeat(rows - i - 1) + "* ".repeat(2 * i + 1);
      for (j = 0; j < rows - i - 1; j++) {}
      for (k = 0; k < 2 * i + 1; k++) {}
      break;

    case "rpyramid":
      i = currentStep;
      stars = "  ".repeat(i) + "* ".repeat(2 * (rows - i) - 1);
      for (j = 0; j < i; j++);
      for (k = 0; k < 2 * (rows - i) - 1; k++);
      break;

    case "sgrid":
      i = currentStep;
      stars = "* ".repeat(rows);
      break;

    case "diamond":
      i = currentStep;
      if (i < rows / 2) {
        stars = "  ".repeat(rows / 2 - i - 1) + "* ".repeat(2 * i + 1);
      } else {
        stars = "  ".repeat(i - rows / 2) + "* ".repeat(2 * (rows - i) - 1);
      }
      break;

    default:
      break;
  }

  let stepText = document.createElement("span");
  stepText.innerText = stars.trim();

  stepText.style.color = "red";

  container.appendChild(stepText);

  document.getElementById("i-value").innerText = i;
  document.getElementById("j-value").innerText = j;
  document.getElementById("k-value").innerText = k;
  document.getElementById("pattern-value").innerText = stars.trim();

  setTimeout(() => {
    stepText.style.color = "black";
  }, 500);

  currentStep++;

  console.log(`step ${currentStep}: ${stars}`);
}
