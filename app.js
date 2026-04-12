const NyashHub = {
    candies: parseInt(localStorage.getItem('hub_candies')) || 0,
    activeTheme: localStorage.getItem('hub_theme') || 'theme-cherry-blossom',
    
    init() {
        this.updateCandies(0);
        this.applyTheme(this.activeTheme);
        UI.renderThemes();
        UI.renderFonts();
        NyashDiary.render();
    },

    updateCandies(val) {
        this.candies += val;
        localStorage.setItem('hub_candies', this.candies);
        document.getElementById('candy-count').innerText = this.candies;
    },

    applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('hub_theme', theme);
    }
};

const UI = {
    openModal(view) {
        document.getElementById('modal-container').classList.remove('hidden');
        document.querySelectorAll('.modal-view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${view}`).classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-container').classList.add('hidden');
    },

    handleOverlayClick(e) {
        if (e.target.id === 'modal-container') this.closeModal();
    },

    renderThemes() {
        const themes = ['theme-cherry-blossom', 'theme-midnight-galaxy', 'theme-ocean-breeze']; // Добавь все 12
        const grid = document.getElementById('theme-picker');
        grid.innerHTML = themes.map(t => `<div class="swatch ${t}" onclick="NyashHub.applyTheme('${t}')"></div>`).join('');
    }
};

const NyashPet = {
    interact() {
        NyashHub.updateCandies(1);
        const pet = document.getElementById('pet-main');
        pet.style.transform = 'scale(1.2) rotate(10deg)';
        setTimeout(() => pet.style.transform = '', 200);
    }
};

const NyashOracle = {
    generate() {
        const res = document.getElementById('oracle-response');
        res.innerText = "🔮 Думаю...";
        setTimeout(() => {
            const answers = ["Ня! Да!", "Мяу, нет...", "Возможно ✨", "Спроси позже 🐾"];
            res.innerText = answers[Math.floor(Math.random() * answers.length)];
        }, 800);
    }
};

const NyashDiary = {
    save() {
        const input = document.getElementById('diary-input');
        if (!input.value) return;
        const entry = { text: input.value, date: new Date().toLocaleDateString() };
        let logs = JSON.parse(localStorage.getItem('hub_diary')) || [];
        logs.unshift(entry);
        localStorage.setItem('hub_diary', JSON.stringify(logs));
        input.value = '';
        this.render();
        NyashHub.updateCandies(5);
    },
    render() {
        const logs = JSON.parse(localStorage.getItem('hub_diary')) || [];
        document.getElementById('diary-history').innerHTML = logs.map(l => `
            <div class="history-item">
                <small>${l.date}</small>
                <p>${l.text}</p>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => NyashHub.init());
