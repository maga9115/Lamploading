// Глобальные переменные
let loadingStatus = document.getElementById('loadingStatus');
let loadingBar = document.getElementById('loadingBar');
let loadingPercent = document.getElementById('loadingPercent');
let tipText = document.getElementById('tipText');
let mapName = document.getElementById('mapName');
let playerCount = document.getElementById('playerCount');
let backgroundMusic = document.getElementById('backgroundMusic');
let musicToggleBtn = document.getElementById('musicToggleBtn');
let volumeSlider = document.getElementById('volumeSlider');
let volumeIcon = document.getElementById('volumeIcon');
let animeQuote = document.getElementById('animeQuote');
let quoteAuthor = document.getElementById('quoteAuthor');
let sakuraContainer = document.getElementById('sakuraContainer');
let nightStarCanvas = document.getElementById('night-stars');
let sunsetHeatCanvas = document.getElementById('sunset-heat');
let dayBokehCanvas = document.getElementById('day-bokeh');

// Переменные для отслеживания состояния загрузки
let statusUpdated = [false, false, false, false]; // Для отслеживания обновлений статуса

// Массив советов для отображения
const tipsByTheme = {
    day: [
        "Сандалии в песке, F1 в руке — так и живём.",
        "Не забудьте крем от солнца, пока грузятся аддоны.",
        "Коктейль “Reload Lua” подаётся строго после 80% прогресса.",
        "Если видите дельфина — это админ в отпуске.",
        "Бассейн открыт, даже когда карта ещё грузится."
    ],
    dawn: [
        "Проснулся раньше сервера? Приготовь кофе и терпение.",
        "Рассветные лучи ускоряют прогресс на 3%. Проверяли.",
        "Аккаунт находит Wi-Fi ещё до подключения.",
        "Первая лодка уходит ровно в момент SetProgressChanged(50).",
        "Если тихо, можно услышать, как сервер переворачивается на другой бок."
    ],
    sunset: [
        "Лучшие места — за горизонтом. Но попкорн у нас.",
        "Закатные скриншоты улучшают FPS — психологически.",
        "После 70% прогресса небо становится ещё красивее.",
        "Если полоска залипла, просто полюбуйся небом.",
        "Мягкий плед + мягкий шейдер = true story."
    ],
    night: [
        "Плед готов, чай заваривается, прогресс почти тоже.",
        "Лунный свет повышает урон, а пледы — FPS.",
        "Ночного кофе хватает ровно до SetProgressChanged(100).",
        "Не перепутайте фонарик и солнечный удар — ночь же.",
        "Луна — наш модератор, не спорьте с ней."
    ]
};

const quotesByTheme = {
    day: [
        { quote: "Днём — пляж, вечером — кино. Между ними — сладкий AFK.", author: "Хроники Лампового Острова" },
        { quote: "Чилл — это когда попкорн заканчивается раньше загрузки.", author: "Смотритель лежаков" },
        { quote: "Чем больше солнца, тем ближе фестиваль фильмов.", author: "Метеоролог сервера" }
    ],
    dawn: [
        { quote: "Рассвет — это когда сервер просыпается раньше админов.", author: "Житель Лампового Острова" },
        { quote: "Завтрак, синхронизация, повторить — идеальный план дня.", author: "Главный бариста" },
        { quote: "С первыми лучами приходит желание нажать F2.", author: "Любитель раннего фарма" }
    ],
    sunset: [
        { quote: "Лучший попкорн — там, где солнце садится в океан.", author: "Бармен с пирса" },
        { quote: "Закат — вечеринка без диджея, но с красивым небом.", author: "Ассоциация чилла" },
        { quote: "Берегись: после 80% прогресса начинается режим “лампа”.", author: "Песочные часы" }
    ],
    night: [
        { quote: "Ночью кино вкуснее — попкорн исчезает невидимо.", author: "Дежурный по проектору" },
        { quote: "Луна — наш главный прожектор.", author: "Смотритель пляжного кино" },
        { quote: "Ночные волны совпадают с частотой кадров.", author: "Техник по акустике" }
    ]
};

