const rulesDiv = document.getElementById('rules');
const addBtn = document.getElementById('add');

let rules = [];

async function load() {
  const data = await browser.storage.local.get('rules');
  rules = data.rules || [];
  render();
}

function render() {
  rulesDiv.innerHTML = '';
  rules.forEach((rule, i) => {
    const div = document.createElement('div');
    div.className = 'rule';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = rule.enabled;
    checkbox.dataset.i = i;
    checkbox.dataset.field = 'enabled';
    
    const fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.value = rule.from;
    fromInput.placeholder = 'from';
    fromInput.dataset.i = i;
    fromInput.dataset.field = 'from';
    
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '→';
    
    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.value = rule.to;
    toInput.placeholder = 'to';
    toInput.dataset.i = i;
    toInput.dataset.field = 'to';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = '×';
    deleteBtn.dataset.i = i;
    
    div.appendChild(checkbox);
    div.appendChild(fromInput);
    div.appendChild(arrow);
    div.appendChild(toInput);
    div.appendChild(deleteBtn);
    rulesDiv.appendChild(div);
  });
}

async function save() {
  await browser.storage.local.set({ rules });
  browser.runtime.sendMessage({ type: 'update' });
}

rulesDiv.addEventListener('change', (e) => {
  const i = parseInt(e.target.dataset.i);
  const field = e.target.dataset.field;
  if (field === 'enabled') {
    rules[i].enabled = e.target.checked;
  } else {
    rules[i][field] = e.target.value;
  }
  save();
});

rulesDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const i = parseInt(e.target.dataset.i);
    rules.splice(i, 1);
    save();
    render();
  }
});

addBtn.addEventListener('click', () => {
  rules.push({ enabled: true, from: '', to: '' });
  save();
  render();
});

load();
