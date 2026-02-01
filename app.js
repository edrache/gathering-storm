
// State Management
const STATE = {
    screen: 'setup',
    language: 'en',
    playerCount: 3,
    phaseIndex: 0,
    players: [],
    tool: 'brush',
    color: '#ffffff',
    decks: {
        chars: [],
        secrets: [],
        oracle: []
    }
};

const SUITS = ['d', 'c', 'h', 's']; // Diamond, Club, Heart, Spade

// --- Initialization ---

// Initialize language from localStorage or browser default
function initLanguage() {
    const saved = localStorage.getItem('gatheringStorm_language');
    if (saved) {
        STATE.language = saved;
    } else {
        const browserLang = navigator.language.split('-')[0];
        STATE.language = (browserLang === 'pl') ? 'pl' : 'en';
    }
    updateUIText();
}

function setLanguage(lang) {
    STATE.language = lang;
    localStorage.setItem('gatheringStorm_language', lang.toLowerCase());
    updateUIText();

    // Update active game screen if in progress
    if (STATE.screen === 'game') {
        renderPhase();
        renderPlayers();
    }
}

function updateUIText() {
    const lang = STATE.language.toUpperCase();
    const ui = DATA[lang].UI;

    document.getElementById('setup-title').innerText = ui.title;
    document.getElementById('setup-subtitle').innerText = ui.subtitle;
    document.getElementById('player-count-label').innerText = ui.playerCount;
    document.getElementById('btn-start').innerText = ui.startBtn;
    document.getElementById('btn-settings').innerText = ui.settingsBtn;
    document.getElementById('btn-next-phase').innerText = ui.nextPhaseBtn;
    document.getElementById('btn-draw').innerText = ui.drawBtn;
    document.getElementById('community-title').innerText = ui.communityTitle;

    // Update active state of buttons
    document.querySelectorAll('.language-selector button').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === STATE.language.toLowerCase());
    });

    // Phase panel might need refresh if active
    if (document.getElementById('game-screen').classList.contains('active')) {
        renderPhase();
    }
}

function initDecks() {
    // Character Cards: K, Q, J of all suits
    const chars = [];
    SUITS.forEach(s => {
        chars.push({ id: `${s}_king`, suit: s, rank: 'king' });
        chars.push({ id: `${s}_queen`, suit: s, rank: 'queen' });
        chars.push({ id: `${s}_jack`, suit: s, rank: 'jack' });
    });
    shuffle(chars);
    STATE.decks.chars = chars;

    // Secret Cards: Hearts A-10 + 2 Jokers
    const secrets = [];
    ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10'].forEach(r => {
        secrets.push({ id: `h_${r}`, suit: 'h', rank: r });
    });
    secrets.push({ id: 'joker_1', suit: 'joker', rank: 'joker' });
    secrets.push({ id: 'joker_2', suit: 'joker', rank: 'joker' });
    shuffle(secrets);
    STATE.decks.secrets = secrets;

    // Oracle Deck
    const oracle = [];
    const oracleSuits = ['d', 'c', 's'];
    const oracleRanks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    oracleSuits.forEach(s => {
        oracleRanks.forEach(r => {
            if (s === 's' && r === 'ace') return;
            oracle.push({ suit: s, rank: r });
        });
    });

    shuffle(oracle);

    // Insert Ace of Spades in second half
    const aceSpades = { suit: 's', rank: 'ace' };
    const halfLen = Math.floor(oracle.length / 2);
    const insertIdx = Math.floor(Math.random() * (oracle.length - halfLen + 1)) + halfLen;
    oracle.splice(insertIdx, 0, aceSpades);

    STATE.decks.oracle = oracle;
}

let mapInstance = null;

