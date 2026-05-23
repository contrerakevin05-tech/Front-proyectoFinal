// ======================================
// API URLS
// ======================================

const API_URLS = {

    // NODE + MYSQL
    pokemon:
        'https://proyectofinal-urpf.onrender.com/api/pokemon',

    // JAVA + POSTGRES
    naruto:
        'https://proyectofinal-1-ai7r.onrender.com/api/naruto',

    // PYTHON + MONGODB
    dragonball:
        'https://proyectofinal-2-k4fh.onrender.com/api/dragonball'
};

// ======================================
// CACHE
// ======================================

const cache = {

    pokemon: null,

    naruto: null,

    dragonball: null
};

// ======================================
// PLACEHOLDER IMAGE
// ======================================

const PLACEHOLDER_IMAGE =
    'https://placehold.co/400x400?text=No+Image';

// ======================================
// INIT
// ======================================

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        initializeTabs();

        // SHOW POKEMON BY DEFAULT
        const pokemonSection =
            document.getElementById('pokemon');

        if (pokemonSection) {

            pokemonSection.classList.add('active');
        }

        // LOAD POKEMON
        await loadSection('pokemon');
    }
);

// ======================================
// INITIALIZE TABS
// ======================================

function initializeTabs() {

    const tabs =
        document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {

        tab.addEventListener(
            'click',
            async () => {

                // REMOVE ACTIVE BUTTON
                tabs.forEach(t =>
                    t.classList.remove('active')
                );

                // ACTIVE BUTTON
                tab.classList.add('active');

                // TARGET
                const target =
                    tab.dataset.target;

                // HIDE ALL SECTIONS
                document
                    .querySelectorAll('.content-section')
                    .forEach(section =>
                        section.classList.remove('active')
                    );

                // SHOW TARGET SECTION
                const targetSection =
                    document.getElementById(target);

                if (targetSection) {

                    targetSection.classList.add('active');
                }

                // LOAD DATA
                await loadSection(target);
            }
        );
    });
}

// ======================================
// LOAD SECTION
// ======================================

async function loadSection(type) {

    // CACHE
    if (cache[type]) {

        renderData(type, cache[type]);

        return;
    }

    // FETCH
    await fetchData(type);
}

// ======================================
// FETCH DATA
// ======================================

async function fetchData(type) {

    const loader =
        document.getElementById('loader');

    const errorMessage =
        document.getElementById('error-message');

    try {

        // SHOW LOADER
        loader?.classList.remove('hidden');

        // HIDE ERRORS
        errorMessage?.classList.add('hidden');

        console.log(
            `Fetching ${type}:`,
            API_URLS[type]
        );

        // FETCH
        const response =
            await fetch(API_URLS[type], {

                method: 'GET',

                headers: {

                    'Content-Type':
                        'application/json'
                }
            });

        // VALIDATE HTTP
        if (!response.ok) {

            throw new Error(
                `HTTP ERROR ${response.status}`
            );
        }

        // ======================================
        // JSON
        // ======================================

        const result =
            await response.json();

        console.log(
            `${type} raw data:`,
            result
        );

        // ======================================
        // NORMALIZE DATA
        // ======================================

        let data;

        // DIRECT ARRAY
        if (Array.isArray(result)) {

            data = result;
        }

        // OBJECT WITH DATA
        else if (
            Array.isArray(result.data)
        ) {

            data = result.data;
        }

        // OBJECT WITH POKEMON
        else if (
            Array.isArray(result.pokemon)
        ) {

            data = result.pokemon;
        }

        // OBJECT WITH RESULTS
        else if (
            Array.isArray(result.results)
        ) {

            data = result.results;
        }

        // INVALID
        else {

            console.error(
                'Invalid API response:',
                result
            );

            throw new Error(
                'La API no devolvió un array válido'
            );
        }

        console.log(
            `${type} normalized data:`,
            data
        );

        // CACHE
        cache[type] = data;

        // RENDER
        renderData(type, data);

    } catch (error) {

        console.error(
            `Error loading ${type}:`,
            error
        );

        if (errorMessage) {

            errorMessage.innerHTML = `

                <strong>
                    Error cargando ${type}
                </strong>

                <br>

                ${error.message}

            `;

            errorMessage.classList.remove(
                'hidden'
            );
        }

    } finally {

        // HIDE LOADER
        loader?.classList.add('hidden');
    }
}

// ======================================
// SAFE IMAGE
// ======================================

