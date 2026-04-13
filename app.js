const HubCore = {
    candies: parseInt(localStorage.getItem('nh_candies')) || 0,
    inventory: JSON.parse(localStorage.getItem('nh_inv')) || [],
    theme: localStorage.getItem('nh_theme') || 'theme-cherry-blossom',
    font: localStorage.getItem('nh_font') || 'font-main',

    // БАЗА ДАННЫХ ПРЕДМЕТОВ
    db: {
        'wardrobe': { n: 'Шкаф', p: 10, i: '👗', pos: 'top: 15%; left: 5%;', act: () => UIMachine.open('settings') },
        'desk': { n: 'Стол', p: 25, i: '💻', pos: 'bottom: 25%; left: 10%;', act: () => UIMachine.open('diary') },
        'bed': { n: 'Кровать', p: 40, i: '🛏️', pos: 'bottom: 15%; right: 5%;', act: () => PetEngine.sleep() },
        'oracle': { n: 'Оракул', p: 50, i: '🔮', pos: 'top: 20%; right: 10%;', act: () => UIMachine.open('oracle') },
        'lamp': { n: 'Лампа', p: 15, i: '💡', pos: 'top: 50%; left: 20%;', act: () => HubCore.toggleLight() },
        'plant': { n: 'Цветок', p: 5, i: '🌿', pos: 'bottom: 40%; right: 15%;', act: () => HubCore.toast('Растение полито! 🌱') }
    },

    init() {
        this.applySettings();
        this.renderRoom();
        this.updateStats();
        this.toast('NyashHub загружен! 🐾');
    },

    updateStats() {
        document.getElementById('candy-val').innerText = this.candies;
        localStorage.setItem('nh_candies', this.candies);
        localStorage.setItem('nh_inv', JSON.stringify(this.inventory));
    },

    renderRoom() {
        const canvas = document.getElementById('room-canvas');
        canvas.innerHTML = '';
        this.inventory.forEach(id => {
            const item = this.db[id];
            const div = document.createElement('div');
            div.className = 'room-item';
            div.style = item.pos;
            div.onclick = (e) => { e.stopPropagation(); item.act(); };
            div.innerHTML = `<span class="icon">${item.i}</span><span class="name">${item.n}</span>`;
            canvas.appendChild(div);
        });
    },

    buy(id) {
        const item = this.db[id];
        if (this.candies >= item.p && !this.inventory.includes(id)) {
            this.candies -= item.p;
            this.inventory.push(id);
            this.updateStats();
            this.renderRoom();
            this.toast(`${item.n} куплен! ✨`);
            UIMachine.open('shop');
        } else if (this.inventory.includes(id)) {
            this.toast('Уже есть в комнате!');
        } else {
            this.toast('Недостаточно 🍬');
        }
    },

    applySettings() {
        document.body.className = `${this.theme} ${this.font}`;
        localStorage.setItem('nh_theme', this.theme);
        localStorage.setItem('nh_font', this.font);
    },

    toast(msg) {
        const t = document.createElement('div');
        t.style = "background: rgba(0,0,0,0.8); color:white; padding:10px 20px; border-radius:20px; margin-top:10px; animation: pop 0.3s ease;";
        t.innerText = msg;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => t.remove(), 2500);
    }
};

const UIMachine = {
    open(type) {
        const modal = document.getElementById('modal-overlay');
        const body = document.getElementById('modal-body');
        const title = document.getElementById('modal-title');
        modal.classList.remove('hidden');

        if (type === 'shop') {
            title.innerText = "Магазин Мебели";
            body.innerHTML = Object.keys(HubCore.db).map(id => {
                const it = HubCore.db[id];
                const owned = HubCore.inventory.includes(id);
                return `
                    <div class="shop-card ${owned ? 'owned' : ''}">
                        <span>${it.i} <b>${it.n}</b></span>
                        <button class="buy-btn" onclick="HubCore.buy('${id}')">${owned ? 'В комнате' : it.p + '🍬'}</button>
                    </div>`;
            }).join('');
        } else if (type === 'settings') {
            title.innerText = "Стиль Комнаты";
            const themes = ['cherry-blossom', 'midnight', 'toxic', 'lemon', 'vampire', 'ocean', 'coffee', 'neon', 'forest', 'ghost', 'gold', 'berry'];
            body.innerHTML = `
                <p>Выберите тему (12 шт.):</p>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin: 15px 0;">
                    ${themes.map(t => `<div onclick="HubCore.theme='theme-${t}'; HubCore.applySettings()" class="theme-${t}" style="height:40px; border-radius:10px; border:2px solid white; cursor:pointer"></div>`).join('')}
                </div>
                <p>Выберите шрифт:</p>
                <select onchange="HubCore.font=this.value; HubCore.applySettings()">
                    <option value="font-main">Стандартный</option>
                    <option value="font-future">Unbounded (Будущее)</option>
                    <option value="font-pixel">Press Start (Пиксели)</option>
                    <option value="font-code">JetBrains (Код)</option>
                    <option value="font-cute">Pacifico (Милый)</option>
                    <option value="font-mystic">Kelly (Магия)</option>
                </select>`;
        } else if (type === 'diary') {
            title.innerText = "Дневник Няшки";
            body.innerHTML = `
                <textarea id="diary-area" placeholder="Как твои дела сегодня?"></textarea>
                <button class="buy-btn" style="width:100%; margin-top:10px;" onclick="HubCore.toast('Запись сохранена! 📔')">Сохранить</button>
            `;
        } else if (type === 'oracle') {
            title.innerText = "Шар Предсказаний";
            body.innerHTML = `
                <div style="text-align:center;">
                    <div id="o-res" style="font-size:20px; margin-bottom:20px;">Задай вопрос и коснись шара...</div>
                    <div style="font-size:80px; cursor:pointer;" onclick="UIMachine.spinOracle()">🔮</div>
                </div>`;
        }
    },
    spinOracle() {
        const r = document.getElementById('o-res');
        r.innerText = "Вглядываюсь в пустоту...";
        setTimeout(() => {
            const list = ["Да, ня!", "Мяу, нет...", "Определенно!", "Звезды молчат...", "Конфеты принесут удачу!"];
            r.innerText = list[Math.floor(Math.random() * list.length)];
        }, 1000);
    },
    close() { document.getElementById('modal-overlay').classList.add('hidden'); },
    closeOnOut(e) { if(e.target.id === 'modal-overlay') this.close(); }
};

const PetEngine = {
    tap(e) {
        HubCore.candies++;
        HubCore.updateStats();
        const b = document.getElementById('pet-speech');
        b.classList.remove('hidden');
        setTimeout(() => b.classList.add('hidden'), 1000);
    },
    sleep() {
        HubCore.toast('Питомец спит... 💤');
        document.querySelector('.pet-sprite').style.opacity = "0.5";
        setTimeout(() => document.querySelector('.pet-sprite').style.opacity = "1", 3000);
    }
};

HubCore.init();