// Массив рангов игроков
const playerRanks = [
    "Зритель",
    "Завсегдатай",
    "Киноман",
    "Критик",
    "Режиссёр",
    "Продюсер",
    "Мастер Кино"
];

// Инициализация загрузочного экрана
document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM после загрузки страницы
    loadingStatus = document.getElementById('loadingStatus') || loadingStatus;
    loadingBar = document.getElementById('loadingBar') || loadingBar;
    loadingPercent = document.getElementById('loadingPercent') || loadingPercent;
    tipText = document.getElementById('tipText') || tipText;
    mapName = document.getElementById('mapName') || mapName;
    playerCount = document.getElementById('playerCount') || playerCount;
    backgroundMusic = document.getElementById('backgroundMusic') || backgroundMusic;
    musicToggleBtn = document.getElementById('musicToggleBtn') || musicToggleBtn;
    volumeSlider = document.getElementById('volumeSlider') || volumeSlider;
    volumeIcon = document.getElementById('volumeIcon') || volumeIcon;
    animeQuote = document.getElementById('animeQuote') || animeQuote;
    quoteAuthor = document.getElementById('quoteAuthor') || quoteAuthor;
    sakuraContainer = document.getElementById('sakuraContainer') || sakuraContainer;
    
    // Адаптация к размеру экрана
    handleResponsiveLayout();
    
    // Запуск эффекта сакуры
    createSakuraEffect();
    initNightStars();
    initSunsetHeat();
    initDayBokeh();
    
    // Начать воспроизведение музыки
    initBackgroundMusic();
    
    // Запуск процесса загрузки
    startLoading();
    
    // Запуск циклического отображения советов
    startTips();
    
    // Запуск циклического отображения цитат
    startQuotes();
    
    // Получение информации о сервере
    getServerInfo();
    
    // Создание эффекта shine для персонажей
    initCharacterEffects();
    
    // Отправляем уведомление в Lua о готовности JS
    setTimeout(notifyLuaJsReady, 1000);
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', handleResponsiveLayout);
});

// Функция для адаптации интерфейса при изменении размера окна
function handleResponsiveLayout() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Логирование для отладки
    console.log(`[Cinema Loading] Размер окна: ${width}x${height}`);
    
    // Позиционирование элементов в зависимости от размера экрана
    const container = document.querySelector('.container');
    if (container) {
        if (width <= 480) {
            // Перестраиваем элементы для очень маленьких экранов
            container.classList.add('mobile-layout');
            
            // Перемещаем элементы при необходимости
            moveElementForMobile('.server-info', '.loading-area', 'after');
            moveElementForMobile('.social-icons', '.footer', 'before');
        } else {
            // Восстанавливаем стандартный макет
            container.classList.remove('mobile-layout');
            
            // Возвращаем элементы на их оригинальные позиции, если они были перемещены
            restoreElementPosition('.server-info');
            restoreElementPosition('.social-icons');
        }
        
        // Регулировка высоты персонажей в зависимости от высоты экрана
        adjustCharacterHeight(height);
    }
}

// Вспомогательная функция для перемещения элементов в мобильном режиме
function moveElementForMobile(selector, targetSelector, position) {
    const element = document.querySelector(selector);
    const target = document.querySelector(targetSelector);
    
    if (element && target && !element.classList.contains('moved')) {
        element.dataset.originalParent = element.parentNode.tagName;
        element.dataset.originalPosition = Array.from(element.parentNode.children).indexOf(element);
        
        if (position === 'after') {
            target.after(element);
        } else if (position === 'before') {
            target.before(element);
        } else {
            target.appendChild(element);
        }
        
        element.classList.add('moved');
    }
}

