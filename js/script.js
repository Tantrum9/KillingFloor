const tiers = [5, 10, 15, 20, 25, 30];

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

function loadPlanner() {
  planner.innerHTML = '';
  tiers.forEach(level => {
    const tierDiv = document.createElement('div');
    tierDiv.className = 'tier';
    tierDiv.innerHTML = `<h3>Level ${level}</h3>`;

    skillsData[level].forEach(skill => {
      const key = `${level}:${skill}`;
      const currentProf = state[key] || 0;

      const btn = document.createElement('div');
      btn.className = 'skill-btn';
      btn.dataset.level = level;
      btn.dataset.skill = skill;
      btn.dataset.proficiency = currentProf;

      btn.innerHTML = `
        <img src="assets/buttons/unchecked.svg" class="btn-img unchecked" />
        <img src="assets/buttons/prof${currentProf}.svg" class="btn-img prof" />
        <span class="skill-label">${skill}</span>
      `;

      btn.onclick = () => {
        let newProf = (+btn.dataset.proficiency + 1) % 4;
        btn.dataset.proficiency = newProf;
        state[key] = newProf;

        const profImg = btn.querySelector('.prof');
        profImg.src = `assets/buttons/prof${newProf}.svg`;

        persist();
        updateSummary();
      };

      tierDiv.appendChild(btn);
    });

    planner.appendChild(tierDiv);
  });

  updateSummary();
}

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

document.getElementById('resetBtn').onclick = () => {
  state = {};
  localStorage.removeItem('kf3-commando');
  loadPlanner();
};

loadPlanner();
