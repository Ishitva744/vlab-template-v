const state = {
  loopType:   'for',
  pattern:    'triangle',
  symbol:     '*',
  lang:       'js',
  n:          8,
  speed:      150,
  running:    false,
  steps:      [],
  stepIndex:  0,
  iterCount:  0,
  printCount: 0,
  animTimer:  null,
};

//PATTERN NOTES
function getPatternNote(pattern, n) {
  switch (pattern) {
    case 'diamond':
      return n % 2 === 0
        ? `<strong>Note:</strong> Even n = ${n} means no single centre cell. The diamond forms a <strong>2x2 centre</strong>. Use an <strong>odd n</strong> (e.g. 7, 9) for perfect symmetry.`
        : `<strong>Note:</strong> Odd n = ${n} means single centre cell at row ${Math.floor(n/2)}. Diamond will be fully symmetric.`;
    case 'inverted':
      return `<strong>Note:</strong> Each row prints <code>n - i</code> symbols. Compare with triangle which prints <code>i + 1</code> — the loop bound is just flipped.`;
    case 'checker':
      return `<strong>Note:</strong> Prints only when <code>(i + j) % 2 === 0</code>. The loop still visits every cell, the condition gates the print.`;
    case 'wave':
      return `<strong>Note:</strong> The outer loop iterates over <strong>columns</strong>. Each column is printed from a sine-curve row downward — fill count varies per column.`;
    case 'hollow':
      return `<strong>Note:</strong> Prints only border cells: <code>i === 0 || i === n-1 || j === 0 || j === n-1</code>. The inner loop still runs n² times total.`;
    case 'staircase':
      return `<strong>Note:</strong> Row r prints <code>Math.floor(r / step) + 1</code> symbols. Increase n to see wider steps. The step size is <code>Math.max(1, Math.floor(n/4))</code>.`;
    default:
      return null;
  }
}

function updatePatternNote() {
  const banner = document.getElementById('patternNote');
  const msg    = getPatternNote(state.pattern, state.n);
  if (msg) { banner.innerHTML = msg; banner.classList.add('visible'); }
  else      { banner.classList.remove('visible'); }
}

