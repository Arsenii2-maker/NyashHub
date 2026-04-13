const State = {
    candies: parseInt(localStorage.getItem('nyash_c')) || 0,
    inventory: JSON.parse(localStorage.getItem('nyash_i')) || [],
    pet: localStorage.getItem('nyash_p') || '🤖',
    theme: localStorage.getItem('nyash_t') || 'theme-pink',
    
    items: {
        'bed': { n: 'Кровать', p: 15, i: '🛏️' },
        'pc': { n: 'Игровой ПК', p: 50, i: '🖥️' },
        'plant': { n: 'Кактус', p: 5, i: '🌵' }
    },
    
    pets: ['🤖', '🐱', '🐶', '🐹', '🐰', '🦊', '🦄', '🐲', '👽']
};

const Logic = {
    init() {
        this.bindEvents();
        this.refresh();
    },

    bindEvents() {
        // Клик по питомцу
        document.getElementById('pet-trigger').addEventListener('click', () => {
            State.candies++;
            this.refresh();
        });

        // Кнопки меню
        document.getElementById('btn-shop').addEventListener('click', () => UI.show('shop'));
        document.getElementById('btn-pets').addEventListener('click', () => UI.show('pets'));
        document.getElementById('btn-settings').addEventListener('click', () => UI.show('settings'));
        document.getElementById('modal-close').addEventListener('click', () => UI.hide());
        
        // Клик по фону модалки для закрытия
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if(e.target.id === 'modal-overlay') UI.hide();
        });
    },

    refresh() {
        document.getElementById('balance').innerText = State.candies;
        document.getElementById('pet-view').innerText = State.pet;
        document.body.className = State.theme;
        
        localStorage.setItem('nyash_c', State.candies);
        localStorage.setItem('nyash_p', State.pet);
        localStorage.setItem('nyash_t', State.theme);
        localStorage.setItem('nyash_i', JSON.stringify(State.inventory));
    }
};

const UI = {
    show(type) {
        const overlay = document.getElementById('modal-overlay');
        const body = document.getElementById('modal-body');
        const title = document.getElementById('modal-title');
        
        overlay.classList.remove('hidden');
        body.innerHTML = '';

        if (type === 'shop') {
            title.innerText = "Магазин";
            body.innerHTML = `<div class="grid">` + Object.keys(State.items).map(id => {
                const has = State.inventory.includes(id);
                return `<div class="option-card ${has?'active':''}" data-id="${id}">
                    <div style="font-size:40px">${State.items[id].i}</div>
                    <b>${State.items[id].n}</b><br>
                    <small>${has ? 'Уже есть' : State.items[id].p + '🍬'}</small>
                </div>`;
            }).join('') + `</div>`;
            
            // Вешаем клики на карточки магазина
            body.querySelectorAll('.option-card').forEach(el => {
                el.onclick = () => {
                    const id = el.dataset.id;
                    if (State.candies >= State.items[id].p && !State.inventory.includes(id)) {
                        State.candies -= State.items[id].p;
                        State.inventory.push(id);
                        Logic.refresh();
                        this.show('shop');
                    }
                };
            });

        } else if (type === 'pets') {
            title.innerText = "Выбери друга";
            body.innerHTML = `<div class="grid" style="grid-template-columns: repeat(3, 1fr)">` + State.pets.map(p => `
                <div class="option-card" data-p="${p}" style="font-size:30px">${p}</div>
            `).join('') + `</div>`;

            body.querySelectorAll('.option-card').forEach(el => {
                el.onclick = () => {
                    State.pet = el.dataset.p;
                    Logic.refresh();
                    this.hide();
                };
            });
        }
    },
    hide() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
};

// Запуск
Logic.init();