// Вспомогательная функция для восстановления позиции элемента
function restoreElementPosition(selector) {
    const element = document.querySelector(selector);
    
    if (element && element.classList.contains('moved')) {
        // Восстанавливаем оригинальную позицию, если данные сохранены
        if (element.dataset.originalParent && element.dataset.originalPosition) {
            // Логика восстановления позиции
            element.classList.remove('moved');
        }
    }
}

// Вспомогательная функция для регулировки высоты персонажей
function adjustCharacterHeight(windowHeight) {
    const characters = document.querySelectorAll('.character');
    
    characters.forEach(character => {
        if (windowHeight < 600) {
            character.style.height = '40vh';
        } else if (windowHeight < 768) {
            character.style.height = '45vh';
        } else if (windowHeight < 900) {
            character.style.height = '50vh';
        } else {
            character.style.height = ''; // Сбросить до значения из CSS
        }
    });
}

// Функция для создания эффекта падающей сакуры
function createSakuraEffect() {
    // Проверяем существование контейнера
    if (!sakuraContainer) {
        console.error("Контейнер для сакуры не найден!");
        return;
    }
    
    // Очищаем контейнер
    sakuraContainer.innerHTML = '';
    
    // Увеличиваем количество лепестков
    const sakuraCount = 50;
    console.log(`Создаем ${sakuraCount} лепестков сакуры...`);
    
    // Создаем начальные лепестки
    for (let i = 0; i < sakuraCount; i++) {
        createSakura();
    }
    
    // Периодическое создание новых лепестков
    setInterval(() => {
        // Ограничиваем общее количество лепестков
        if (sakuraContainer && sakuraContainer.children.length < 100) {
            createSakura();
        }
    }, 500);
}

