const Game = {
    candies: parseInt(localStorage.getItem('n_c')) || 0,
    inv: JSON.parse(localStorage.getItem('n_i')) || [],
    theme: localStorage.getItem('n_t') || 'theme-cherry-blossom',
    font: localStorage.getItem('n_f') || 'font-main',
    currentPet: localStorage.getItem('n_p') || '🤖',

    // Магазин мебели
    shop: {
        'wardrobe': { n: 'Шкаф', p: 10, i: '👗', pos: 'top: 15%; left: 8%;', f: () => UI.open('settings') },
        'desk': { n: 'Стол', p: 30, i: '💻', pos: 'bottom: 25%; left: 15%;', f: () => UI.open('diary') },
        'oracle': { n: 'Оракул', p: 50, i: '🔮', pos: 'top: 20%; right: 10%;', f: () => UI.open('oracle') }
    },

    // Список питомцев
    pets: [
        { n: 'Робот', i: '🤖' },
        { n: 'Котик', i: '🐱' },
        { n: 'Песик', i: '🐶' },
        { n: 'Хомяк', i: '🐹' },
        { n: 'Дракон', i: '🐲' },
        { n: 'Единорог', i: '🦄' }
    ],

    init() {
        this.updateStats();
        this.applyStyle();
        this.renderRoom();
        document.getElementById('pet-avatar').innerText = this.currentPet;
    },

    updateStats() {
        document.getElementById('balance').innerText = this.candies;
        localStorage.setItem('n_c', this.candies);
    },

    tapPet(e) {
        this.candies++;
        this.updateStats();
        const msg = document.getElementById('tap-msg');
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 600);
        // Звуковой эффект нажатия можно добавить тут
    },

    renderRoom() {
        const layer = document.getElementById('furniture-layer');
        layer.innerHTML = '';
        this.inv.forEach(id => {
            const item = this.shop[id];
            const div = document.createElement('div');
            div.className = 'f-item';
            div.style = item.pos;
            div.onclick = (e) => { e.stopPropagation(); item.f(); };
            div.innerHTML = `<span>${item.i}</span><b>${item.n}</b>`;
            layer.appendChild(div);
        });
    },

    buy(id) {
        const it = this.shop[id];
        if (this.candies >= it.p && !this.inv.includes(id)) {
            this.candies -= it.p;
            this.inv.push(id);
            localStorage.setItem('n_i', JSON.stringify(this.inv));
            this.updateStats();
            this.renderRoom();
            UI.open('shop');
        }
    },

    setPet(emoji) {
        this.currentPet = emoji;
        document.getElementById('pet-avatar').innerText = emoji;
        localStorage.setItem('n_p', emoji);
        UI.close();
    },

    applyStyle() {
        document.body.className = `${this.theme} ${this.font}`;
        localStorage.setItem('n_t', this.theme);
        localStorage.setItem('n_f', this.font);
    }
};

const UI = {
    open(type) {
        const modal = document.getElementById('modal-screen');
        const body = document.getElementById('modal-body');
        const title = document.getElementById('modal-title');
        modal.classList.remove('hidden');

        if (type === 'pet-select') {
            title.innerText = "Выбери друга";
            body.innerHTML = `<div class="grid-2">` + 
                Game.pets.map(p => `
                    <div class="item-card ${Game.currentPet === p.i ? 'active' : ''}" onclick="Game.setPet('${p.i}')">
                        <div style="font-size:40px">${p.i}</div>
                        <p>${p.n}</p>
                    </div>
                `).join('') + `</div>`;
        } else if (type === 'shop') {
            title.innerText = "Мебель за конфеты";
            body.innerHTML = `<div class="grid-2">` + 
                Object.keys(Game.shop).map(id => {
                    const it = Game.shop[id];
                    const has = Game.inv.includes(id);
                    return `
                        <div class="item-card ${has ? 'active' : ''}" onclick="Game.buy('${id}')">
                            <div style="font-size:35px">${it.i}</div>
                            <b>${it.n}</b><br>
                            <small>${has ? 'Уже есть' : it.p + '🍬'}</small>
                        </div>
                    `;
                }).join('') + `</div>`;
        } else if (type === 'settings') {
            title.innerText = "Настройки комнаты";
            body.innerHTML = `
                <p>Тема:</p>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:15px;">
                    ${['cherry-blossom','midnight','toxic','lemon'].map(t => `<div onclick="Game.theme='theme-${t}'; Game.applyStyle()" class="theme-${t}" style="height:35px; border-radius:10px; border:2px solid #fff; cursor:pointer"></div>`).join('')}
                </div>
                <p>Шрифт:</p>
                <select onchange="Game.font=this.value; Game.applyStyle()">
                    <option value="font-main">Обычный</option>
                    <option value="font-pixel">Пиксельный</option>
                    <option value="font-cute">Милый</option>
                </select>
            `;
        }
    },
    close() { document.getElementById('modal-screen').classList.add('hidden'); },
    closeOnBg(e) { if(e.target.id === 'modal-screen') this.close(); }
};

window.onload = () => Game.init();
