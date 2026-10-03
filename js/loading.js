/* LAMP ISLAND — логика загрузочного экрана.
   ES5 без библиотек. Garry's Mod вызывает:
   GameDetails, SetStatusChanged, DownloadingFile, SetFilesNeeded, SetFilesTotal. */

(function () {
    'use strict';

    /* ---------- тексты ---------- */

    var SESSION = {
        day: 'Дневной сеанс',
        sunset: 'Вечерний сеанс',
        night: 'Ночной сеанс',
        dawn: 'Утренний сеанс · шторм'
    };

    var MAP_NAMES = {
        'resort_island': 'Остров',
        'resort_island_night': 'Остров · ночь',
        'resort_island_sunset': 'Остров · закат',
        'resort_island_storm': 'Остров · шторм'
    };

    var STATUS_RU = {
        'Retrieving server info...': 'Получаем данные сервера…',
        'Sending client info...': 'Отправляем данные клиента…',
        'Connecting to server...': 'Подключаемся к серверу…',
        'Loading map...': 'Загружаем карту…',
        'Workshop Complete': 'Workshop готов',
        'Loading...': 'Загрузка…'
    };

    var QUOTES = {
        shared: [
            { t: 'Остров никуда не торопится. И тебе не обязательно.', a: 'Ламповый остров' },
            { t: 'Хороший фильм — повод собраться. Остров — повод остаться.', a: 'Правила кинотеатра' },
            { t: 'Здесь не нужно ничего побеждать.', a: 'Табличка у входа' }
        ],
        day: [
            { t: 'Солнце в зените, вода прозрачная, проектор остывает до вечера.', a: 'Дневник смотрителя' },
            { t: 'Днём остров светлый и тихий. Как первая сцена перед титрами.', a: 'Хроники острова' }
        ],
        sunset: [
            { t: 'Закат — единственный сеанс, который никто не пропускает.', a: 'Бармен с пирса' },
            { t: 'Небо само выбрало цветокоррекцию.', a: 'Киномеханик' }
        ],
        night: [
            { t: 'Ночью свет только от экрана и луны. Этого достаточно.', a: 'Ночной сеанс' },
            { t: 'Самые тихие разговоры — после титров.', a: 'Дежурный по проектору' }
        ],
        dawn: [
            { t: 'Дождь по крыше бунгало — лучший саундтрек к утру.', a: 'Смотритель острова' },
            { t: 'Шторм снаружи. Внутри — плед, чай и кино.', a: 'Хроники острова' }
        ]
    };

    var TIPS = {
        shared: [
            'F1 открывает меню сервера.',
            'За время на сервере капают монеты. Тратятся в магазине.',
            'Анимации и позы — в меню ActMod.',
            'Голос слышно только рядом, примерно 600 юнитов. Отойдите, если хотите поговорить наедине.',
            'Сесть можно почти на что угодно: подойдите и нажмите E.',
            'Видео в очередь ставят через экран кинотеатра. Очередь общая, не спешите.',
            'Микрофон лучше держать на кнопке: тишина в зале — это уважение.',
            'Noclip разрешён. Летайте, но не мешайте тем, кто смотрит.',
            'На пирсе можно рыбачить. Улов засчитывается.',
            'Бумбокс играет радио для всех вокруг. Не включайте его в зале.',
            'Пианино и игровые автоматы работают. Проверьте.',
            'Дуэли и мини-ивенты запускаются из меню. Победитель получает монеты.'
        ],
        day: [
            'Днём видно весь остров. Прогуляйтесь до дальних бунгало.',
            'Бассейн открыт круглосуточно, но днём в нём светлее всего.'
        ],
        sunset: [
            'Лучший вид на закат — с пирса у главного здания.',
            'Вечером зал заполняется быстрее. Занимайте места.'
        ],
        night: [
            'Ночью в бунгало горит свет. Ищите огоньки.',
            'Ночной сеанс — время для длинных фильмов.'
        ],
        dawn: [
            'В шторм на пирсе скользко, но вид с него того стоит.',
            'Дождь в зал кинотеатра не попадает. Проверено.'
        ]
    };

    /* ---------- состояние ---------- */

    var S = {
        theme: 'day',
        status: '',
        file: '',
        total: 0,
        needed: 0,
        details: null
    };

    var D = null; /* DOM-ссылки, появляются после DOMContentLoaded */

    /* ---------- интерфейс для GMod (назначаем сразу) ---------- */

    window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language, niceGamemode) {
        S.details = {
            servername: servername || '',
            mapname: mapname || '',
            gamemode: gamemode || '',
            niceGamemode: niceGamemode || '',
            steamid: steamid ? String(steamid) : ''
        };
        renderDetails();
        loadSteamProfile(S.details.steamid);
    };

    window.SetStatusChanged = function (status) {
        S.status = status ? String(status) : '';
        S.file = '';
        renderStatus();
    };

    window.DownloadingFile = function (name) {
        S.file = shortenFile(name ? String(name) : '');
        renderStatus();
    };

    window.SetFilesNeeded = function (n) {
        S.needed = toInt(n);
        renderProgress();
    };

    window.SetFilesTotal = function (n) {
        S.total = toInt(n);
        renderProgress();
    };

    /* ---------- рендер ---------- */

    function renderDetails() {
        if (!D || !S.details) return;
        var d = S.details;
        if (d.servername) document.title = d.servername;

        var parts = [];
        var map = prettyMap(d.mapname);
        if (map) parts.push(map);
        parts.push(prettyGamemode(d.niceGamemode || d.gamemode));
        D.meta.textContent = parts.join(' · ');
    }

    function renderStatus() {
        if (!D) return;
        if (S.file) {
            D.status.textContent = 'Загрузка: ' + S.file;
        } else if (S.status) {
            D.status.textContent = STATUS_RU[S.status] || S.status;
        }
    }

    function renderProgress() {
        if (!D) return;
        if (S.total > 0) {
            var p = 1 - S.needed / S.total;
            if (p < 0) p = 0;
            if (p > 1) p = 1;
            removeClass(D.track, 'is-indeterminate');
            D.fill.style.width = (p * 100).toFixed(1) + '%';
            var text = Math.round(p * 100) + ' %';
            if (S.needed > 0) text += ' · осталось ' + S.needed + ' ' + plural(S.needed, 'файл', 'файла', 'файлов');
            D.counter.textContent = text;
        } else {
            addClass(D.track, 'is-indeterminate');
            D.fill.style.width = '';
            D.counter.textContent = '';
        }
    }

    /* ---------- Steam: имя и аватар ---------- */

    function loadSteamProfile(id64) {
        if (!/^\d{17}$/.test(id64)) return;
        var done = false;
        var xhr;
        try { xhr = new XMLHttpRequest(); } catch (e) { return; }

        var timer = setTimeout(function () {
            if (done) return;
            done = true;
            try { xhr.abort(); } catch (e) {}
        }, 4000);

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4 || done) return;
            done = true;
            clearTimeout(timer);
            if (xhr.status !== 200) return;
            var doc = xhr.responseXML;
            if (!doc && window.DOMParser) {
                try { doc = new DOMParser().parseFromString(xhr.responseText, 'text/xml'); } catch (e) { doc = null; }
            }
            if (!doc) return;
            var nameNode = doc.getElementsByTagName('steamID')[0];
            var avatarNode = doc.getElementsByTagName('avatarFull')[0];
            if (nameNode && nameNode.textContent) setGreeting(nameNode.textContent);
            if (avatarNode && avatarNode.textContent) setAvatar(avatarNode.textContent);
        };

        try {
            xhr.open('GET', 'https://steamcommunity.com/profiles/' + id64 + '?xml=1', true);
            xhr.send();
        } catch (e) {
            done = true;
            clearTimeout(timer);
        }
    }

    function setGreeting(name) {
        name = String(name).replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
        if (!name) return;
        if (name.length > 24) name = name.slice(0, 23) + '…';
        if (D) D.greet.textContent = 'Привет, ' + name;
    }

    function setAvatar(url) {
        if (!D || !/^https?:\/\//.test(url)) return;
        var img = new Image();
        img.onload = function () {
            D.avatarImg.src = url;
            addClass(D.avatar, 'is-loaded');
        };
        img.src = url;
    }

    /* ---------- подсказки и цитаты ---------- */

    function startRotation() {
        var quotes = shuffle((QUOTES[S.theme] || []).concat(QUOTES.shared));
        var tips = shuffle((TIPS[S.theme] || []).concat(TIPS.shared));
        var qi = 0, ti = 0;

        if (quotes.length) showQuote(quotes[0]);
        if (tips.length) D.tip.textContent = tips[0];

        if (tips.length > 1) {
            setInterval(function () {
                ti = (ti + 1) % tips.length;
                swapText([D.tip], function () { D.tip.textContent = tips[ti]; });
            }, 8000);
        }

        if (quotes.length > 1) {
            setTimeout(function () {
                setInterval(function () {
                    qi = (qi + 1) % quotes.length;
                    swapText([D.quoteText, D.quoteAuthor], function () { showQuote(quotes[qi]); });
                }, 14000);
            }, 5000);
        }
    }

    function showQuote(q) {
        D.quoteText.textContent = q.t;
        D.quoteAuthor.textContent = q.a;
    }

    function swapText(els, apply) {
        var i;
        for (i = 0; i < els.length; i++) addClass(els[i], 'is-hidden');
        setTimeout(function () {
            apply();
            for (i = 0; i < els.length; i++) removeClass(els[i], 'is-hidden');
        }, 600);
    }

    /* ---------- demo-режим (только ?demo=1) ---------- */

    function runDemo() {
        var suffix = { day: '', sunset: '_sunset', night: '_night', dawn: '_storm' }[S.theme] || '';
        var sid = param('steamid');
        window.GameDetails('Lamp Island', '', 'gm_resort_island_opt' + suffix, 32, sid, 'cinema', 50, 'ru', 'Cinema');
        window.SetStatusChanged('Retrieving server info...');

        var total = 40, left = total, step = 0;
        setTimeout(function () {
            window.SetFilesTotal(total);
            window.SetFilesNeeded(left);
            var iv = setInterval(function () {
                step++;
                left--;
                if (step % 3 === 0) window.DownloadingFile('materials/models/lamp/cinema/screen_' + step + '.vmt');
                window.SetFilesNeeded(left);
                if (left <= 0) {
                    clearInterval(iv);
                    window.SetStatusChanged('Sending client info...');
                }
            }, 300);
        }, 2000);
    }

    /* ---------- утилиты ---------- */

    function param(name) {
        var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
        if (!m) return '';
        try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
    }

    function toInt(n) {
        n = parseInt(n, 10);
        return isNaN(n) || n < 0 ? 0 : n;
    }

    function plural(n, one, few, many) {
        var m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return one;
        if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
        return many;
    }

    function prettyMap(name) {
        if (!name) return '';
        var key = String(name).toLowerCase().replace(/^gm_/, '').replace(/_opt(?=_|$)/, '');
        if (MAP_NAMES[key]) return MAP_NAMES[key];
        return key.replace(/_/g, ' ');
    }

    function prettyGamemode(name) {
        if (!name) return 'Кинотеатр';
        var low = String(name).toLowerCase();
        if (low === 'cinema' || low === 'cinema_modded' || low === 'cinema modded') return 'Кинотеатр';
        return String(name);
    }

    function shortenFile(name) {
        name = name.replace(/\\/g, '/');
        var base = name.slice(name.lastIndexOf('/') + 1);
        if (base.length > 36) base = '…' + base.slice(-35);
        return base;
    }

    function shuffle(arr) {
        var a = arr.slice(), i, j, t;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function addClass(el, c) {
        if (!el) return;
        if ((' ' + el.className + ' ').indexOf(' ' + c + ' ') === -1) el.className = (el.className + ' ' + c).replace(/^\s+/, '');
    }

    function removeClass(el, c) {
        if (!el) return;
        el.className = (' ' + el.className + ' ').replace(' ' + c + ' ', ' ').replace(/^\s+|\s+$/g, '');
    }

    function byId(id) { return document.getElementById(id); }

    /* ---------- старт ---------- */

    function init() {
        S.theme = document.documentElement.getAttribute('data-theme') || 'day';
        if (!SESSION[S.theme]) S.theme = 'day';

        D = {
            session: byId('session'),
            quoteText: byId('quoteText'),
            quoteAuthor: byId('quoteAuthor'),
            status: byId('status'),
            counter: byId('counter'),
            track: byId('track'),
            fill: byId('fill'),
            tip: byId('tip'),
            avatar: byId('avatar'),
            avatarImg: byId('avatarImg'),
            greet: byId('greet'),
            meta: byId('meta')
        };

        D.session.textContent = SESSION[S.theme];
        D.meta.textContent = 'Кинотеатр';

        /* сбрасываем всё, что GMod успел прислать до готовности DOM */
        renderDetails();
        renderStatus();
        renderProgress();
        if (S.details && S.details.steamid) loadSteamProfile(S.details.steamid);

        startRotation();

        if (param('demo') === '1') runDemo();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