function startGame() {
    // Switch Screen
    STATE.screen = 'game';
    document.getElementById('setup-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    // Init Logic
    initDecks();
    initMap(); // Leaflet init

    // Slight delay to allow map to render before sizing canvas, or handle via resize
    setTimeout(() => {
        initCanvas();
    }, 100);

    // Assign Characters
    const lang = STATE.language.toUpperCase();
    for (let i = 0; i < STATE.playerCount; i++) {
        const charCard = STATE.decks.chars.pop();
        const secretCard = STATE.decks.secrets.pop();

        let charData = DATA[lang].CHARACTERS[charCard.id];
        let secretData = DATA[lang].SECRETS[secretCard.id] || "Unknown Secret";

        STATE.players.push({
            id: i + 1,
            charCard: charCard,
            charData: charData, // Store current lang data
            secretCard: secretCard,
            secretData: secretData
        });
    }

    renderPlayers();
    renderPhase();
}

function initMap() {
    if (mapInstance) return;

    // Load map settings
    const saved = localStorage.getItem('gatheringStorm_mapSettings');
    const defaults = {
        provider: 'physical',
        zoom: 8,
        invert: false,
        sepia: 100,
        hue: 0,
        contrast: 50,
        brightness: 69
    };
    const settings = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;

    const mapElement = document.getElementById('map');
    const inv = settings.invert ? 1 : 0;
    const sep = settings.sepia / 100;
    const hue = settings.hue;
    const con = settings.contrast / 100;
    const bri = settings.brightness / 100;
    mapElement.style.filter = `invert(${inv}) sepia(${sep}) hue-rotate(${hue}deg) contrast(${con}) brightness(${bri})`;

    // Random location on Land (using seeds + jitter)
    const seed = DATA.LAND_SEEDS[Math.floor(Math.random() * DATA.LAND_SEEDS.length)];
    // Add +/- 0.1 degree jitter (~10km) to keep it interesting but on land
    const lat = seed.lat + (Math.random() * 0.2 - 0.1);
    const lng = seed.lng + (Math.random() * 0.2 - 0.1);

    mapInstance = L.map('map', {
        zoomControl: false, // Minified UI
        attributionControl: false
    }).setView([lat, lng], settings.zoom); // Use custom zoom level

    // Use the selected map provider
    const pKey = settings.provider || 'physical';
    const provider = DATA.MAP_PROVIDERS[pKey];
    L.tileLayer(provider.url, {
        attribution: provider.attribution
    }).addTo(mapInstance);

    // Disable interactions if we want it to be a static "map" surface for drawing
    // But maybe allow panning? Let's disable for now to make drawing easier
    mapInstance.dragging.disable();
    mapInstance.touchZoom.disable();
    mapInstance.doubleClickZoom.disable();
    mapInstance.scrollWheelZoom.disable();
    mapInstance.boxZoom.disable();
    mapInstance.keyboard.disable();
}

function randomizeMap() {
    if (mapInstance) {
        const seed = DATA.LAND_SEEDS[Math.floor(Math.random() * DATA.LAND_SEEDS.length)];
        const lat = seed.lat + (Math.random() * 0.2 - 0.1);
        const lng = seed.lng + (Math.random() * 0.2 - 0.1);
        mapInstance.setView([lat, lng], 13);
    }
}

// --- UI Rendering ---

function changePlayerCount(delta) {
    let newCount = STATE.playerCount + delta;
    if (newCount < 1) newCount = 1;
    if (newCount > 6) newCount = 6;
    STATE.playerCount = newCount;
    document.getElementById('player-count-display').innerText = STATE.playerCount;
}

function renderPhase() {
    const lang = STATE.language.toUpperCase();
    const phase = DATA[lang].PHASES[STATE.phaseIndex];
    document.getElementById('phase-title').innerText = phase.title;
    document.getElementById('phase-text').innerText = phase.text;
    document.getElementById('prompt-text').innerText = phase.prompt;

    const cardArea = document.getElementById('card-area');
    if (phase.id === 'oracle') {
        cardArea.classList.remove('hidden');
    } else {
        cardArea.classList.add('hidden');
    }
}

function renderPlayers() {
    const lang = STATE.language.toUpperCase();
    const ui = DATA[lang].UI;
    const list = document.getElementById('players-list');
    list.innerHTML = '';
    STATE.players.forEach(p => {
        // Re-get character name for current lang
        const charData = DATA[lang].CHARACTERS[p.charCard.id];
        const playerLabel = lang === 'PL' ? `Gracz ${p.id}` : `Player ${p.id}`;

        const div = document.createElement('div');
        div.className = 'player-item';
        div.innerHTML = `
            <div>${playerLabel}</div>
            <div class="player-role">${charData.name}</div>
            <div class="player-secret">${ui.secretLabel}</div>
        `;
        list.appendChild(div);
    });
}

function nextPhase() {
    const lang = STATE.language.toUpperCase();
    if (STATE.phaseIndex < DATA[lang].PHASES.length - 1) {
        STATE.phaseIndex++;
        renderPhase();
    } else {
        // Simple loop prevention or game over state
        alert(DATA[lang].UI.gameOver);
    }
}

function drawCard() {
    const lang = STATE.language.toUpperCase();
    if (STATE.decks.oracle.length === 0) {
        alert(DATA[lang].UI.deckEmpty);
        return;
    }

    const card = STATE.decks.oracle.shift();
    displayCard(card);

    if (card.suit === 's' && card.rank === 'ace') {
        const eventText = DATA[lang].ORACLE['ace']['s'];
        document.getElementById('prompt-text').innerHTML = `<span style="color:var(--accent-secondary)">${DATA[lang].UI.gameEndTrigger}</span> ${eventText}`;
    } else {
        const rankKey = card.rank;
        const suitKey = card.suit;

        if (DATA[lang].ORACLE[rankKey] && DATA[lang].ORACLE[rankKey][suitKey]) {
            const eventText = DATA[lang].ORACLE[rankKey][suitKey];
            document.getElementById('prompt-text').innerText = eventText;
        } else {
            document.getElementById('prompt-text').innerText = "Event not found in table.";
        }
    }
}

function displayCard(card) {
    const container = document.getElementById('current-card');
    let suitSymbol = '';
    let colorClass = 'suit-black';

    switch (card.suit) {
        case 'd': suitSymbol = '♦'; colorClass = 'suit-red'; break;
        case 'h': suitSymbol = '♥'; colorClass = 'suit-red'; break;
        case 'c': suitSymbol = '♣'; colorClass = 'suit-black'; break;
        case 's': suitSymbol = '♠'; colorClass = 'suit-black'; break;
    }

    container.innerHTML = `
        <div class="card">
            <div class="card-suit ${colorClass}">${suitSymbol}</div>
            <h2 class="${colorClass}">${card.rank.toUpperCase()}</h2>
            <div class="card-text">
                (See Event text)
            </div>
        </div>
    `;
}

// --- Drawing / Canvas Logic ---

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let ctx = null;

function initCanvas() {
    const canvas = document.getElementById('drawing-canvas');
    const container = document.getElementById('map-container');

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = STATE.color;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    window.addEventListener('resize', () => {
        // In a real app, we'd redraw the image buffer.
        // For now, minimal handling.
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = STATE.color;
    });
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

function setTool(toolName) {
    STATE.tool = toolName;
    if (toolName === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 2;
        ctx.strokeStyle = STATE.color;
    }

    // UI Visuals
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    // Ideally map buttons to tools more robustly
}

function setColor(hex) {
    STATE.color = hex;
    setTool('brush');
    if (ctx) ctx.strokeStyle = hex;
}

function clearCanvas() {
    const lang = STATE.language.toUpperCase();
    if (confirm(DATA[lang].UI.confirmClear)) {
        const canvas = document.getElementById('drawing-canvas');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

// Initial Call
initLanguage();

