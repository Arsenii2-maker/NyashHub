const NyashHub = {
    candies: parseInt(localStorage.getItem('candies')) || 0,
    inventory: JSON.parse(localStorage.getItem('inventory')) || [],
    theme: localStorage.getItem('theme') || 'theme-cherry-blossom',
    font: localStorage.getItem('font') || 'font-rounded',

    init() {
        this.applyTheme(this.theme);
        this.applyFont(this.font);
        this.updateUI();
        this.checkInventory();
    },

    updateUI() {
        document.getElementById('candy-balance').innerText = this.candies;
        localStorage.setItem('candies', this.candies);
        localStorage.setItem('inventory', JSON.stringify(this.inventory));
    },

    applyTheme(t) {
        this.theme = t;
        document.body.className = `${t} ${this.font}`;
        localStorage.setItem('theme', t);
    },

    applyFont(f) {
        this.font = f;
        document.body.className = `${this.theme} ${f}`;
        localStorage.setItem('font', f);
    },

    checkInventory() {
        this.inventory.forEach(itemId => {
            const el = document.getElementById(`item-${itemId}`);
            if (el) el.classList.remove('hidden');
        });
    }
};

const UI = {
    open(type) {
        const overlay = document.getElementById('modal-overlay');
        const body = document.getElementById('modal-body');
        overlay.classList.remove('hidden');

        if (type === 'shop') {
            const items = [
                {id: 'wardrobe', name: 'Гардероб', price: 10, icon: '👗'},
                {id: 'desk', name: 'Рабочий стол', price: 25, icon: '📔'},
                {id: 'oracle', name: 'Шар судьбы', price: 50, icon: '🔮'}
            ];
            body.innerHTML = `<h2>Магическая Лавка</h2><div class="shop-grid">` + 
                items.map(i => `
                    <div class="shop-card ${NyashHub.inventory.includes(i.id) ? 'owned' : ''}" 
                         onclick="NyashHub.buy('${i.id}', ${i.price})">
                        <div style="font-size:30px">${i.icon}</div>
                        <b>${i.name}</b><br>
                        <span>${NyashHub.inventory.includes(i.id) ? 'Куплено' : i.price + '🍬'}</span>
                    </div>
                `).join('') + `</div>`;
        } else if (type === 'settings') {
            const themes = ['cherry-blossom', 'midnight', 'ocean', 'forest', 'honey', 'lavender', 'mint', 'vampire', 'sky', 'marshmallow', 'coffee', 'carbon'];
            const fonts = [
                {id: 'font-rounded', n: 'Закругленный'}, {id: 'font-modern', n: 'Стильный'},
                {id: 'font-hand', n: 'Рукописный'}, {id: 'font-pixel', n: 'Пиксельный'},
                {id: 'font-classy', n: 'Элегантный'}, {id: 'font-system', n: 'Системный'}
            ];
            body.innerHTML = `
                <h2>Стиль Хаба</h2>
                <div class="theme-grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
                    ${themes.map(t => `<div onclick="NyashHub.applyTheme('theme-${t}')" class="theme-${t}" style="height:35px; border-radius:8px; border:2px solid #fff; cursor:pointer"></div>`).join('')}
                </div>
                <label>Шрифт:</label>
                <select onchange="NyashHub.applyFont(this.value)">
                    ${fonts.map(f => `<option value="${f.id}" ${NyashHub.font === f.id ? 'selected' : ''}>${f.n}</option>`).join('')}
                </select>
            `;
        }
        // Добавь блоки для 'diary' и 'oracle' по аналогии с предыдущим кодом
    },

    close() { document.getElementById('modal-overlay').classList.add('hidden'); },
    closeOuter(e) { if(e.target.id === 'modal-overlay') this.close(); }
};

NyashHub.buy = function(id, price) {
    if (this.inventory.includes(id)) return;
    if (this.candies >= price) {
        this.candies -= price;
        this.inventory.push(id);
        this.updateUI();
        this.checkInventory();
        UI.open('shop'); // Обновить вид магазина
    } else {
        alert("Не хватает конфет! Кликай на котика 🍬");
    }
};

const NyashPet = {
    tap() {
        NyashHub.candies += 1;
        NyashHub.updateUI();
        const cloud = document.getElementById('pet-cloud');
        cloud.classList.remove('hidden');
        setTimeout(() => cloud.classList.add('hidden'), 800);
    }
};

NyashHub.init();