function initNightStars() {
    if(!nightStarCanvas) return;
    const ctx = nightStarCanvas.getContext('2d');
    const starCount = 140;
    const cometCount = 6;
    const stars = Array.from({length: starCount}, () => createStar());
    const comets = Array.from({length: cometCount}, () => createComet());
    const cometTrailMax = 28;

    function createStar(){
        return {
            x: Math.random(),
            y: Math.random(),
            size: Math.random()*1.8+0.4,
            alpha: Math.random()*0.5+0.4,
            twinkle: Math.random()*Math.PI*2,
            drift: Math.random()*0.0005+0.0001,
            driftDir: (Math.random()*2-1)*0.15,
            orbit: Math.random()*0.002+0.0005
        };
    }

    function createComet(){
        return {
            x: Math.random()*0.2 - 0.25,
            y: Math.random(),
            speed: Math.random()*0.0004 + 0.00018,
            drift: (Math.random()*0.00012 - 0.00006),
            alpha: Math.random()*0.3+0.4,
            born: performance.now(),
            trail: []
        };
    }

    function resetComet(comet){
        comet.x = Math.random()*0.2 - 0.25;
        comet.y = Math.random();
        comet.speed = Math.random()*0.0004 + 0.00018;
        comet.drift = (Math.random()*0.00012 - 0.00006);
        comet.alpha = Math.random()*0.3+0.4;
        comet.born = performance.now();
        comet.trail = [];
    }

    function resize(){
        nightStarCanvas.width = window.innerWidth;
        nightStarCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function loop(){
        ctx.clearRect(0,0,nightStarCanvas.width, nightStarCanvas.height);
        const now = performance.now();
        const w = nightStarCanvas.width;
        const h = nightStarCanvas.height;

        stars.forEach(star => {
            star.y += star.drift;
            star.x += star.driftDir * star.drift;
            if(star.y > 1) star.y = 0;
            if(star.x < 0) star.x += 1;
            if(star.x > 1) star.x -= 1;
            const tw = (Math.sin(now*0.002 + star.twinkle)+1)/2;
            const alpha = star.alpha*0.3 + tw*0.7;
            ctx.fillStyle = `rgba(210, 235, 255, ${alpha})`;
            const x = star.x * w;
            const y = star.y * h;
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI*2);
            ctx.fill();
        });

        comets.forEach(comet => {
            comet.x += comet.speed;
            comet.y += comet.drift;
            if(comet.x > 1.25 || comet.y < -0.2 || comet.y > 1.2){
                resetComet(comet);
            }
            const cx = comet.x * w;
            const cy = comet.y * h;
            comet.trail.unshift({ x: cx, y: cy, time: now });
            if(comet.trail.length > cometTrailMax){
                comet.trail.pop();
            }
            for(let i=0; i<comet.trail.length-1; i++){
                const a = comet.trail[i];
                const b = comet.trail[i+1];
                const age = (now - a.time)/1000;
                const fade = Math.max(0, 1 - age*1.1);
                ctx.strokeStyle = `rgba(170, 210, 255, ${fade * comet.alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
            const headFade = Math.min(1, (now - comet.born)/600);
            ctx.fillStyle = `rgba(255,255,255,${headFade * comet.alpha})`;
            ctx.beginPath();
            ctx.arc(cx, cy, 2.6, 0, Math.PI*2);
            ctx.fill();
        });

        requestAnimationFrame(loop);
    }
    loop();
}

function initSunsetHeat(){
    if(!sunsetHeatCanvas) return;
    const ctx = sunsetHeatCanvas.getContext('2d');
    let width, height;
    const waves = Array.from({length: 6}, (_,i) => ({
        offset: Math.random()*Math.PI*2,
        speed: 0.15 + Math.random()*0.1,
        amplitude: 16 + i*6,
        frequency: 0.003 + Math.random()*0.0015
    }));

    function resize(){
        width = sunsetHeatCanvas.width = window.innerWidth;
        height = sunsetHeatCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function loop(){
        ctx.clearRect(0,0,width,height);
        const time = performance.now()/1000;
        ctx.save();
        ctx.fillStyle = 'rgba(255,200,120,0.08)';
        ctx.globalCompositeOperation = 'lighter';
        for(const wave of waves){
            ctx.beginPath();
            const amp = wave.amplitude;
            for(let x=0; x<=width; x+=40){
                const y = height*0.6 + Math.sin(x*wave.frequency + time*wave.speed + wave.offset) * amp;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
        requestAnimationFrame(loop);
    }
    loop();
}

function initDayBokeh(){
    if(!dayBokehCanvas) return;
    const ctx = dayBokehCanvas.getContext('2d');
    const blobs = Array.from({length: 18}, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random()*120 + 60,
        speedX: (Math.random()*0.0002 - 0.0001),
        speedY: (Math.random()*0.0001 + 0.00005),
        alpha: Math.random()*0.25 + 0.15,
        hue: Math.random()*20 + 45
    }));
    let width, height;

    function resize(){
        width = dayBokehCanvas.width = window.innerWidth;
        height = dayBokehCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function loop(){
        ctx.clearRect(0,0,width,height);
        const time = performance.now()/1000;
        blobs.forEach(blob => {
            blob.x += blob.speedX;
            blob.y -= blob.speedY;
            if(blob.y < -0.1) blob.y = 1.1;
            if(blob.x < -0.1) blob.x = 1.1;
            if(blob.x > 1.1) blob.x = -0.1;
            const x = blob.x * width;
            const y = blob.y * height;
            const r = blob.size * (0.6 + Math.sin(time + blob.hue)*0.1);
            const gradient = ctx.createRadialGradient(x, y, r*0.2, x, y, r);
            gradient.addColorStop(0, `rgba(255, 255, 230, ${blob.alpha})`);
            gradient.addColorStop(0.6, `rgba(255, 245, 200, ${blob.alpha*0.4})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI*2);
            ctx.fill();
        });
        requestAnimationFrame(loop);
    }
    loop();
}

