
// State Management
const STATE = {
    screen: 'setup',
    language: 'en',
    playerCount: 3,
    phaseIndex: 0,
    players: [],
    tool: 'brush',
    color: '#ffffff',
    textMarkers: [], // Track text labels for clearing
    tempX: null,    // Temporary X marker during input
    decks: {
        chars: [],
        secrets: [],
        oracle: []
    },
    selectedTags: {}, // { phaseId: [tag1, tag2, ...] }
    settlements: [],
    currentSettlement: null,
    isTagsVisible: true,
    mapView: null // { lat, lng, zoom }
};

function saveState() {
    const stateToSave = {
        screen: STATE.screen,
        language: STATE.language,
        playerCount: STATE.playerCount,
        phaseIndex: STATE.phaseIndex,
        players: STATE.players,
        selectedTags: STATE.selectedTags,
        settlements: STATE.settlements.map(s => ({
            id: s.id,
            latlng: s.latlng,
            name: s.name,
            tags: s.tags
        })),
        textMarkers: STATE.textMarkers.map(m => ({
            latlng: m.getLatLng(),
            text: m.getElement().querySelector('.map-label').innerText
        })),
        isTagsVisible: STATE.isTagsVisible,
        decks: STATE.decks
    };

    if (mapInstance) {
        stateToSave.mapView = {
            center: mapInstance.getCenter(),
            zoom: mapInstance.getZoom()
        };
    }

    localStorage.setItem('gatheringStorm_gameState', JSON.stringify(stateToSave));

    // Save Canvas
    const canvas = document.getElementById('drawing-canvas');
    if (canvas) {
        localStorage.setItem('gatheringStorm_canvas', canvas.toDataURL());
    }
}

function loadState() {
    const saved = localStorage.getItem('gatheringStorm_gameState');
    if (!saved) return false;

    const data = JSON.parse(saved);
    Object.assign(STATE, data);

    // Language is handled separately in initLanguage but let's sync
    document.getElementById('player-count-display').innerText = STATE.playerCount;

    if (STATE.screen === 'game') {
        resumeGame();
    }
    return true;
}

function resumeGame() {
    document.getElementById('setup-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    initMap();
    if (STATE.mapView) {
        mapInstance.setView(STATE.mapView.center, STATE.mapView.zoom);
    }

    setTimeout(() => {
        initCanvas();
        const savedCanvas = localStorage.getItem('gatheringStorm_canvas');
        if (savedCanvas) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0);
            img.src = savedCanvas;
        }

        // Restore settlements
        const settlements = [...STATE.settlements];
        STATE.settlements = [];
        STATE.currentSettlement = null;
        settlements.forEach(s => restoreSettlement(s));

        // Restore text markers
        const texts = [...STATE.textMarkers];
        STATE.textMarkers = [];
        texts.forEach(t => addTextLabel(t.text, t.latlng));

        renderPlayers();
        renderPhase();
        initTextInputOverlay();
        initTruthsPanel();
        makeDraggable(document.getElementById('truths-panel'), document.querySelector('.drag-handle'));
    }, 100);
}

function restoreSettlement(s) {
    const lang = STATE.language.toUpperCase();
    const name = s.name;
    const latlng = s.latlng;

    const settlement = {
        id: s.id,
        latlng: latlng,
        name: name,
        tags: s.tags,
        marker: null
    };

    const icon = L.divIcon({
        className: 'map-settlement-container',
        html: `
            <div class="map-settlement-tags" style="display: ${STATE.isTagsVisible ? 'flex' : 'none'}"></div>
            <div class="map-settlement-label">
                <span class="settlement-name" onclick="toggleSettlementTags(event)">${name}</span>
            </div>
            <svg style="display:block" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="2">
                <path d="M21 10c0 8-9 14-9 14s-9-6-9-14a9 9 0 0 1 18 0z"></path>
                <circle cx='12' cy='10' r='3' fill="black"></circle>
            </svg>`,
        iconSize: [200, 120],
        iconAnchor: [100, 120]
    });

    settlement.marker = L.marker(latlng, {
        icon: icon,
        draggable: true
    }).addTo(mapInstance);

    settlement.marker.on('dragend', function (event) {
        settlement.latlng = event.target.getLatLng();
        saveState();
    });

    STATE.settlements.push(settlement);
    if (!STATE.currentSettlement) STATE.currentSettlement = settlement;
    updateSettlementMarker(settlement);
}

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

    if (document.getElementById('btn-tool-text')) {
        document.getElementById('btn-tool-text').title = ui.textTool;
    }

    if (document.getElementById('truths-title-ui')) {
        document.getElementById('truths-title-ui').innerText = ui.truthsTitle;
        initTruthsPanel(); // Refresh list content
    }

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
    initTextInputOverlay();
    initTruthsPanel();
    makeDraggable(document.getElementById('truths-panel'), document.querySelector('.drag-handle'));
    saveState();
}

