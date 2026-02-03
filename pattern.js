let currentStep = 0;
let rows;
let ptype = "";
let tempi = 0;


function toggleSubmit() {
  document.getElementById("submit").classList.remove('submitted');
}


document.getElementById("submit").addEventListener("click", () => {
  document.getElementById("submit").classList.add('submitted');
  const rowsInput = document.getElementById("rows");
  rows = Number(rowsInput.value);

  

  document.getElementById("pattern-container").innerHTML = "";
  document.getElementById("variables-display").style.display = "block";
  ptype = document.getElementById("type").value;

  document.getElementById("i-value").innerText = "0";
  document.getElementById("j-value").innerText = "0";
  document.getElementById("k-value").innerText = "0";
  document.getElementById("pattern-value").innerText = "";

  //document.getElementById("code-area").innerHTML = code[ptype][0];

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
      let mid = Math.floor(rows / 2);
      i = currentStep;

      if (i <= mid) {
        j = mid - i; // spaces
        k = 2 * i + 1; // stars
        stars = " ".repeat(j) + "* ".repeat(k);
      } else {
        let down = i - mid;
        j = down; // spaces
        k = 2 * (rows - i) - 1; // stars
        stars = " ".repeat(j) + "* ".repeat(k);
      }

      document.getElementById("i-value").innerText = i;
      document.getElementById("j-value").innerText = j;
      document.getElementById("k-value").innerText = k;
      document.getElementById("pattern-value").innerText = stars;
      break;

    
      
    case "rtriangle":
      i = currentStep;
      stars = "* ".repeat(i + 1);

      document.getElementById("i-value").innerText = i;
      document.getElementById("pattern-value").innerText = stars.trim();
      break;

    case "hpyramid":
      i = currentStep;
      if (i === rows - 1) {
        stars = "* ".repeat(2 * i + 1);
      } else {
        let line = "";
        for (k = 0; k <= 2 * i; k++) {
          if (k === 0 || k === 2 * i) line += "* ";
          else line += "  ";
        }
        stars = " ".repeat(rows - i - 1) + line;
      }
      document.getElementById("pattern-value").innerText = stars;
      break;


    case "hsquare":
      i = currentStep;
      stars = "";
      for (j = 0; j < rows; j++) {
        if (i === 0 || i === rows - 1 || j === 0 || j === rows - 1) {
          stars += "* ";
        } else {
          stars += "  ";
        }
      }
      document.getElementById("pattern-value").innerText = stars;
      break;


    case "hdiamond":
      let midH = Math.floor(rows / 2);
      i = currentStep;
      if (i <= midH) {
        let line = "";
        for (k = 0; k <= 2 * i; k++) {
          if (k === 0 || k === 2 * i) line += "* ";
          else line += "  ";
        }
        stars = " ".repeat(midH - i) + line;
      } else {
        let down = i - midH;
        let line = "";
        for (k = 0; k < 2 * (rows - i) - 1; k++) {
          if (k === 0 || k === 2 * (rows - i) - 2) line += "* ";
          else line += "  ";
        }
        stars = " ".repeat(down + 1) + line;
      }
      document.getElementById("pattern-value").innerText = stars;
      break;


        
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