// Создание одного лепестка сакуры
function createSakura() {
    // Создаем новый элемент
    const sakura = document.createElement('div');
    sakura.classList.add('sakura');
    
    // Добавляем уникальный ID
    sakura.id = 'sakura-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    // Случайные начальные позиции и параметры
    const size = Math.random() * 15 + 15; // размер от 15 до 30px
    const startPositionX = Math.random() * window.innerWidth; // случайная позиция по ширине экрана
    const fallDuration = Math.random() * 10 + 10; // время падения от 10 до 20 секунд
    const rotationSpeed = Math.random() * 5 + 5; // скорость вращения
    
    // Применение стилей
    sakura.style.width = `${size}px`;
    sakura.style.height = `${size}px`;
    sakura.style.left = `${startPositionX}px`;
    sakura.style.top = `-${size}px`;
    sakura.style.opacity = Math.random() * 0.3 + 0.7; // непрозрачность от 0.7 до 1.0
    
    // Добавление анимации для падения прямо вниз
    sakura.style.animation = `
        fallDown ${fallDuration}s linear forwards,
        rotate ${rotationSpeed}s linear infinite
    `;
    
    // Удаление лепестка после завершения анимации
    sakura.addEventListener('animationend', function(e) {
        if (e.animationName === 'fallDown' && this.parentNode) {
            this.parentNode.removeChild(this);
        }
    });
    
    // Добавление на страницу
    if (sakuraContainer) {
        sakuraContainer.appendChild(sakura);
    }
}

// Инициализация аудио и контроллеров
function initBackgroundMusic() {
    // Проверяем поддержку формата OGG
    const audioTest = document.createElement('audio');
    const canPlayOgg = !!audioTest.canPlayType && audioTest.canPlayType('audio/ogg; codecs="vorbis"') !== '';
    
    if (canPlayOgg) {
        console.log("[Cinema Loading] Формат OGG поддерживается браузером");
    } else {
        console.log("[Cinema Loading] Формат OGG не поддерживается, будет использован MP3");
    }
    
    // Настройка начальной громкости
    backgroundMusic.volume = volumeSlider.value / 100;
    
    // Настройка слайдера громкости
    volumeSlider.addEventListener('input', function() {
        backgroundMusic.volume = this.value / 100;
        updateVolumeIcon(this.value);
        
        // Сохраняем значение громкости в localStorage
        localStorage.setItem('cinemaVolume', this.value);
    });
    
    // Загружаем сохраненную громкость
    const savedVolume = localStorage.getItem('cinemaVolume');
    if (savedVolume !== null) {
        volumeSlider.value = savedVolume;
        backgroundMusic.volume = savedVolume / 100;
        updateVolumeIcon(savedVolume);
    }
    
    // Настройка кнопки включения/выключения музыки
    musicToggleBtn.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    volumeIcon.className = 'fas fa-volume-up';
                }).catch(error => {
                    console.error("[Cinema Loading] Ошибка воспроизведения: ", error);
                });
            }
        } else {
            backgroundMusic.pause();
            volumeIcon.className = 'fas fa-volume-mute';
        }
        
        // Сохраняем состояние музыки
        localStorage.setItem('cinemaMusicState', backgroundMusic.paused ? 'paused' : 'playing');
    });
    
    // Загружаем сохраненное состояние музыки
    const savedMusicState = localStorage.getItem('cinemaMusicState');
    if (savedMusicState === 'playing') {
        playBackgroundMusic();
    }
    
    // Показать слайдер громкости при наведении
    musicToggleBtn.addEventListener('mouseenter', function() {
        const container = document.querySelector('.volume-slider-container');
        if (container) {
            container.style.width = '100px';
            container.style.opacity = '1';
        }
    });
    
    // Скрыть слайдер громкости при уходе мыши
    const controls = document.querySelector('.music-controls');
    if (controls) {
        controls.addEventListener('mouseleave', function() {
            const container = document.querySelector('.volume-slider-container');
            if (container) {
                container.style.width = '0';
                container.style.opacity = '0';
            }
        });
    }
    
    // Попытка воспроизведения музыки
    playBackgroundMusic();
}