//OUTPUT GRID  (n × n cells)
function buildGrid() {
  const grid = document.getElementById('outputGrid');
  grid.innerHTML = '';
  for (let i = 0; i < state.n ; i++) {
    const row = document.createElement('div');
    row.className = 'grid-row';
    row.id = `row-${i}`;
    for (let j = 0; j < state.n + 1; j++) {
      const cell = document.createElement('span');
      cell.className = 'grid-cell empty';
      cell.id = `cell-${i}-${j}`;
      cell.textContent = state.symbol;
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function printCell(row, col, flash) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (!cell) return;
  cell.textContent = state.symbol;
  if (flash) {
    cell.className = 'grid-cell flashing';
    setTimeout(() => { cell.className = 'grid-cell filled'; }, 80);
  } else {
    cell.className = 'grid-cell filled';
  }
}

function clearGrid() {
  for (let i = 0; i < state.n; i++)
    for (let j = 0; j < state.n; j++) {
      const c = document.getElementById(`cell-${i}-${j}`);
      if (c) { c.className = 'grid-cell empty'; c.textContent = state.symbol; }
    }
}

//STEP GENERATORS
function generateSteps() {
  const n = state.n, steps = [];
  const print = (r, c, msg) => steps.push({ type:'print', row:r, col:c, logType:'log-inner', logMsg: msg });
  const iter  = (msg)        => steps.push({ type:'iter',           logType:'log-iter',  logMsg: msg });
  const done  = (msg)        => steps.push({ type:'done',           logType:'log-done',  logMsg: msg });

  switch (state.pattern) {
    case 'triangle':
      for (let i = 0; i < n; i++) {
        iter(`i = ${i}  →  outer loop`);
        for (let j = 0; j <= i; j++)
          print(i, j, `  j = ${j}  →  print [${i}][${j}]`);
      }
      break;

    case 'square':
      for (let i = 0; i < n; i++) {
        iter(`i = ${i}  →  outer loop`);
        for (let j = 0; j < n; j++)
          print(i, j, `  j = ${j}  →  print [${i}][${j}]`);
      }
      break;

    case 'diamond': {
      const mid = Math.floor(n / 2);
      for (let i = 0; i < n; i++) {
        const d = mid - Math.abs(i - mid);
        iter(`i = ${i}  →  d = ${d}`);
        for (let j = mid - d; j <= mid + d; j++)
          print(i, j, `  j = ${j}  →  print [${i}][${j}]`);
      }
      break;
    }

    case 'inverted':
    for (let i = 0; i < n; i++) {
      iter(`i = ${i}  →  outer loop`);
      for (let j = 0; j < n - i; j++)
        print(i, j, `  j = ${j}  →  print [${i}][${j}]`);
    }
    break;
        
    case 'checker':
      for (let i = 0; i < n; i++) {
        iter(`i = ${i}`);
        for (let j = 0; j < n; j++)
          if ((i + j) % 2 === 0)
            print(i, j, `  j = ${j}  (${i}+${j})%2=0  →  print [${i}][${j}]`);
      }
      break;

    case 'wave':
      for (let j = 0; j < n; j++) {
        const row = Math.round((Math.sin(j / n * Math.PI * 2) * 0.4 + 0.5) * (n - 1));
        iter(`j = ${j}  →  start row = ${row}`);
        for (let r = row; r < n; r++)
          print(r, j, `  r = ${r}  →  print [${r}][${j}]`);
      }
      break;

    case 'hollow':
      for (let i = 0; i < n; i++) {
        iter(`i = ${i}`);
        for (let j = 0; j < n; j++)
          if (i === 0 || i === n-1 || j === 0 || j === n-1)
            print(i, j, `  j = ${j}  border cell  →  print [${i}][${j}]`);
      }
      break;

    case 'staircase': {
      const step = Math.max(1, Math.floor(n / 4));
      for (let i = 0; i < n; i++) {
        const count = Math.floor(i / step) + 1;
        iter(`i = ${i}  →  count = ${count}`);
        for (let j = 0; j < count; j++)
          print(i, j, `  j = ${j}  →  print [${i}][${j}]`);
      }
      break;
    }
  }

  done(`Done — ${steps.filter(s => s.type === 'print').length} symbols printed`);
  return steps;
}

//  CODE TEMPLATES
const CODE = {
  js: {
    'for-triangle': [
      '// Triangle — for loop',
      'const n = SZ;',
      'for (let i = 0; i < n; i++) {',
      '  let row = "";',
      '  for (let j = 0; j <= i; j++) {',
      '    row += "SYM";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-triangle': [
      '// Triangle — while loop',
      'const n = SZ;',
      'let i = 0;',
      'while (i < n) {',
      '  let row = "";',
      '  let j = 0;',
      '  while (j <= i) {',
      '    row += "SYM";',
      '    j++;',
      '  }',
      '  console.log(row);',
      '  i++;',
      '}',
    ],
    'for-square': [
      '// Square — for loop',
      'const n = SZ;',
      'for (let i = 0; i < n; i++) {',
      '  let row = "";',
      '  for (let j = 0; j < n; j++) {',
      '    row += "SYM";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-square': [
      '// Square — while loop',
      'const n = SZ;',
      'let i = 0;',
      'while (i < n) {',
      '  let row = "";',
      '  let j = 0;',
      '  while (j < n) {',
      '    row += "SYM";',
      '    j++;',
      '  }',
      '  console.log(row);',
      '  i++;',
      '}',
    ],
    'for-diamond': [
      '// Diamond — for loop',
      'const n = SZ;',
      'const mid = Math.floor(n / 2);',
      'for (let i = 0; i < n; i++) {',
      '  const d = mid - Math.abs(i - mid);',
      '  let row = " ".repeat(mid - d);',
      '  for (let j = mid-d; j <= mid+d; j++) {',
      '    row += "SYM";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-diamond': [
      '// Diamond — while loop',
      'const n = SZ;',
      'const mid = Math.floor(n / 2);',
      'let i = 0;',
      'while (i < n) {',
      '  const d = mid - Math.abs(i - mid);',
      '  let row = " ".repeat(mid - d);',
      '  let j = mid - d;',
      '  while (j <= mid + d) {',
      '    row += "SYM"; j++;',
      '  }',
      '  console.log(row);',
      '  i++;',
      '}',
    ],
    'for-inverted': [
      '// Inverted Triangle — for loop',
      'const n = SZ;',
      'for (let i = 0; i < n; i++) {',
      '  let row = "";',
      '  for (let j = 0; j < n - i; j++) {',
      '    row += "SYM";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-inverted': [
      '// Inverted Triangle — while loop',
      'const n = SZ;',
      'let i = 0;',
      'while (i < n) {',
      '  let row = ""; let j = 0;',
      '  while (j < n - i) {',
      '    row += "SYM"; j++;',
      '  }',
      '  console.log(row); i++;',
      '}',
    ],
    'for-checker': [
      '// Checkerboard — for loop',
      'const n = SZ;',
      'for (let i = 0; i < n; i++) {',
      '  let row = "";',
      '  for (let j = 0; j < n; j++) {',
      '    row += (i+j) % 2 === 0 ? "SYM" : " ";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-checker': [
      '// Checkerboard — while loop',
      'const n = SZ;',
      'let i = 0;',
      'while (i < n) {',
      '  let row = ""; let j = 0;',
      '  while (j < n) {',
      '    row += (i+j) % 2 === 0 ? "SYM" : " ";',
      '    j++;',
      '  }',
      '  console.log(row);',
      '  i++;',
      '}',
    ],
    'for-wave': [
      '// Wave — for loop',
      'const n = SZ;',
      'for (let j = 0; j < n; j++) {',
      '  const startRow = Math.round(',
      '    (Math.sin(j/n*Math.PI*2)*0.4+0.5)*(n-1));',
      '  let row = "";',
      '  for (let r = startRow; r < n; r++) {',
      '    row += "SYM";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-wave': [
      '// Wave — while loop',
      'const n = SZ;',
      'let j = 0;',
      'while (j < n) {',
      '  const startRow = Math.round(',
      '    (Math.sin(j/n*Math.PI*2)*0.4+0.5)*(n-1));',
      '  let row = ""; let r = startRow;',
      '  while (r < n) {',
      '    row += "SYM"; r++;',
      '  }',
      '  console.log(row); j++;',
      '}',
    ],
    'for-hollow': [
      '// Hollow Square — for loop',
      'const n = SZ;',
      'for (let i = 0; i < n; i++) {',
      '  let row = "";',
      '  for (let j = 0; j < n; j++) {',
      '    const border = i===0 || i===n-1',
      '                || j===0 || j===n-1;',
      '    row += border ? "SYM" : " ";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-hollow': [
      '// Hollow Square — while loop',
      'const n = SZ;',
      'let i = 0;',
      'while (i < n) {',
      '  let row = ""; let j = 0;',
      '  while (j < n) {',
      '    const border = i===0 || i===n-1',
      '                || j===0 || j===n-1;',
      '    row += border ? "SYM" : " ";',
      '    j++;',
      '  }',
      '  console.log(row); i++;',
      '}',
    ],
    'for-staircase': [
      '// Staircase — for loop',
      'const n = SZ;',
      'const step = Math.max(1, Math.floor(n/4));',
      'for (let i = 0; i < n; i++) {',
      '  const count = Math.floor(i / step) + 1;',
      '  let row = "";',
      '  for (let j = 0; j < count; j++) {',
      '    row += "SYM";',
      '  }',
      '  console.log(row);',
      '}',
    ],
    'while-staircase': [
      '// Staircase — while loop',
      'const n = SZ;',
      'const step = Math.max(1, Math.floor(n/4));',
      'let i = 0;',
      'while (i < n) {',
      '  const count = Math.floor(i / step) + 1;',
      '  let row = ""; let j = 0;',
      '  while (j < count) {',
      '    row += "SYM"; j++;',
      '  }',
      '  console.log(row); i++;',
      '}',
    ],
  },

  py: {
    'for-triangle': [
      '# Triangle — for loop',
      'n = SZ',
      'for i in range(n):',
      '    print("SYM" * (i + 1))',
    ],
    'while-triangle': [
      '# Triangle — while loop',
      'n = SZ',
      'i = 0',
      'while i < n:',
      '    print("SYM" * (i + 1))',
      '    i += 1',
    ],
    'for-square': [
      '# Square — for loop',
      'n = SZ',
      'for i in range(n):',
      '    print("SYM" * n)',
    ],
    'while-square': [
      '# Square — while loop',
      'n = SZ',
      'i = 0',
      'while i < n:',
      '    print("SYM" * n)',
      '    i += 1',
    ],
    'for-diamond': [
      '# Diamond — for loop',
      'n = SZ',
      'mid = n // 2',
      'for i in range(n):',
      '    d = mid - abs(i - mid)',
      '    print(" " * (mid - d) + "SYM" * (2*d + 1))',
    ],
    'while-diamond': [
      '# Diamond — while loop',
      'n = SZ',
      'mid = n // 2',
      'i = 0',
      'while i < n:',
      '    d = mid - abs(i - mid)',
      '    print(" " * (mid-d) + "SYM" * (2*d+1))',
      '    i += 1',
    ],
    'for-inverted': [
      '# Inverted Triangle — for loop',
      'n = SZ',
      'for i in range(n):',
      '    print("SYM" * (n - i))',
    ],
    'while-inverted': [
      '# Inverted Triangle — while loop',
      'n = SZ',
      'i = 0',
      'while i < n:',
      '    print("SYM" * (n - i))',
      '    i += 1',
    ],
    'for-checker': [
      '# Checkerboard — for loop',
      'n = SZ',
      'for i in range(n):',
      '    row = ""',
      '    for j in range(n):',
      '        row += "SYM" if (i+j)%2==0 else " "',
      '    print(row)',
    ],
    'while-checker': [
      '# Checkerboard — while loop',
      'n = SZ',
      'i = 0',
      'while i < n:',
      '    row = ""; j = 0',
      '    while j < n:',
      '        row += "SYM" if (i+j)%2==0 else " "',
      '        j += 1',
      '    print(row); i += 1',
    ],
    'for-wave': [
      '# Wave — for loop',
      'import math',
      'n = SZ',
      'for j in range(n):',
      '    start = round((math.sin(j/n*math.pi*2)*0.4+0.5)*(n-1))',
      '    for r in range(start, n):',
      '        print("SYM", end="")',
      '    print()',
    ],
    'while-wave': [
      '# Wave — while loop',
      'import math',
      'n = SZ',
      'j = 0',
      'while j < n:',
      '    start = round((math.sin(j/n*math.pi*2)*0.4+0.5)*(n-1))',
      '    r = start',
      '    while r < n:',
      '        print("SYM", end=""); r += 1',
      '    print(); j += 1',
    ],
    'for-hollow': [
      '# Hollow Square — for loop',
      'n = SZ',
      'for i in range(n):',
      '    row = ""',
      '    for j in range(n):',
      '        if i in (0,n-1) or j in (0,n-1):',
      '            row += "SYM"',
      '        else:',
      '            row += " "',
      '    print(row)',
    ],
    'while-hollow': [
      '# Hollow Square — while loop',
      'n = SZ',
      'i = 0',
      'while i < n:',
      '    row = ""; j = 0',
      '    while j < n:',
      '        if i in (0,n-1) or j in (0,n-1):',
      '            row += "SYM"',
      '        else:',
      '            row += " "',
      '        j += 1',
      '    print(row); i += 1',
    ],
    'for-staircase': [
      '# Staircase — for loop',
      'n = SZ',
      'step = max(1, n // 4)',
      'for i in range(n):',
      '    count = i // step + 1',
      '    print("SYM" * count)',
    ],
    'while-staircase': [
      '# Staircase — while loop',
      'n = SZ',
      'step = max(1, n // 4)',
      'i = 0',
      'while i < n:',
      '    count = i // step + 1',
      '    print("SYM" * count)',
      '    i += 1',
    ],
  }
};

// Build code display
function buildCodeLines() {
  const key   = `${state.loopType}-${state.pattern}`;
  const bank  = CODE[state.lang];
  const raw   = bank[key] || bank['for-triangle'];
  // Replace SYM and SZ placeholders
  const lines = raw.map(l =>
    l.replace(/SYM/g, state.symbol)
     .replace(/SZ/g, state.n)
  );

  const disp = document.getElementById('codeDisplay');
  disp.innerHTML = '';
  lines.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'code-line';
    div.id = `cl-${i}`;
    div.innerHTML = `<span class="line-num">${i+1}</span><span>${syntaxHL(escapeHtml(text))}</span>`;
    disp.appendChild(div);
  });
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function syntaxHL(s) {
  // JS keywords
  if (state.lang === 'js') {
    return s
      .replace(/\b(const|let|for|while|if|return|Math|Array|process)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(console\.log|Math\.floor|Math\.round|Math\.abs|Math\.sin|Math\.max|repeat|forEach|join|fill|from)\b/g, '<span class="fn">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
      .replace(/(\/\/[^<]*)/g, '<span class="cm">$1</span>')
      .replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g, '<span class="str">$1</span>');
  } else {
    return s
      .replace(/\b(for|while|if|else|in|range|print|import|math|def|return|and|not)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(abs|round|max|sin|pi)\b/g, '<span class="fn">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
      .replace(/(#[^<]*)/g, '<span class="cm">$1</span>')
      .replace(/(&quot;[^&]*&quot;)/g, '<span class="str">$1</span>');
  }
}

function highlightCodeLine(idx) {
  document.querySelectorAll('.code-line').forEach(l => l.classList.remove('highlight'));
  const lines = document.querySelectorAll('.code-line');
  if (lines[Math.min(idx, lines.length - 1)])
    lines[Math.min(idx, lines.length - 1)].classList.add('highlight');
}

//Copy code to clipboard
function copyCode() {
  const key  = `${state.loopType}-${state.pattern}`;
  const bank = CODE[state.lang];
  const raw  = bank[key] || bank['for-triangle'];
  const text = raw.map(l =>
    l.replace(/SYM/g, state.symbol).replace(/SZ/g, state.n)
  ).join('\n');

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1800);
  });
}

// EXECUTION LOG
function log(msg, cls) {
  const area = document.getElementById('logArea');
  const ph   = area.querySelector('.log-placeholder');
  if (ph) ph.remove();
  const div = document.createElement('div');
  div.className = `log-entry ${cls}`;
  div.textContent = msg;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}
function clearLog() {
  document.getElementById('logArea').innerHTML =
    '<div class="log-placeholder">Logs will appear here<br>when you run the loop.</div>';
}

// CONTROLS
function setLoop(type, el) {
  state.loopType = type;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  buildCodeLines(); resetAll();
}

function setPattern(p, el) {
  state.pattern = p;
  document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  updatePatternNote(); buildCodeLines(); resetAll();
}

function setSymbol(sym, el) {
  state.symbol = sym;
  document.querySelectorAll('.sym-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  // update displayed symbols in grid without full reset
  document.querySelectorAll('.grid-cell').forEach(c => c.textContent = sym);
  buildCodeLines();
}

function setSpeed(ms, el) {
  state.speed = ms;
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function setLang(lang, el) {
  state.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  buildCodeLines();
}

function updateSize(v) {
  state.n = +v;
  document.getElementById('sizeVal').textContent = v;
  updatePatternNote(); buildCodeLines(); resetAll();
}

//  RESET
function resetAll() {
  if (state.animTimer) { clearTimeout(state.animTimer); state.animTimer = null; }
  state.running    = false;
  state.steps      = [];
  state.stepIndex  = 0;
  state.iterCount  = 0;
  state.printCount = 0;
  document.getElementById('runBtn').disabled  = false;
  document.getElementById('stepBtn').disabled = false;
  updateStats(); updateProgress(0, 'Ready');
  buildGrid(); clearLog(); buildCodeLines();
}

//  ANIMATION ENGINE
function prepareSteps() {
  if (state.steps.length === 0) state.steps = generateSteps();
}

function executeStep(step) {
  const nLines = document.querySelectorAll('.code-line').length;
  if      (step.type === 'print') highlightCodeLine(Math.floor(nLines * 0.6));
  else if (step.type === 'iter')  highlightCodeLine(2);
  else                            highlightCodeLine(nLines - 1);

  if (step.type === 'print') {
    printCell(step.row, step.col, true);
    state.printCount++;
  } else if (step.type === 'iter') {
    state.iterCount++;
  }

  state.stepIndex++;
  log(step.logMsg, step.logType);
  updateStats();
  updateProgress(
    state.stepIndex / state.steps.length * 100,
    `Step ${state.stepIndex} / ${state.steps.length}`
  );
}

function runAnimation() {
  if (state.running) return;
  prepareSteps();
  state.running = true;
  document.getElementById('runBtn').disabled  = true;
  document.getElementById('stepBtn').disabled = true;
  function tick() {
    if (state.stepIndex >= state.steps.length) { state.running = false; return; }
    executeStep(state.steps[state.stepIndex]);
    state.animTimer = setTimeout(tick, state.speed);
  }
  tick();
}

function stepAnimation() {
  prepareSteps();
  if (state.stepIndex >= state.steps.length) return;
  document.getElementById('runBtn').disabled = true;
  executeStep(state.steps[state.stepIndex]);
  if (state.stepIndex >= state.steps.length)
    document.getElementById('stepBtn').disabled = true;
}

//  UI UPDATES
function updateStats() {
  document.getElementById('statIter').textContent    = state.iterCount;
  document.getElementById('statPrinted').textContent = state.printCount;
  document.getElementById('statSteps').textContent   = state.stepIndex;
}
function updateProgress(pct, label) {
  document.getElementById('progressFill').style.width  = pct + '%';
  document.getElementById('progressLabel').textContent = label;
  document.getElementById('progressPct').textContent   = Math.round(pct) + '%';
}




buildCodeLines();
buildGrid();
updatePatternNote();