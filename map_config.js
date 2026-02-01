document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    const invertCheck = document.getElementById('invert-check');
    const sepiaSlider = document.getElementById('sepia-slider');
    const sepiaValue = document.getElementById('sepia-value');
    const hueSlider = document.getElementById('hue-slider');
    const hueValue = document.getElementById('hue-value');
    const contrastSlider = document.getElementById('contrast-slider');
    const contrastValue = document.getElementById('contrast-value');
    const brightnessSlider = document.getElementById('brightness-slider');
    const brightnessValue = document.getElementById('brightness-value');
    const providerSelect = document.getElementById('provider-select');
    const saveButton = document.getElementById('save-button');

    const defaults = {
        provider: 'physical',
        zoom: 8,
        invert: false,
        sepia: 100,
        hue: 0,
        contrast: 50,
        brightness: 69
    };

    // Load current settings from localStorage and merge with defaults
    const saved = localStorage.getItem('gatheringStorm_mapSettings');
    let settings = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;

    // Populate Provider Select
    Object.keys(DATA.MAP_PROVIDERS).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = DATA.MAP_PROVIDERS[key].name;
        if (key === settings.provider) opt.selected = true;
        providerSelect.appendChild(opt);
    });

    // Initialize UI with current settings
    function updateUI() {
        providerSelect.value = settings.provider || 'physical';
        zoomSlider.value = settings.zoom;
        zoomValue.textContent = settings.zoom;
        invertCheck.checked = settings.invert;
        sepiaSlider.value = settings.sepia;
        sepiaValue.textContent = settings.sepia + '%';
        hueSlider.value = settings.hue;
        hueValue.textContent = settings.hue + 'deg';
        contrastSlider.value = settings.contrast;
        contrastValue.textContent = settings.contrast + '%';
        brightnessSlider.value = settings.brightness;
        brightnessValue.textContent = settings.brightness + '%';
        updateMapFilter();
    }

    function updateMapFilter() {
        const inv = invertCheck.checked ? 1 : 0;
        const sep = sepiaSlider.value / 100;
        const hue = hueSlider.value;
        const con = contrastSlider.value / 100;
        const bri = brightnessSlider.value / 100;

        mapElement.style.filter = `invert(${inv}) sepia(${sep}) hue-rotate(${hue}deg) contrast(${con}) brightness(${bri})`;
    }

    // Initialize Leaflet
    const map = L.map('map', {
        zoomControl: true,
        attributionControl: false
    }).setView([52.2297, 21.0122], settings.zoom); // Default to Warsaw for preview

    let currentTileLayer = null;

    function updateTileLayer() {
        if (currentTileLayer) map.removeLayer(currentTileLayer);
        const p = DATA.MAP_PROVIDERS[settings.provider];
        currentTileLayer = L.tileLayer(p.url, {
            attribution: p.attribution
        }).addTo(map);
    }

    updateTileLayer();

    // Event Listeners
    providerSelect.addEventListener('change', () => {
        settings.provider = providerSelect.value;
        updateTileLayer();
    });

    zoomSlider.addEventListener('input', () => {
        const val = parseInt(zoomSlider.value);
        zoomValue.textContent = val;
        map.setZoom(val);
        settings.zoom = val;
    });

    [invertCheck, sepiaSlider, hueSlider, contrastSlider, brightnessSlider].forEach(el => {
        el.addEventListener('input', () => {
            settings.invert = invertCheck.checked;
            settings.sepia = parseInt(sepiaSlider.value);
            settings.hue = parseInt(hueSlider.value);
            settings.contrast = parseInt(contrastSlider.value);
            settings.brightness = parseInt(brightnessSlider.value);

            sepiaValue.textContent = settings.sepia + '%';
            hueValue.textContent = settings.hue + 'deg';
            contrastValue.textContent = settings.contrast + '%';
            brightnessValue.textContent = settings.brightness + '%';

            updateMapFilter();
        });
    });

    saveButton.addEventListener('click', () => {
        localStorage.setItem('gatheringStorm_mapSettings', JSON.stringify(settings));
        window.location.href = 'index.html';
    });

    updateUI();
});