// Функция для обновления состояния иконки громкости
function updateVolumeIcon(value) {
    if (value <= 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (value < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Функция для начала воспроизведения фоновой музыки
function playBackgroundMusic() {
    // Попытка воспроизведения музыки (может быть заблокировано политикой браузера)
    let playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            console.log('Музыка начала воспроизводиться');
            volumeIcon.className = 'fas fa-volume-up';
        }).catch(error => {
            console.log('Автоматическое воспроизведение заблокировано: ' + error);
            volumeIcon.className = 'fas fa-volume-mute';
        });
    }
}

// Функция для инициализации эффектов персонажей
function initCharacterEffects() {
    // Добавить эффект shine при движении мыши
    document.addEventListener('mousemove', function(e) {
        const shine1 = document.querySelector('.character1-shine');
        const shine2 = document.querySelector('.character2-shine');
        
        // Получаем координаты мыши
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Перемещаем блики в зависимости от позиции мыши
        shine1.style.left = `${mouseX * 0.05}px`;
        shine1.style.top = `${mouseY * 0.05}px`;
        
        shine2.style.right = `${mouseX * 0.05}px`;
        shine2.style.top = `${mouseY * 0.05}px`;
    });
}

// Функция получения информации о сервере (в GMod эта информация будет доступна через GameDetails)
function getServerInfo() {
    // Прослушиваем глобальную функцию для получения деталей о сервере
    window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language) {
        // Обновляем информацию на странице
        document.getElementById('serverName').textContent = servername || "Аниме CINEMA Сервер";
        mapName.textContent = mapname || "Загрузка...";
        playerCount.textContent = "? / " + (maxplayers || "?");
        if (document.getElementById('gameMode')) {
            document.getElementById('gameMode').textContent = gamemode || "CINEMA";
        }
        
        // Установка громкости музыки
        if (volume !== undefined) {
            backgroundMusic.volume = volume / 100;
            volumeSlider.value = volume;
            updateVolumeIcon(volume);
        }
        
        console.log("[Cinema Loading] Получена информация о сервере:", {
            servername,
            serverurl,
            mapname,
            maxplayers,
            steamid,
            gamemode,
            volume,
            language
        });
    };
    
    // Функция для обновления статуса загрузки (вызывается Garry's Mod)
    window.SetStatusChanged = function(status) {
        if (loadingStatus) {
            loadingStatus.textContent = status;
            console.log("[Cinema Loading] Статус загрузки: " + status);
        }
    };
    
    // Функция для обновления прогресса загрузки (вызывается Garry's Mod)
    window.SetProgressChanged = function(progress) {
        // Проверяем наличие элементов DOM
        if (!loadingBar || !loadingPercent) return;
        
        // Применяем прогресс к полоске загрузки
        loadingBar.style.width = progress + '%';
        loadingPercent.textContent = Math.floor(progress) + '%';
        
        // Добавляем плавную анимацию
        loadingBar.style.transition = "width 0.3s ease-in-out";
        
        // Если загрузка завершена
        if (progress >= 100) {
            loadingBar.classList.add('loading-complete');
            document.querySelector('.container').classList.add('loading-finished');
            loadingStatus.textContent = "Добро пожаловать в аниме-кинотеатр!";
            
            // Дополнительные эффекты при завершении загрузки
            const characters = document.querySelectorAll('.character');
            characters.forEach(char => {
                char.style.animation = "pulse 2s infinite alternate";
            });
            
            console.log("[Cinema Loading] Загрузка завершена (100%)");
        }
    };
    
    // Получение данных с внешнего API, если Garry's Mod данные недоступны
    if (typeof GameDetails === 'undefined' || typeof SetProgressChanged === 'undefined') {
        console.log("[Cinema Loading] Использование API-данных с сайта (режим разработки/тестирования)");
        fetchServerInfoFromWebsite();
        // Обновляем каждые 30 секунд для поддержания актуальности данных
        setInterval(fetchServerInfoFromWebsite, 30000);
    }
}

