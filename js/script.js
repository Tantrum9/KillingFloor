const tiers = [5, 10, 15, 20, 25, 30]; // Commando perk levels

// Placeholder skills (to update with real data later)
const skillsData = {
  5: ['Skill A', 'Skill B'],
  10: ['Skill C', 'Skill D'],
  15: ['Skill E', 'Skill F'],
  20: ['Skill G', 'Skill H'],
  25: ['Skill I', 'Skill J'],
  30: ['Skill K', 'Skill L']
};

let state = JSON.parse(localStorage.getItem('kf3-commando')) || {};

const planner = document.getElementById('planner');
const summaryList = document.getElementById('summaryList');

// Build planner UI
tiers.forEach(level => {
  const tierDiv = document.createElement('div');
  tierDiv.className = 'tier';
  tierDiv.innerHTML = `<h3>Level ${level}</h3>`;
  
  skillsData[level].forEach(skill => {
    const btn = document.createElement('div');
    btn.className = 'skill-btn';
    btn.dataset.level = level;
    btn.dataset.skill = skill;
    btn.dataset.proficiency = state[`${level}:${skill}`] || 0;
    btn.innerText = `${skill} (Prof: ${btn.dataset.proficiency})`;
    
    btn.onclick = () => {
      state[`${level}:${skill}`] = (+btn.dataset.proficiency + 1) % 4;
      btn.dataset.proficiency = state[`${level}:${skill}`];
      btn.innerText = `${skill} (Prof: ${btn.dataset.proficiency})`;
      updateSummary();
      persist();
    };

    tierDiv.appendChild(btn);
  });

  planner.appendChild(tierDiv);
});

// Summary + Pagination
function updateSummary() {
  summaryList.innerHTML = '';
  Object.entries(state).forEach(([key, prof]) => {
    if (prof > 0) {
      const [lvl, skill] = key.split(':');
      const li = document.createElement('li');
      li.textContent = `L${lvl}: ${skill} – Prof ${prof}`;
      summaryList.appendChild(li);
    }
  });
}

function persist() {
  localStorage.setItem('kf3-commando', JSON.stringify(state));
}

// Reset button
document.getElementById('resetBtn').onclick = () => {
  state = {};
  localStorage.removeItem('kf3-commando');
  document.querySelectorAll('.skill-btn').forEach(btn => {
    btn.dataset.proficiency = 0;
    btn.innerText = `${btn.dataset.skill} (Prof: 0)`;
  });
  updateSummary();
};

updateSummary();
