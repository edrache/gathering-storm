const DATA = {
    EN: {
        TRUTHS: [
            "We fought for our freedom, but memories of the time before are still raw.",
            "The galaxy outside is hostile and treacherous.",
            "The alien power, the Authority, is gone, but still has a hold. People, industries and memories still remain. Processing their alien fruit is our main employment and source of trade."
        ],
        PHASES: [
            {
                id: 'uncovering',
                title: 'UNCOVERING',
                text: "Together we will create a map and a story. We will build up the map as we play. Each player will add something new to each place. Eventually we will know more about this place, and we will seek to know the community that lives here."
            },
            {
                id: 'our-land',
                title: 'OUR LAND',
                text: "First we’ll describe a far-away world. We’ll take a few minutes to choose or invent five aspects of the local environment, while we **draw them** on our screen. What does our land look like? What are the main features?",
                prompt: "Draw 5 aspects of the local environment.",
                suggestions: "Red dust landscape, twin moons, low mist, shimmering haze, jagged rock, rolling fields, verdant crops, bioluminescent moss..."
            },
            {
                id: 'settlement',
                title: 'SETTLEMENT',
                text: "Now we’ll **draw a settlement** somewhere suitable in the middle of the map. As we draw, we’ll give the settlement a **name**. What does it look like?",
                prompt: "Draw the settlement in the middle.",
                suggestions: "Spherical dwellings, cuboid forms, fractal architecture, clean lines, organic forms..."
            },
            {
                id: 'who-we-are',
                title: 'WHO WE ARE',
                text: "Now let’s take a few minutes to choose or invent three aspects of **who we are**.",
                prompt: "Discuss: What do we look like? What do we do together? How do we live together?",
                suggestions: "Large, small, hairy, smooth, reptilian, mammalian, vegetal, fungal..."
            },
            {
                id: 'our-area',
                title: 'OUR AREA',
                text: "We’ll take turns to **draw and describe** three more sites.",
                prompt: "Draw 3 more sites (e.g., Dark Forest, Winding River). Note names if people live there.",
                suggestions: "Dark Forest, Winding River, Verdant Highlands, Hermitage Shack, Rebel Base..."
            },
            {
                id: 'authority',
                title: 'THE AUTHORITY',
                text: "Now let’s choose or invent three aspects of the Authority. We’ll **draw their Abandoned Headquarters** on the map.",
                prompt: "Draw the Authority's Abandoned Headquarters.",
                suggestions: "Large, small, hairy, smooth, reptilian..."
            },
            {
                id: 'authority-influence',
                title: 'AUTHORITY INFLUENCE',
                text: "The Authority still has an influence. We’ll **draw the Authority’s remaining sites**: the **Colonial Farmstead**, the **Industrial Cannery**.",
                prompt: "Draw the Colonial Farmstead and Industrial Cannery.",
                suggestions: ""
            },
            {
                id: 'remnants',
                title: 'REMNANTS',
                text: "What has the Authority left behind? We’ll **draw some features** on the Map.",
                prompt: "Draw remnants of the Authority.",
                suggestions: "Strange creature, intricate flower, deserted camp, something hidden..."
            },
            {
                id: 'alien-fruit',
                title: 'ALIEN FRUIT',
                text: "Let’s choose or invent three aspects of this **alien fruit**. We’ll **draw the fruit**, and then **draw the Vast Plantation**.",
                prompt: "Draw the Alien Fruit and the Vast Plantation.",
                suggestions: "Sweet, sour, nourishing, aromatic, addictive, psychotropic..."
            },
            {
                id: 'characters-secrets',
                title: 'CHARACTERS & SECRETS',
                text: "Deal cards. Introduce your characters. Keep secrets private.",
                prompt: "Review your Character and Secret cards.",
                suggestions: ""
            },
            {
                id: 'oracle',
                title: 'THE ORACLE',
                text: "Take turns drawing an Oracle card. Read the event, describe instructions, and draw something on the map.",
                prompt: "Draw a card from the Oracle deck.",
                suggestions: ""
            }
        ],
        CHARACTERS: {
            'd_king': { name: 'The Bureaucrat', desc: 'Arranges shipments and payments' },
            'd_queen': { name: 'The Worker', desc: 'Works processing Alien Fruit, dreamer' },
            'd_jack': { name: 'The Archivist', desc: 'Writes of the times before, and times now' },
            'c_king': { name: 'The Rebel Loner', desc: 'Lives alone, once a hero of the rebellion' },
            'c_queen': { name: 'The Leader', desc: 'Looks after the people of the Settlement' },
            'c_jack': { name: 'The Freedom Fighter', desc: 'Fought for freedom, but what is life now?' },
            'h_king': { name: 'The Settler-Farmer', desc: 'Born in the land of the Authority, anxious' },
            'h_queen': { name: 'The Horticulturalist', desc: 'Tends the Alien fruit, develops hybrids' },
            'h_jack': { name: 'The Farmhand', desc: 'Works the land of the Alien fruit' },
            's_king': { name: 'The Soldier', desc: 'Has seen conflict, but on which side?' },
            's_queen': { name: 'The Factory Manager', desc: 'Oversees processing of the Alien fruit' },
            's_jack': { name: 'The Police Officer', desc: 'Kept order before, keeps order now' }
        },
        SECRETS: {
            'h_a': 'A Murderer', 'h_2': 'Informant', 'h_3': 'Collaborator', 'h_4': 'The Betrayed',
            'h_5': 'Thief', 'h_6': 'Lover', 'h_7': 'Witness', 'h_8': 'Trauma',
            'h_9': 'Lover', 'h_10': 'The Bereaved', 'joker': 'Strange Fruit Addict'
        },
        ORACLE: {
            'ace': {
                'd': "The occupation left you all altered. Everyone say something about how that time changed you.",
                'c': "Someone discovers a vast trove of paperwork hidden by the occupation. What does it show? Who is implicated?",
                's': "Finally, it is the celebration day of independence. Who unburdens a secret? What does this change? Everyone say something about how our story ends, each player offering final words."
            },
            '2': {
                'd': "Two people who live here decide to commit themselves to each other. Who performs the rituals for the union? Describe the moment.",
                'c': "Someone vows to reclaim what the occupation have taken. Who? Why?",
                's': "A secret is revealed. Is the wider community altered?"
            },
            '3': {
                'd': "A character reveals their secret card and speaks. Who reacts badly?",
                'c': "A character reveals their secret card and speaks. Who is changed?",
                's': "A secret is revealed. Does it make things better or worse?"
            },
            '4': {
                'd': "The cannery is still running, exporting tinned alien fruit. Who benefits?",
                'c': "Someone is stealing the alien fruit. Why? What happens?",
                's': "The cannery is giving out free cans to the people to celebrate independence. How does everyone react?"
            },
            '5': {
                'd': "Someone speaks up about grievances from before the occupation. Everyone say something about the old conflicts of this community.",
                'c': "Someone who has been spraying the crops has fallen ill. What happens?",
                's': "Conflict flares up among community members. Who is involved and why? Everyone say something about how it’s resolved."
            },
            '6': {
                'd': "The children have made a new game. What is it? Who disapproves?",
                'c': "The children have made a new song. What is it? Who is made happy?",
                's': "The children are witnesses to a secret. What is it?"
            },
            '7': {
                'd': "Your character is leaving the community. Why are they leaving? Remove your character card from play, and choose a character and secret from the characters on the map. The departing character reveals their secret. Everyone say something about how they react to this change and the secret.",
                'c': "A settler child has started climbing the fruit trees, copying the other children of the settlement. Who disapproves?",
                's': "A storm is brewing. Which two characters meet as they shelter?"
            },
            '8': {
                'd': "The harvest is starting. Who is happy? Who is sad?",
                'c': "The alien fruit has evolved in an unusual way. Who notices? What happens?",
                's': "Someone is stealing the pesticide. Who? Why?"
            },
            '9': {
                'd': "Creatures are dying where the pesticide is used. Which creatures? Everyone say something about the community’s reaction.",
                'c': "Someone calls for the cannery and plantation to come into community hands. What happens?",
                's': "Someone from outside is proposing terms to purchase the cannery. How does the community react? Everyone say something about what happens."
            },
            '10': {
                'd': "Who calls for reconciliation with the Authority? Everyone say something about why this is a good or bad idea.",
                'c': "A terrible atrocity is revealed from the time of the Authority. What was the atrocity? Who uncovers it? What happens?",
                's': "A settler family is leaving. Why is their child sad? What happens?"
            }
        },
        UI: {
            title: "GATHERING STORM",
            subtitle: "A game of rebuilding a community",
            playerCount: "Number of Players:",
            startBtn: "INITIALIZE MAP",
            settingsBtn: "MAP SETTINGS",
            nextPhaseBtn: "NEXT PHASE ➔",
            drawBtn: "DRAW CARD",
            communityTitle: "COMMUNITY",
            secretLabel: "Secret: ???",
            confirmClear: "Clear all drawings?",
            deckEmpty: "Deck Empty!",
            gameOver: "The story continues in the Oracle phase until the Ace of Spades is drawn.",
            gameEndTrigger: "GAME END TRIGGER!"
        }
    },
    PL: {
        TRUTHS: [
            "Walczyliśmy o wolność, ale wspomnienia o czasach „przed” są wciąż bolesne.",
            "Galaktyka na zewnątrz jest wroga i zdradliwa.",
            "Obca potęga, Władza, odeszła, ale wciąż ma na nas wpływ. Pozostali ludzie, przemysł i wspomnienia. Przetwarzanie ich obcego owocu jest naszym głównym zajęciem i źródłem handlu."
        ],
        PHASES: [
            {
                id: 'uncovering',
                title: 'ODKRYWANIE',
                text: "Razem stworzymy mapę i opowieść. Będziemy uzupełniać mapę w trakcie gry. Każdy gracz doda coś nowego do każdego miejsca. Z czasem dowiemy się więcej o tej krainie i postaramy się poznać społeczność, która tu mieszka."
            },
            {
                id: 'our-land',
                title: 'NASZA KRAINA',
                text: "Najpierw opiszemy odległy świat. Poświęćmy kilka minut na wybranie lub wymyślenie pięciu aspektów lokalnego środowiska, jednocześnie rysując je na naszym ekranie. Jak wygląda nasza kraina? Jakie są jej główne cechy?",
                prompt: "Narysuj 5 aspektów lokalnego środowiska.",
                suggestions: "Czerwony pył, bliźniacze księżyce, niska mgła, lśniąca mgiełka, poszarpane skały, faliste pola, bujne plony, bioluminescencyjny mech..."
            },
            {
                id: 'settlement',
                title: 'OSADA',
                text: "Teraz narysujemy osadę w odpowiednim miejscu na środku mapy. Rysując, nadamy jej nazwę. Jak ona wygląda?",
                prompt: "Narysuj osadę na środku mapy.",
                suggestions: "Sferyczne domostwa, kuboidy, architektura fraktalna, czyste linie, organiczne formy..."
            },
            {
                id: 'who-we-are',
                title: 'KIM JESTEŚMY',
                text: "Poświęćmy kilka minut na wybranie lub wymyślenie trzech aspektów tego, kim jesteśmy.",
                prompt: "Podyskutujcie: Jak wyglądamy? Co robimy razem? Jak wspólnie żyjemy?",
                suggestions: "Wielcy, mali, owłosieni, gładcy, gadzi, ssakopodobni, roślinni, grzybowi..."
            },
            {
                id: 'our-area',
                title: 'NASZA OKOLICA',
                text: "Na zmianę rysujcie i opisujcie trzy kolejne miejsca.",
                prompt: "Narysuj 3 kolejne miejsca (np. Mroczny Las, Kręta Rzeka). Zapisz nazwy, jeśli ktoś tam mieszka.",
                suggestions: "Mroczny Las, Kręta Rzeka, Bujne Wyżyny, Chata Pustelnika, Baza Rebeliantów..."
            },
            {
                id: 'authority',
                title: 'WŁADZA',
                text: "Teraz wybierzmy lub wymyślmy trzy aspekty Władzy. Narysujemy ich Porzuconą Kwaterę Główną na mapie.",
                prompt: "Narysuj Porzuconą Kwaterę Główną Władzy.",
                suggestions: "Wielcy, mali, owłosieni, gładcy, gadzi..."
            },
            {
                id: 'authority-influence',
                title: 'WPŁYWY WŁADZY',
                text: "Władza wciąż ma wpływ. Narysujemy pozostałe miejsca Władzy: Kolonialne Gospodarstwo, Przemysłową Przetwórnię.",
                prompt: "Narysuj Kolonialne Gospodarstwo i Przemysłową Przetwórnię.",
                suggestions: ""
            },
            {
                id: 'remnants',
                title: 'POZOSTAŁOŚCI',
                text: "Co Władza zostawiła po sobie? Narysujemy kilka elementów na Mapie.",
                prompt: "Narysuj pozostałości po Władzy.",
                suggestions: "Dziwne stworzenie, misterny kwiat, opuszczony obóz, coś ukrytego..."
            },
            {
                id: 'alien-fruit',
                title: 'OBCY OWOC',
                text: "Wybierzmy lub wymyślmy trzy aspekty tego obcego owocu. Narysujemy owoc, a następnie narysujemy Wielką Plantację.",
                prompt: "Narysuj Obcy Owoc i Wielką Plantację.",
                suggestions: "Słodki, kwaśny, pożywny, aromatyczny, uzależniający, psychotropowy..."
            },
            {
                id: 'characters-secrets',
                title: 'POSTACIE I TAJEMNICE',
                text: "Rozdajcie karty. Przedstawcie swoje postacie. Zachowajcie tajemnice dla siebie.",
                prompt: "Przejrzyj swoje karty Postaci i Tajemnicy.",
                suggestions: ""
            },
            {
                id: 'oracle',
                title: 'WYROCZNIA',
                text: "Na zmianę dobierajcie kartę z Wyroczni. Przeczytajcie wydarzenie, opiszcie działanie i narysujcie coś na mapie.",
                prompt: "Dobierz kartę z talii Wyroczni.",
                suggestions: ""
            }
        ],
        CHARACTERS: {
            'd_king': { name: 'Biurokrata', desc: 'Organizuje transporty i płatności' },
            'd_queen': { name: 'Robotnik', desc: 'Pracuje przy przetwarzaniu Obcego Owocu, marzyciel' },
            'd_jack': { name: 'Archiwista', desc: 'Pisze o czasach „przed” i o tym, co teraz' },
            'c_king': { name: 'Samotny Rebeliant', desc: 'Żyje w odosobnieniu, dawniej bohater buntu' },
            'c_queen': { name: 'Liderka', desc: 'Opiekuje się mieszkańcami Osady' },
            'c_jack': { name: 'Bojownik o Wolność', desc: 'Walczył o wolność, ale czym jest życie teraz?' },
            'h_king': { name: 'Osadnik-Farmer', desc: 'Urodzony w krainie Władzy, pełen niepokoju' },
            'h_queen': { name: 'Hortikulturoznawca', desc: 'Pielęgnuje Obcy Owoc, tworzy hybrydy' },
            'h_jack': { name: 'Pomocnik Rolnika', desc: 'Pracuje na ziemi, gdzie rośnie Obcy Owoc' },
            's_king': { name: 'Żołnierz', desc: 'Widział konflikt, ale po której stronie?' },
            's_queen': { name: 'Kierownik Fabryki', desc: 'Nadzoruje przetwarzanie Obcego Owocu' },
            's_jack': { name: 'Policjant', desc: 'Pilnował porządku dawniej, pilnuje go i teraz' }
        },
        SECRETS: {
            'h_a': 'Morderca', 'h_2': 'Informator', 'h_3': 'Kolaborant', 'h_4': 'Zdradzony',
            'h_5': 'Złodziej', 'h_6': 'Kochanek', 'h_7': 'Świadek', 'h_8': 'Trauma',
            'h_9': 'Kochanek', 'h_10': 'W żałobie', 'joker': 'Uzależniony od Obcego Owocu'
        },
        ORACLE: {
            'ace': {
                'd': "Okupacja zmieniła was wszystkich. Niech każdy powie, jak tamten czas go odmienił.",
                'c': "Ktoś odkrywa ogromny zbiór dokumentów ukrytych przez okupantów. Co one pokazują? Kto jest w to zamieszany?",
                's': "Wreszcie nadszedł dzień świętowania niepodległości. Kto wyjawia tajemnicę? Co to zmienia? Niech każdy powie coś o tym, jak kończy się nasza historia; każdy gracz wypowiada ostatnie słowa."
            },
            '2': {
                'd': "Dwie osoby, które tu mieszkają, postanawiają się ze sobą związać. Kto odprawia rytuały zjednoczenia? Opisz ten moment.",
                'c': "Ktoś przysięga odzyskać to, co zabrała okupacja. Kto? Dlaczego?",
                's': "Tajemnica zostaje ujawniona. Czy cała społeczność się zmienia?"
            },
            '3': {
                'd': "Postać ujawnia swoją kartę tajemnicy i przemawia. Kto reaguje źle?",
                'c': "Postać ujawnia swoją kartę tajemnicy i przemawia. Kto się zmienia?",
                's': "Tajemnica zostaje ujawniona. Czy to pogarsza, czy poprawia sytuację?"
            },
            '4': {
                'd': "Przetwórnia wciąż działa, eksportując puszkowany obcy owoc. Kto na tym zyskuje?",
                'c': "Ktoś kradnie obcy owoc. Dlaczego? Co się dzieje?",
                's': "Przetwórnia rozdaje ludziom darmowe puszki, by uczcić niepodległość. Jak wszyscy reagują?"
            },
            '5': {
                'd': "Ktoś głośno mówi o krzywdach sprzed okupacji. Niech każdy powie coś o dawnych konfliktach w tej społeczności.",
                'c': "Ktoś, kto opryskiwał plony, zachorował. Co się dzieje?",
                's': "Wybucha konflikt między członkami społeczności. Kto jest zaangażowany i dlaczego? Niech każdy powie, jak został rozwiązany."
            },
            '6': {
                'd': "Dzieci wymyśliły nową zabawę. Co to za zabawa? Kto jej nie pochwala?",
                'c': "Dzieci ułożyły nową piosenkę. O czym ona jest? Kogo uszczęśliwia?",
                's': "Dzieci są świadkami tajemnicy. Co to za tajemnica?"
            },
            '7': {
                'd': "Twoja postać opuszcza społeczność. Dlaczego odchodzi? Usuń swoją kartę postaci z gry i wybierz postać oraz tajemnicę spośród postaci na mapie. Odchodząca postać wyjawia swoją tajemnicę. Niech każdy powie, jak reaguje na tę zmianę i tę tajemnicę.",
                'c': "Dziecko osadników zaczęło wspinać się na drzewa owocowe, naśladując inne dzieci z osady. Kto tego nie pochwala?",
                's': "Zbiera się na burzę. Które dwie postacie spotykają się, szukając schronienia?"
            },
            '8': {
                'd': "Zaczynają się żniwa. Kto jest szczęśliwy? Kto smutny?",
                'c': "Obcy owoc ewoluował w niezwykły sposób. Kto to zauważył? Co się dzieje?",
                's': "Ktoś kradnie pestycydy. Kto? Dlaczego?"
            },
            '9': {
                'd': "Tam, gdzie używa się pestycydów, giną stworzenia. Jakie? Niech każdy powie coś o reakcji społeczności.",
                'c': "Ktoś wzywa, by przetwórnia i plantacja przeszły w ręce społeczności. Co się dzieje?",
                's': "Ktoś z zewnątrz proponuje warunki zakupu przetwórni. Jak reaguje społeczność? Niech każdy powie, co się dzieje."
            },
            '10': {
                'd': "Kto wzywa do pojednania z Władzą? Niech każdy powie, dlaczego to dobry lub zły pomysł.",
                'c': "Ujawniona zostaje straszna zbrodnia z czasów Władzy. Co to była za zbrodnia? Kto ją odkrywa? Co się dzieje?",
                's': "Rodzina osadników odchodzi. Dlaczego ich dziecko jest smutne? Co się dzieje?"
            }
        },
        UI: {
            title: "GATHERING STORM",
            subtitle: "Gra o odbudowie społeczności",
            playerCount: "Liczba graczy:",
            startBtn: "ZAINICJUJ MAPĘ",
            settingsBtn: "USTAWIENIA MAPY",
            nextPhaseBtn: "NASTĘPNA FAZA ➔",
            drawBtn: "DOBIERZ KARTĘ",
            communityTitle: "SPOŁECZNOŚĆ",
            secretLabel: "Tajemnica: ???",
            confirmClear: "Wyczyścić wszystkie rysunki?",
            deckEmpty: "Talia pusta!",
            gameOver: "Historia trwa w fazie Wyroczni, aż do wyciągnięcia Asa Pik.",
            gameEndTrigger: "ZAKOŃCZENIE GRY!"
        }
    },
    LAND_SEEDS: [
        { name: "Warsaw, PL", lat: 52.237, lng: 21.017 },
        { name: "Paris, FR", lat: 48.856, lng: 2.352 },
        { name: "Tokyo, JP", lat: 35.689, lng: 139.691 },
        { name: "Nairobi, KE", lat: -1.292, lng: 36.821 },
        { name: "Sydney, AU", lat: -33.868, lng: 151.209 },
        { name: "Buenos Aires, AR", lat: -34.603, lng: -58.381 },
        { name: "Cairo, EG", lat: 30.044, lng: 31.235 },
        { name: "Mumbai, IN", lat: 19.076, lng: 72.877 },
        { name: "NYC, US", lat: 40.712, lng: -74.006 },
        { name: "London, UK", lat: 51.507, lng: -0.127 },
        { name: "Beijing, CN", lat: 39.904, lng: 116.407 },
        { name: "Rio, BR", lat: -22.906, lng: -43.172 },
        { name: "Cape Town, ZA", lat: -33.924, lng: 18.423 },
        { name: "Mexico City, MX", lat: 19.432, lng: -99.133 },
        { name: "Istanbul, TR", lat: 41.008, lng: 28.978 },
        { name: "Casablanca, MA", lat: 33.573, lng: -7.589 },
        { name: "Reykjavik, IS", lat: 64.126, lng: -21.827 },
        { name: "Lima, PE", lat: -12.046, lng: -77.042 },
        { name: "Ulaanbaatar, MN", lat: 47.886, lng: 106.905 },
        { name: "Antananarivo, MG", lat: -18.879, lng: 47.507 },
        { name: "Tromso, NO", lat: 69.649, lng: 18.955 },
        { name: "Anchorage, US", lat: 61.218, lng: -149.900 },
        { name: "Alice Springs, AU", lat: -23.698, lng: 133.880 },
        { name: "Iquitos, PE", lat: -3.749, lng: -73.253 },
        { name: "Kathmandu, NP", lat: 27.717, lng: 85.324 },
        { name: "Addis Ababa, ET", lat: 9.019, lng: 38.746 },
        { name: "Isfahan, IR", lat: 32.654, lng: 51.667 },
        { name: "Samarkand, UZ", lat: 39.627, lng: 66.974 },
        { name: "Sapa, VN", lat: 22.336, lng: 103.843 },
        { name: "La Paz, BO", lat: -16.489, lng: -68.119 }
    ],
    MAP_PROVIDERS: {
        standard: {
            name: "Standard (OSM)",
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: "&copy; OpenStreetMap"
        },
        physical: {
            name: "Physical (No labels/roads)",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
            attribution: "Esri, NPS"
        },
        terrain: {
            name: "Terrain (Natural)",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
            attribution: "Esri, USGS"
        }
    }
};