// Функция имитации процесса загрузки
function startLoading() {
    // Используем реальные данные от сервера, если они доступны
    // Если нет - симулируем загрузку только в режиме тестирования
    
    if (typeof GameDetails === 'undefined' || typeof SetProgressChanged === 'undefined') {
        console.log("[Cinema Loading] Запуск симуляции загрузки (режим тестирования)");
        simulateGameDetails();
    } else {
        console.log("[Cinema Loading] Обнаружен реальный режим загрузки сервера");
    }
}

// Функция для циклического отображения советов
function resolveThemesArray(themeKey, map){
    if(map && map[themeKey] && map[themeKey].length > 0) return map[themeKey];
    for(const key in map){ if(map[key] && map[key].length) return map[key]; }
    return [];
}

function startTips() {
    if(!tipText) return;
    const theme = (document.body.dataset.theme || 'day');
    const tipsArray = resolveThemesArray(theme, tipsByTheme);
    if(tipsArray.length === 0) return;

    let currentTip = 0;
    tipText.textContent = tipsArray[0];

    setInterval(() => {
        tipText.classList.add('tip-fade');
        setTimeout(() => {
            currentTip = (currentTip + 1) % tipsArray.length;
            tipText.textContent = tipsArray[currentTip];
            tipText.classList.remove('tip-fade');
            tipText.classList.add('tip-appear');
            setTimeout(() => tipText.classList.remove('tip-appear'), 500);
        }, 500);
    }, 7000);
}

function startQuotes() {
    if(!animeQuote || !quoteAuthor) return;
    const theme = (document.body.dataset.theme || 'day');
    const quotesArray = resolveThemesArray(theme, quotesByTheme);
    if(quotesArray.length === 0) return;

    let currentQuote = 0;
    animeQuote.textContent = quotesArray[0].quote;
    quoteAuthor.textContent = "— " + quotesArray[0].author;

    setInterval(() => {
        animeQuote.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        setTimeout(() => {
            currentQuote = (currentQuote + 1) % quotesArray.length;
            animeQuote.textContent = quotesArray[currentQuote].quote;
            quoteAuthor.textContent = "— " + quotesArray[currentQuote].author;
            animeQuote.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
        }, 600);
    }, 12000);
}

// Анимация страницы при загрузке
document.addEventListener('load', function() {
    document.body.classList.add('page-loaded');
});

// Добавляем обработчик событий клавиатуры для тестирования (только в режиме разработки)
document.addEventListener('keydown', function(event) {
    // При нажатии клавиши "D" (Debug) симулируем получение информации о сервере
    if (event.key === 'd' || event.key === 'D') {
        console.log("Debug mode activated");
        window.GameDetails("Аниме CINEMA Тестовый Сервер", "test.server.com", "gm_cinema_theater", 32, "STEAM_ID", "cinema", 50, "ru");
    }
    
    // При нажатии клавиши "P" (Progress) симулируем установку прогресса
    if (event.key === 'p' || event.key === 'P') {
        let testProgress = Math.floor(Math.random() * 100);
        console.log("Setting test progress: " + testProgress + "%");
        window.SetProgressChanged(testProgress);
    }
    
    // При нажатии клавиши "L" (Loaded) симулируем завершение загрузки
    if (event.key === 'l' || event.key === 'L') {
        console.log("Setting complete progress");
        window.SetProgressChanged(100);
        loadingStatus.textContent = "Добро пожаловать в аниме-кинотеатр!";
    }
});