function initTextInputOverlay() {
    if (document.getElementById('text-input-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'text-input-overlay';
    overlay.innerHTML = `<input type="text" id="map-text-input" autocomplete="off">`;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = input.value.trim();
            if (text && STATE.pendingTextPos) {
                addTextLabel(text, STATE.pendingTextPos);
            }
            hideTextInput();
        } else if (e.key === 'Escape') {
            hideTextInput();
        }
    });

    // Close if clicking outside
    document.addEventListener('mousedown', (e) => {
        if (!overlay.contains(e.target) && overlay.style.display === 'block') {
            hideTextInput();
        }
    });
}

function showTextInput(latlng, x, y) {
    // Remove any existing temp X
    if (STATE.tempX) STATE.tempX.remove();

    // Place temporary X at the click location
    const xIcon = L.divIcon({
        className: 'map-marker-container',
        html: `<div class="map-x">✕</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    STATE.tempX = L.marker(latlng, { icon: xIcon }).addTo(mapInstance);

    const overlay = document.getElementById('text-input-overlay');
    const input = document.getElementById('map-text-input');
    STATE.pendingTextPos = latlng;
    overlay.style.left = `${x}px`;
    overlay.style.top = `${y}px`;
    overlay.style.display = 'block';
    input.value = '';
    setTimeout(() => input.focus(), 10);
}

function hideTextInput() {
    const overlay = document.getElementById('text-input-overlay');
    overlay.style.display = 'none';
    if (STATE.tempX) {
        STATE.tempX.remove();
        STATE.tempX = null;
    }
    STATE.pendingTextPos = null;
}

function addTextLabel(text, latlng) {
    const icon = L.divIcon({
        className: 'map-marker-container',
        html: `<div class="map-label">${text}</div><div class="map-x">✕</div>`,
        iconSize: [200, 60],
        iconAnchor: [100, 50] // Center of the X (assuming X is 20px high and label is above it)
    });
    const marker = L.marker(latlng, { icon: icon }).addTo(mapInstance);
    STATE.textMarkers.push(marker);
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

    // Text tool click handler
    mapInstance.on('click', (e) => {
        if (STATE.tool === 'text') {
            showTextInput(e.latlng, e.containerPoint.x, e.containerPoint.y);
        }
    });
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

function initTruthsPanel() {
    const lang = STATE.language.toUpperCase();
    const truths = DATA[lang].TRUTHS;
    const list = document.getElementById('truths-list');
    if (!list) return;

    list.innerHTML = '';
    truths.forEach(truth => {
        const li = document.createElement('li');
        li.innerText = truth;
        list.appendChild(li);
    });
}

function toggleTruths() {
    const panel = document.getElementById('truths-panel');
    const btn = panel.querySelector('.toggle-btn');
    panel.classList.toggle('collapsed');
    btn.innerText = panel.classList.contains('collapsed') ? '+' : '−';
}

function makeDraggable(el, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
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

    // Special logic for Settlement placement cursor
    const canvas = document.getElementById('drawing-canvas');
    const container = document.getElementById('map-container');
    if (phase.id === 'settlement') {
        container.classList.add('settlement-marker-active');
        setTool('settlement');
    } else {
        container.classList.remove('settlement-marker-active');
        if (STATE.tool === 'settlement') setTool('brush');
    }

    renderTags(phase);
    renderActiveTags();
}

function renderTags(phase) {
    const container = document.getElementById('phase-tags');
    if (!phase.suggestions) {
        container.classList.add('hidden');
        return;
    }

    container.innerHTML = '';
    container.classList.remove('hidden');

    // Parse suggestions (handle strings with commas)
    let suggestions = [];
    if (typeof phase.suggestions === 'string') {
        suggestions = phase.suggestions.split(',').map(s => s.trim()).filter(s => s !== "");
    }

    const selected = STATE.selectedTags[phase.id] || [];

    // Render preset tags
    suggestions.forEach(text => {
        const isSelected = selected.includes(text);
        const tag = document.createElement('div');
        tag.className = `tag ${isSelected ? 'selected' : ''}`;
        tag.innerText = text;
        tag.onclick = () => toggleTag(text, phase.id);
        container.appendChild(tag);
    });

    // Render user-added tags for this phase that aren't in suggestions
    selected.filter(t => !suggestions.includes(t)).forEach(text => {
        const tag = document.createElement('div');
        tag.className = 'tag selected';
        tag.innerText = text;
        tag.onclick = () => toggleTag(text, phase.id);
        container.appendChild(tag);
    });

    // Add "Custom Tag" button
    const addBtn = document.createElement('div');
    addBtn.className = 'tag custom-tag-btn';
    addBtn.innerText = '+';
    addBtn.onclick = () => addCustomTag(phase.id);
    container.appendChild(addBtn);
}

function toggleTag(text, phaseId) {
    if (!STATE.selectedTags[phaseId]) STATE.selectedTags[phaseId] = [];
    const idx = STATE.selectedTags[phaseId].indexOf(text);
    if (idx === -1) {
        STATE.selectedTags[phaseId].push(text);
        if (phaseId === 'settlement' && STATE.currentSettlement) {
            STATE.currentSettlement.tags.push(text);
            updateSettlementMarker(STATE.currentSettlement);
        }
    } else {
        STATE.selectedTags[phaseId].splice(idx, 1);
        if (phaseId === 'settlement' && STATE.currentSettlement) {
            const sIdx = STATE.currentSettlement.tags.indexOf(text);
            if (sIdx !== -1) STATE.currentSettlement.tags.splice(sIdx, 1);
            updateSettlementMarker(STATE.currentSettlement);
        }
    }

    // Refresh UI
    const lang = STATE.language.toUpperCase();
    const phase = DATA[lang].PHASES[STATE.phaseIndex];
    renderTags(phase);
    renderActiveTags();
}

function addCustomTag(phaseId) {
    const lang = STATE.language.toUpperCase();
    const promptText = DATA[lang].UI.textPrompt || "Enter tag:";
    const text = prompt(promptText);
    if (text && text.trim()) {
        toggleTag(text.trim(), phaseId);
    }
}

function renderActiveTags() {
    const bar = document.getElementById('active-tags-bar');
    bar.innerHTML = '';

    // Display tags from "Our Land" and other critical phases that should persist
    // For now, let's display ALL selected tags, but maybe prioritize some.
    // The user specifically mentioned "Our Land" tags should be visible u góry strony.

    Object.keys(STATE.selectedTags).forEach(phaseId => {
        // Only show global tags in the top bar (not settlement individual tags)
        if (phaseId === 'settlement') return;

        STATE.selectedTags[phaseId].forEach(tagText => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerText = tagText;
            bar.appendChild(tag);
        });
    });
}

function placeSettlement(latlng) {
    if (STATE.currentSettlement) {
        // Move existing settlement
        STATE.currentSettlement.latlng = latlng;
        STATE.currentSettlement.marker.setLatLng(latlng);
        return;
    }

    const lang = STATE.language.toUpperCase();
    const ui = DATA[lang].UI;
    const name = prompt(ui.textPrompt || "Settlement Name:");
    if (!name) return;

    const settlement = {
        id: Date.now(),
        latlng: latlng,
        name: name,
        tags: [],
        marker: null
    };

    // Create Marker
    const icon = L.divIcon({
        className: 'map-settlement-container',
        html: `
            <div class="map-settlement-tags" style="display: ${STATE.isTagsVisible ? 'flex' : 'none'}"></div>
            <div class="map-settlement-label">
                <span class="settlement-name" onclick="toggleSettlementTags(event)">${name}</span>
            </div>
            <svg style="display:block" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="2">
                <path d="M21 10c0 8-9 14-9 14s-9-6-9-14a9 9 0 0 1 18 0z"></path>
                <circle cx='12' cy='10' r='3' fill="black"></circle>
            </svg>`,
        iconSize: [200, 120],
        iconAnchor: [100, 120]
    });

    settlement.marker = L.marker(latlng, {
        icon: icon,
        draggable: true
    }).addTo(mapInstance);

    settlement.marker.on('dragend', function (event) {
        settlement.latlng = event.target.getLatLng();
    });

    STATE.settlements = [settlement]; // Only one for now
    STATE.currentSettlement = settlement;
    saveState();
}

function updateSettlementMarker(s) {
    if (!s.marker) return;
    const tagHtml = s.tags.map(t => `<span class="map-settlement-tag">${t}</span>`).join('');
    const container = s.marker.getElement();
    const tagsContainer = container.querySelector('.map-settlement-tags');
    tagsContainer.innerHTML = tagHtml;

    // Toggle visibility based on state
    tagsContainer.style.display = STATE.isTagsVisible ? 'flex' : 'none';
}

function toggleSettlementTags(e) {
    if (e) e.stopPropagation();
    STATE.isTagsVisible = !STATE.isTagsVisible;

    // Update all settlements
    if (STATE.currentSettlement) {
        updateSettlementMarker(STATE.currentSettlement);
    }

    // Also update the visibility button in toolbar if it exists
    const visBtn = document.getElementById('btn-toggle-visibility');
    if (visBtn) {
        visBtn.classList.toggle('hidden-state', !STATE.isTagsVisible);
    }
}

function toggleTagsVisibility() {
    STATE.isTagsVisible = !STATE.isTagsVisible;
    STATE.settlements.forEach(s => updateSettlementMarker(s));

    const btn = document.getElementById('btn-toggle-visibility');
    if (btn) btn.classList.toggle('hidden-state', !STATE.isTagsVisible);
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
        saveState();
    } else {
        // Simple loop prevention or game over state
        alert(DATA[lang].UI.gameOver);
    }
}

function prevPhase() {
    if (STATE.phaseIndex > 0) {
        STATE.phaseIndex--;
        renderPhase();
        saveState();
    }
}

function resetGame() {
    const lang = STATE.language.toUpperCase();
    if (confirm(DATA[lang].UI.confirmClear || "Reset all progress?")) {
        localStorage.removeItem('gatheringStorm_gameState');
        localStorage.removeItem('gatheringStorm_canvas');
        window.location.reload();
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

    // If text tool is active, canvas should be transparent to clicks or we handle it here
    canvas.addEventListener('click', (e) => {
        if (STATE.tool === 'text') {
            // Forward to map since map doesn't get it when canvas is on top
            const latlng = mapInstance.containerPointToLatLng([e.offsetX, e.offsetY]);
            showTextInput(latlng, e.clientX, e.clientY);
        } else if (STATE.tool === 'settlement') {
            const latlng = mapInstance.containerPointToLatLng([e.offsetX, e.offsetY]);
            placeSettlement(latlng);
        }
    });

    window.addEventListener('resize', () => {
        // Save current canvas content
        const dataUrl = canvas.toDataURL();

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        // Restore settings
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = STATE.tool === 'eraser' ? 20 : 2;
        ctx.strokeStyle = STATE.color;
        if (STATE.tool === 'eraser') ctx.globalCompositeOperation = 'destination-out';

        // Re-draw
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = dataUrl;
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
    saveState();
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

    // Update icons visibility/pointer events
    const canvas = document.getElementById('drawing-canvas');
    if (toolName === 'text') {
        canvas.classList.add('text-tool-active');
        canvas.style.pointerEvents = 'auto';
    } else if (toolName === 'move') {
        canvas.classList.remove('text-tool-active');
        canvas.style.pointerEvents = 'none';
    } else {
        canvas.classList.remove('text-tool-active');
        canvas.style.pointerEvents = 'auto';
    }

    // UI Visuals
    document.querySelectorAll('.tool-btn').forEach(btn => {
        if ((toolName === 'brush' && btn.title === 'Brush') ||
            (toolName === 'eraser' && btn.title === 'Eraser') ||
            (toolName === 'text' && btn.id === 'btn-tool-text') ||
            (toolName === 'move' && btn.id === 'btn-tool-move') ||
            (toolName === 'settlement' && btn.classList.contains('settlement-tool-visual'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
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

        // Clear text markers
        STATE.textMarkers.forEach(m => m.remove());
        STATE.textMarkers = [];
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
if (!loadState()) {
    // If no saved state, we are on setup screen
}

