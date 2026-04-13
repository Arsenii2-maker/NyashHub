const Core = {
    candies: parseInt(localStorage.getItem('c_nyash')) || 0,
    inventory: JSON.parse(localStorage.getItem('i_nyash')) || [],
    theme: localStorage.getItem('t_nyash') || 'theme-cherry-blossom',
    pet: localStorage.getItem('p_nyash') || '🤖',

    db: {
        'wardrobe': { n: 'Шкаф', p: 10, i: '👗', x: '10%', y: '20%', f: () => UI.open('settings') },
        'desk': { n: 'Стол', p: 30, i: '💻', x: '15%', y: '60%', f: () => alert('Дневник в разработке! 📔') },
        'oracle': { n: 'Оракул', p: 50, i: '🔮', x: '70%', y: '25%', f: () => alert('Оракул спит... ✨') }
    },

    pets: ['🤖', '🐱', '🐶', '🐹', '🐰', '🦊', '🦄', '🐲'],

    init() {
        this.updateUI();
        this.renderRoom();
        document.getElementById('main-pet').innerText = this.pet;
        document.body.className = this.theme;
    },

    tap(e) {
        this.candies++;
        this.updateUI();
        // Эффект появления текста +1
    },

    updateUI() {
        document.getElementById('balance').innerText = this.candies;
        localStorage.setItem('c_nyash', this.candies);
        localStorage.setItem('i_nyash', JSON.stringify(this.inventory));
        localStorage.setItem('p_nyash', this.pet);
        localStorage.setItem('t_nyash', this.theme);
    },

    renderRoom() {
        const grid = document.getElementById('furniture-grid');
        grid.innerHTML = '';
        this.inventory.forEach(id => {
            const it = this.db[id];
            const div = document.createElement('div');
            div.className = 'item-obj';
            div.style.left = it.x;
            div.style.top = it.y;
            div.onclick = (e) => { e.stopPropagation(); it.f(); };
            div.innerHTML = `<span>${it.i}</span><b>${it.n}</b>`;
            grid.appendChild(div);
        });
    },

    buy(id) {
        if (this.candies >= this.db[id].p && !this.inventory.includes(id)) {
            this.candies -= this.db[id].p;
            this.inventory.push(id);
            this.updateUI();
            this.renderRoom();
            UI.open('shop');
        }
    }
};

const UI = {
    open(type) {
        const wrap = document.getElementById('modal-wrap');
        const body = document.getElementById('m-body');
        const title = document.getElementById('m-title');
        wrap.classList.remove('hidden');

        if (type === 'shop') {
            title.innerText = "Магазин";
            body.innerHTML = `<div class="grid">` + Object.keys(Core.db).map(id => `
                <div class="card ${Core.inventory.includes(id) ? 'active' : ''}" onclick="Core.buy('${id}')">
                    <div style="font-size:40px">${Core.db[id].i}</div>
                    <b>${Core.db[id].n}</b><br><small>${Core.inventory.includes(id) ? 'Есть' : Core.db[id].p + '🍬'}</small>
                </div>
            `).join('') + `</div>`;
        } else if (type === 'pets') {
            title.innerText = "Питомцы";
            body.innerHTML = `<div class="grid" style="grid-template-columns: repeat(4, 1fr)">` + Core.pets.map(p => `
                <div class="card ${Core.pet === p ? 'active' : ''}" onclick="Core.pet='${p}'; Core.updateUI(); document.getElementById('main-pet').innerText='${p}'; UI.close()" style="font-size:30px; padding:10px">${p}</div>
            `).join('') + `</div>`;
        } else if (type === 'settings') {
            title.innerText = "Темы";
            const themes = ['cherry-blossom', 'midnight', 'toxic', 'neon'];
            body.innerHTML = `<div class="grid">` + themes.map(t => `
                <div onclick="Core.theme='theme-${t}'; Core.updateUI(); document.body.className='theme-${t}'" class="theme-${t}" style="height:50px; border-radius:15px; border:3px solid #eee; cursor:pointer"></div>
            `).join('') + `</div>`;
        }
    },
    close() { document.getElementById('modal-wrap').classList.add('hidden'); }
};

window.onload = () => Core.init();
