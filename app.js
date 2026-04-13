const App = {
    candies: parseInt(localStorage.getItem('nh_c')) || 0,
    inventory: JSON.parse(localStorage.getItem('nh_i')) || [],
    pet: localStorage.getItem('nh_p') || '🤖',
    theme: localStorage.getItem('nh_t') || 'theme-pink',

    items: {
        'wardrobe': { n: 'Шкаф', p: 10, i: '👗', x: '10%', y: '30%' },
        'desk': { n: 'Стол', p: 25, i: '💻', x: '15%', y: '65%' },
        'lamp': { n: 'Лампа', p: 15, i: '💡', x: '70%', y: '40%' }
    },

    pets: ['🤖', '🐱', '🐶', '🐹', '🐰', '🦊', '🦄', '🐲'],

    init() {
        this.updateUI();
        this.renderRoom();
        document.body.className = this.theme;
        document.getElementById('pet-emoji').innerText = this.pet;
    },

    clickPet() {
        this.candies++;
        this.updateUI();
    },

    updateUI() {
        document.getElementById('count').innerText = this.candies;
        localStorage.setItem('nh_c', this.candies);
        localStorage.setItem('nh_i', JSON.stringify(this.inventory));
        localStorage.setItem('nh_p', this.pet);
        localStorage.setItem('nh_t', this.theme);
    },

    renderRoom() {
        const container = document.getElementById('furniture');
        container.innerHTML = '';
        this.inventory.forEach(id => {
            const it = this.items[id];
            const el = document.createElement('div');
            el.className = 'furniture-item';
            el.style.left = it.x;
            el.style.top = it.y;
            el.innerHTML = `<span>${it.i}</span><b>${it.n}</b>`;
            container.appendChild(el);
        });
    },

    buy(id) {
        if (this.candies >= this.items[id].p && !this.inventory.includes(id)) {
            this.candies -= this.items[id].p;
            this.inventory.push(id);
            this.updateUI();
            this.renderRoom();
            UI.open('shop');
        }
    }
};

const UI = {
    open(type) {
        const modal = document.getElementById('modal');
        const body = document.getElementById('m-body');
        const title = document.getElementById('m-title');
        modal.classList.remove('hidden');

        if (type === 'shop') {
            title.innerText = "Магазин";
            body.innerHTML = `<div class="grid">` + Object.keys(App.items).map(id => `
                <div class="card ${App.inventory.includes(id) ? 'owned' : ''}" onclick="App.buy('${id}')">
                    <div style="font-size:40px">${App.items[id].i}</div>
                    <b>${App.items[id].n}</b><br>
                    <small>${App.inventory.includes(id) ? 'Куплено' : App.items[id].p + '🍬'}</small>
                </div>
            `).join('') + `</div>`;
        } else if (type === 'pets') {
            title.innerText = "Друзья";
            body.innerHTML = `<div class="grid" style="grid-template-columns:repeat(4, 1fr)">` + App.pets.map(p => `
                <div class="card" onclick="App.pet='${p}'; App.updateUI(); document.getElementById('pet-emoji').innerText='${p}'; UI.close()" style="font-size:30px; padding:10px">${p}</div>
            `).join('') + `</div>`;
        } else if (type === 'settings') {
            title.innerText = "Темы";
            body.innerHTML = `<div class="grid">
                <div class="card" onclick="App.theme='theme-pink'; App.init()">Розовый</div>
                <div class="card" onclick="App.theme='theme-dark'; App.init()">Темный</div>
                <div class="card" onclick="App.theme='theme-toxic'; App.init()">Токсик</div>
            </div>`;
        }
    },
    close() { document.getElementById('modal').classList.add('hidden'); },
    closeBg(e) { if(e.target.id === 'modal') this.close(); }
};

window.onload = () => App.init();
