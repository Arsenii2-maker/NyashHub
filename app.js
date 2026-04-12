const NyashHub = {
    candies: parseInt(localStorage.getItem('candies')) || 0,
    
    init() {
        this.updateCandies(0);
        this.applyTheme(localStorage.getItem('theme') || 'theme-cherry-blossom');
    },

    updateCandies(n) {
        this.candies += n;
        localStorage.setItem('candies', this.candies);
        document.getElementById('count').innerText = this.candies;
    },

    applyTheme(t) {
        document.body.className = t;
        localStorage.setItem('theme', t);
    }
};

const UI = {
    toggleModal(type) {
        const layer = document.getElementById('ui-layer');
        const content = document.getElementById('modal-content');
        layer.classList.remove('hidden');

        if (type === 'oracle') {
            content.innerHTML = `
                <h2>🔮 Оракул</h2>
                <p id="oracle-text" style="margin: 20px 0; font-size: 18px;">Задай вопрос и коснись кристалла...</p>
                <div onclick="NyashOracle.spin()" style="font-size: 60px; cursor:pointer;">✨</div>
            `;
        } else if (type === 'settings') {
            content.innerHTML = `
                <h2>⚙️ Стиль комнаты</h2>
                <div class="theme-grid">
                    <div class="swatch theme-cherry-blossom" onclick="NyashHub.applyTheme('theme-cherry-blossom')"></div>
                    <div class="swatch theme-midnight" onclick="NyashHub.applyTheme('theme-midnight')"></div>
                    </div>
                <label>Шрифт:</label>
                <select onchange="document.body.style.fontFamily = this.value">
                    <option value="Comfortaa">Закругленный</option>
                    <option value="Arial">Обычный</option>
                    <option value="Courier New">Кодерский</option>
                </select>
            `;
        } else if (type === 'diary') {
            content.innerHTML = `
                <h2>📔 Дневник</h2>
                <textarea id="diary-memo" rows="4" placeholder="Твои мысли..."></textarea>
                <button class="nyash-btn" onclick="NyashDiary.save()" style="margin-top:10px;">Записать</button>
                <div id="logs" style="margin-top:15px; max-height: 150px; overflow-y:auto;"></div>
            `;
            NyashDiary.render();
        }
    },

    close() { document.getElementById('ui-layer').classList.add('hidden'); }
};

const NyashPet = {
    tap() {
        NyashHub.updateCandies(1);
        const msg = document.getElementById('pet-msg');
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 1500);
    }
};

const NyashOracle = {
    spin() {
        const txt = document.getElementById('oracle-text');
        txt.innerText = "🔮 Хмм...";
        setTimeout(() => {
            const res = ["Да, ня!", "Мяу, нет...", "Всё будет супер!", "Звезды молчат..."];
            txt.innerText = res[Math.floor(Math.random() * res.length)];
        }, 800);
    }
};

const NyashDiary = {
    save() {
        const txt = document.getElementById('diary-memo').value;
        if (!txt) return;
        let logs = JSON.parse(localStorage.getItem('logs')) || [];
        logs.unshift({t: txt, d: new Date().toLocaleDateString()});
        localStorage.setItem('logs', JSON.stringify(logs));
        this.render();
    },
    render() {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        const container = document.getElementById('logs');
        if (container) {
            container.innerHTML = logs.map(l => `<div style="padding:5px; border-bottom:1px solid #ddd"><small>${l.d}</small><p>${l.t}</p></div>`).join('');
        }
    }
};

NyashHub.init();