function getSafeImage(url) {

    if (
        !url ||
        typeof url !== 'string' ||
        url.trim() === ''
    ) {

        return PLACEHOLDER_IMAGE;
    }

    return url;
}

// ======================================
// EMPTY STATE
// ======================================

function renderEmpty(container) {

    container.innerHTML = `

        <div class="empty-state">

            Datos no disponibles

        </div>

    `;
}

// ======================================
// CREATE CARD
// ======================================

function createCard() {

    const card =
        document.createElement('div');

    card.className = 'card';

    return card;
}

// ======================================
// RENDER DATA
// ======================================

function renderData(type, data) {

    const container =
        document.getElementById(
            `${type}-container`
        );

    // VALIDATE CONTAINER
    if (!container) {

        console.error(
            'Container not found:',
            type
        );

        return;
    }

    // CLEAR
    container.innerHTML = '';

    // VALIDATE DATA
    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        renderEmpty(container);

        return;
    }

    // LOOP
    data.forEach(item => {

        const card =
            createCard();

        // ======================================
        // POKEMON
        // ======================================

        if (type === 'pokemon') {

            const frontImage =
                getSafeImage(
                    item.imagen_frontal
                );

            const backImage =
                getSafeImage(
                    item.imagen_trasera
                );

            card.innerHTML = `

                <div class="pokemon-images">

                    <img
                        class="pokemon-front"
                        src="${frontImage}"
                        alt="${item.nombre || 'Pokemon'}"
                        loading="lazy"
                        onerror="this.src='${PLACEHOLDER_IMAGE}'"
                    >

                    <img
                        class="pokemon-back"
                        src="${backImage}"
                        alt="${item.nombre || 'Pokemon'}"
                        loading="lazy"
                        onerror="this.src='${PLACEHOLDER_IMAGE}'"
                    >

                </div>

                <h2>
                    ${item.nombre || 'Sin nombre'}
                </h2>

                <span class="badge pokemon-badge">
                    Pokémon
                </span>

                <div class="stats">

                    <span>
                        Altura
                    </span>

                    <strong>
                        ${item.altura || 0}
                    </strong>

                </div>

                <div class="stats">

                    <span>
                        Peso
                    </span>

                    <strong>
                        ${item.peso || 0}
                    </strong>

                </div>

            `;
        }

        // ======================================
        // NARUTO
        // ======================================

        else if (type === 'naruto') {

            const image =
                getSafeImage(
                    item.imagen ||
                    item.image
                );

            card.innerHTML = `

                <div class="single-image-container">

                    <img
                        class="single-image"
                        src="${image}"
                        alt="${item.name || item.nombre || 'Naruto'}"
                        loading="lazy"
                        onerror="this.src='${PLACEHOLDER_IMAGE}'"
                    >

                </div>

                <h2>
                    ${item.name || item.nombre || 'Sin nombre'}
                </h2>

                <span class="badge naruto-badge">
                    ${item.village || item.aldea || 'Sin Aldea'}
                </span>

                <div class="stats">

                    <span>
                        Chakra
                    </span>

                    <strong>
                        ${(
                            item.chakra_level ||
                            item.chakra ||
                            0
                        ).toLocaleString()}
                    </strong>

                </div>

                <div class="stats">

                    <span>
                        Rol
                    </span>

                    <strong>
                        ${item.role || 'Shinobi'}
                    </strong>

                </div>

            `;
        }

        // ======================================
        // DRAGON BALL
        // ======================================

        else if (type === 'dragonball') {

            const image =
                getSafeImage(
                    item.image ||
                    item.imagen
                );

            card.innerHTML = `

                <div class="single-image-container">

                    <img
                        class="single-image dragonball-character"
                        src="${image}"
                        alt="${item.name || 'Dragon Ball'}"
                        loading="lazy"
                        onerror="this.src='${PLACEHOLDER_IMAGE}'"
                    >

                </div>

                <h2>
                    ${item.name || 'Sin nombre'}
                </h2>

                <span class="badge dragonball-badge">
                    ${item.race || 'Saiyajin'}
                </span>

                <div class="stats">

                    <span>
                        Ki
                    </span>

                    <strong>
                        ${(
                            item.power || 0
                        ).toLocaleString()}
                    </strong>

                </div>

                <div class="stats">

                    <span>
                        Rol
                    </span>

                    <strong>
                        ${item.role || 'Guerrero'}
                    </strong>

                </div>

            `;
        }

        // APPEND
        container.appendChild(card);
    });
}
