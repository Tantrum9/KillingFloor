// Slot pattern per level
const slotPlan = [
  {lvl:2, col:'passives', count:2}, {lvl:4, col:'throwables', count:3},
  {lvl:6, col:'gadgets', count:3}, {lvl:8, col:'passives', count:3},
  {lvl:10,col:'throwables',count:1}, {lvl:12,col:'gadgets',count:2},
  {lvl:14,col:'passives',count:2}, {lvl:16,col:'throwables',count:2},
  {lvl:18,col:'gadgets',count:3}, {lvl:20,col:'passives',count:2},
  {lvl:22,col:'throwables',count:1}, {lvl:24,col:'gadgets',count:2},
  {lvl:26,col:'passives',count:3}, {lvl:28,col:'throwables',count:3},
  {lvl:30,col:'gadgets',count:3}
];

let state = JSON.parse(localStorage.getItem('kf3-commando')) || {};
const summaryList = document.getElementById('summaryList');

function build() {
  ['passives','throwables','gadgets'].forEach(id => {
    document.querySelector(`#${id} .slots`).innerHTML = '';
  });
  slotPlan.forEach(({lvl,col,count}) => {
    for(let i=1;i<=count;i++){
      const key = `${lvl}:${i}`;
      const prof = state[key] || 0;
      const btn = document.createElement('div');
      btn.className = 'skill-btn';
      btn.dataset.key = key;
      btn.dataset.proficiency = prof;
      btn.innerHTML = `
        <img src="assets/buttons/unchecked.svg" class="btn-img unchecked">
        <img src="assets/buttons/prof${prof}.svg" class="btn-img prof">
        <span class="skill-label">L${lvl}-${i}</span>`;
      btn.onclick = () => cycle(btn);
      document.querySelector(`#${col} .slots`).appendChild(btn);
    }
  });
  updateSummary();
}

function cycle(btn) {
  const key = btn.dataset.key;
  const prof = (+btn.dataset.proficiency + 1) % 4;
  btn.dataset.proficiency = prof;
  state[key] = prof;
  btn.querySelector('.prof').src = `assets/buttons/prof${prof}.svg`;
  persist();
  updateSummary();
}

function updateSummary(){
  summaryList.innerHTML = '';
  Object.entries(state).forEach(([key, prof]) => {
    if (prof>0) {
      const [lvl,i] = key.split(':');
      const li = document.createElement('li');
      li.textContent = `Lv${lvl}-${i} → Prof${prof}`;
      summaryList.appendChild(li);
    }
  });
}

function persist() {
  localStorage.setItem('kf3-commando', JSON.stringify(state));
}

document.getElementById('resetBtn').onclick = () => {
  state = {};
  persist();
  build();
};

build();