// Отправляем сообщение в Lua, что JS интерфейс готов
function notifyLuaJsReady() {
    try {
        if (typeof game !== 'undefined' && game.OnJsReady) {
            console.log("[Cinema Loading JS] Отправка уведомления в Lua о готовности JS");
            game.OnJsReady();
        } else {
            console.log("[Cinema Loading JS] Функция game.OnJsReady недоступна");
        }
    } catch(e) {
        console.error("[Cinema Loading JS] Ошибка при отправке уведомления:", e);
    }
}

// Симуляция получения данных от сервера Garry's Mod
function simulateGameDetails() {
    console.log("[Cinema Loading] Запуск симуляции загрузки");
    
    // Сбрасываем переменные для отслеживания статуса
    statusUpdated = [false, false, false, false];
    
    // Симуляция получения информации о сервере
    if (typeof GameDetails === 'function') {
        GameDetails(
            "Аниме CINEMA Сервер",
            "example.com", 
            "gm_construct", 
            "64", 
            "STEAM_0:1:123456789",
            "cinema",
            30,
            "ru"
        );
    }
    
    // Симуляция обновления прогресса загрузки
    let progress = 0;
    let loadingPhases = [
        { threshold: 0, status: "Подключение к серверу..." },
        { threshold: 25, status: "Загрузка ресурсов..." },
        { threshold: 50, status: "Загрузка карты..." },
        { threshold: 75, status: "Инициализация игровых объектов..." },
        { threshold: 90, status: "Подготовка к игре..." },
        { threshold: 100, status: "Добро пожаловать в аниме-кинотеатр!" }
    ];
    
    const progressInterval = setInterval(function() {
        // Увеличиваем прогресс с небольшой случайностью
        progress += (Math.random() * 2) + 0.5;
        progress = Math.min(progress, 100);
        
        // Применяем текущий прогресс
        if (typeof SetProgressChanged === 'function') {
            SetProgressChanged(Math.floor(progress));
        }
        
        // Обновляем статусы на определенных порогах
        for (let i = 0; i < loadingPhases.length; i++) {
            const phase = loadingPhases[i];
            if (progress >= phase.threshold && !statusUpdated[i]) {
                if (typeof SetStatusChanged === 'function') {
                    SetStatusChanged(phase.status);
                }
                statusUpdated[i] = true;
                break;
            }
        }
        
        // Останавливаем интервал, когда загрузка завершена
        if (progress >= 100) {
            clearInterval(progressInterval);
            console.log("[Cinema Loading] Симуляция загрузки завершена");
            
            // Добавляем небольшую задержку перед выводом финального сообщения
            setTimeout(() => {
                if (typeof SetStatusChanged === 'function') {
                    SetStatusChanged("Добро пожаловать в аниме-кинотеатр!");
                }
            }, 500);
        }
    }, 300);
}

// Функция для обновления количества игроков с сервера
window.SetPlayerCount = function(current, max) {
    if (playerCount) {
        playerCount.textContent = current + " / " + max;
        console.log("[Cinema Loading] Обновлено количество игроков:", current, "/", max);
    }
};

// Функция для получения информации о сервере с внешнего API
function fetchServerInfoFromWebsite() {
    // URL-адрес вашего API
    const apiUrl = 'https://ваш-сайт.ru/server_api.php';
    
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data && !isNaN(data.player_count) && !isNaN(data.max_players)) {
            // Обновляем информацию о сервере
            playerCount.textContent = data.player_count + " / " + data.max_players;
            mapName.textContent = data.map || "Загрузка...";
            if (document.getElementById('serverName')) {
                document.getElementById('serverName').textContent = data.server_name || "Аниме CINEMA Сервер";
            }
            
            console.log("[Cinema Loading] Получены данные с сайта:", data);
        }
    })
    .catch(error => {
        console.error("[Cinema Loading] Ошибка при получении данных с сайта:", error);
    });
} 