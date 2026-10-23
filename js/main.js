/* ============================================================
   0. УТИЛИТЫ
   ============================================================ */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#year').textContent = new Date().getFullYear();

/* ============================================================
   1. ШАПКА / ПРОГРЕСС / ПАРАЛЛАКС
   ============================================================ */
const header = $('#header');
const progress = $('#progress');
const heroBg = $('#heroBg');

let ticking = false;
function onScroll(){
  const y = window.scrollY || document.documentElement.scrollTop;

  header.classList.toggle('is-scrolled', y > 20);

  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

  if (!reduceMotion && heroBg && y < window.innerHeight * 1.4){
    heroBg.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking){ requestAnimationFrame(onScroll); ticking = true; }
}, { passive:true });
onScroll();

/* ============================================================
   2. БУРГЕР
   ============================================================ */
const burger = $('#burger');
const mobileMenu = $('#mobileMenu');

function closeMenu(){
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
}
burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
$$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));

/* ============================================================
   3. ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
   ============================================================ */
if ('IntersectionObserver' in window && !reduceMotion){
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting){
        e.target.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin:'0px 0px -8% 0px', threshold:0.12 });

  $$('.reveal').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('in'));
}

/* ============================================================
   4. ТЕСТ
   ============================================================ */
const QUESTIONS = [
  { q:'Как вы выбираете вещь в магазине?',
    a:[{t:'По ощущению ткани и тому, как она двигается', v:'rom' },
       {t:'По крою: чтобы линия была чистой и точной',    v:'min' },
       {t:'По странности: чем необычнее, тем лучше',      v:'art' },
       {t:'По качеству и тому, сколько она проживёт',     v:'cls' }] },
  { q:'Ваш идеальный силуэт?',
    a:[{t:'Мягкий, струящийся, с длиной',                 v:'rom' },
       {t:'Прямой и лаконичный, без деталей',             v:'min' },
       {t:'Асимметричный, многослойный',                  v:'art' },
       {t:'Структурный: плечо, талия, линия',             v:'cls' }] },
  { q:'Какую палитру вы носите чаще всего?',
    a:[{t:'Пудровые и тёплые оттенки',                    v:'rom' },
       {t:'Чёрный, серый, белый',                         v:'min' },
       {t:'Контрасты и неожиданные сочетания',            v:'art' },
       {t:'Глубокий тёмный и спокойный бежевый',          v:'cls' }] },
  { q:'Что для вас главное в образе?',
    a:[{t:'Настроение и лёгкость',                        v:'rom' },
       {t:'Точность и отсутствие лишнего',                v:'min' },
       {t:'Самовыражение',                                v:'art' },
       {t:'Уместность и уверенность',                     v:'cls' }] },
  { q:'Как вы собираетесь утром?',
    a:[{t:'По интуиции, под настроение',                  v:'rom' },
       {t:'По готовой формуле из своих вещей',            v:'min' },
       {t:'Импровизирую и комбинирую неожиданно',         v:'art' },
       {t:'По плану: на работу, на встречу, вечер',       v:'cls' }] }
];

const TYPES = {
  rom: {
    name:'Романтик',
    desc:'Мягкий, подвижный, чувствительный к настроению. Одежда для Романтика — это способ держать внутреннее состояние снаружи: тонкие ткани, струящиеся линии, тёплые оттенки.',
    palette:[
      {c:'#E8D9CE', l:'пудра'},
      {c:'#C9A9A0', l:'роза'},
      {c:'#8E7B72', l:'какао'},
      {c:'#3A3230', l:'глубокий'}
    ],
    items:['Платье-комбинация миди','Тонкий кардиган на пуговицах','Юбка на косую','Блуза с объёмным рукавом','Тренч мягкого кроя','Ботильоны на устойчивом каблуке'],
    logic:'Собирайте образ по принципу «одна фактура + одна линия». Плотное сочетайте с воздушным, тёплое — с холодным. Аксессуары тонкие, без массивных форм.'
  },
  min: {
    name:'Минималист',
    desc:'Спокойный, точный, не любит шума. Гардероб Минималиста — это система, где каждая вещь знает своё место, а образ собирается за две минуты.',
    palette:[
      {c:'#F2F0EC', l:'белый'},
      {c:'#B8B6B1', l:'серый'},
      {c:'#55534F', l:'графит'},
      {c:'#0A0A0A', l:'чёрный'}
    ],
    items:['Прямые брюки с высокой посадкой','Белая рубашка оверсайз','Чёрный джемпер тонкой вязки','Пальто-халат без деталей','Кожаная сумка чёткой формы','Лоферы или минималистичные кроссовки'],
    logic:'Одна палитра, один силуэт, ноль декора. Работайте с длиной и объёмом вместо деталей. Акцент — только один: обувь или сумка.'
  },
  art: {
    name:'Творец',
    desc:'Наблюдательный, ироничный, живой. Гардероб Творца — это материал для высказывания: слои, фактуры, сочетания, которые другим не придут в голову.',
    palette:[
      {c:'#2A2AFF', l:'электрик'},
      {c:'#D4FF3A', l:'лайм'},
      {c:'#7A2E2E', l:'глубокий красный'},
      {c:'#1B1B1B', l:'смоль'}
    ],
    items:['Жилет поверх футболки','Кожаная куртка oversize','Брюки с необычной посадкой','Плотный свитер ручной вязки','Шарф как отдельный элемент','Грубая обувь на толстой подошве'],
    logic:'Играйте на контрастах: объём против тонкого, матовое против глянца. Один цвет — всегда неожиданный. Не бойтесь собирать вещи, которые «не сочетаются» на первый взгляд.'
  },
  cls: {
    name:'Классик',
    desc:'Собранный, надёжный, ценит форму. Гардероб Классика — про уважение к контексту и к себе: строгие линии, благородные оттенки, вещи, которые работают годами.',
    palette:[
      {c:'#D9CFC0', l:'беж'},
      {c:'#8E8265', l:'олива'},
      {c:'#3F3A34', l:'тёмный'},
      {c:'#1A1715', l:'почти чёрный'}
    ],
    items:['Жакет прямого кроя','Брюки со стрелками','Шёлковая блуза','Пальто-честерфилд','Туфли на небольшом каблуке','Кожаный ремень тонкой формы'],
    logic:'Стройте образ по вертикали: одна линия от плеча до обуви. Цвет — спокойный, фактура — благородная. Детали минимальны, но безупречны.'
  }
};

const form = $('#quizForm');
const counter = $('#counter');
const prevBtn = $('#prevQ');

QUESTIONS.forEach((item, qi) => {
  const block = document.createElement('div');
  block.className = 'question';
  block.innerHTML = `
    <p class="q-title" tabindex="-1">${qi + 1}. ${item.q}</p>
    <div class="options" role="radiogroup" aria-label="Вопрос ${qi + 1}">
      ${item.a.map((opt, ai) => `
        <button type="button" class="option" data-q="${qi}" data-v="${opt.v}">
          <span class="k">${String.fromCharCode(65 + ai)}</span>
          <span>${opt.t}</span>
        </button>`).join('')}
    </div>`;
  form.appendChild(block);
});

const answers = {};
const questions = $$('.question', form);
let currentQ = 0;
let transitioning = false;

function showQuestion(i){
  questions.forEach(q => q.classList.remove('is-active'));
  currentQ = i;
  questions[i].classList.add('is-active');
  counter.textContent = `Вопрос ${currentQ + 1} / ${QUESTIONS.length}`;
  prevBtn.hidden = currentQ === 0;
  const title = $('.q-title', questions[i]);
  if (title) title.focus();
}

questions[0].classList.add('is-active');

form.addEventListener('click', (e) => {
  const btn = e.target.closest('.option');
  if (!btn || transitioning) return;
  const qi = Number(btn.dataset.q);

  $$(`.option[data-q="${qi}"]`, form).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  answers[qi] = btn.dataset.v;

  if (qi === QUESTIONS.length - 1){
    showResult();
    return;
  }

  transitioning = true;
  setTimeout(() => {
    showQuestion(qi + 1);
    transitioning = false;
  }, reduceMotion ? 0 : 300);
});

prevBtn.addEventListener('click', () => {
  if (currentQ > 0) showQuestion(currentQ - 1);
});

function showResult(){
  const score = { rom:0, min:0, art:0, cls:0 };
  Object.values(answers).forEach(v => score[v]++);
  const winner = Object.keys(score).sort((a,b) => score[b] - score[a])[0];

  const t = TYPES[winner];
  $('#resType').textContent = t.name;
  $('#resDesc').textContent = t.desc;
  $('#resLogic').textContent = t.logic;

  $('#resPalette').innerHTML = t.palette.map(p =>
    `<span class="swatch" style="background:${p.c}" data-label="${p.l}"></span>`
  ).join('');

  $('#resItems').innerHTML = t.items.map(i => `<li>${i}</li>`).join('');

  $('#quiz').style.display = 'none';
  $('#result').classList.add('show');
  $('#result').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block:'center' });
}

$('#restart').addEventListener('click', () => {
  Object.keys(answers).forEach(k => delete answers[k]);
  $$('.option', form).forEach(b => b.classList.remove('selected'));
  $('#result').classList.remove('show');
  $('#quiz').style.display = 'block';
  showQuestion(0);
  $('#quiz').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block:'center' });
});

/* ============================================================
   5. ФОРМА-ЗАГЛУШКА
   ============================================================ */
$('#contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = $('#contactBtn');
  const prev = btn.textContent;
  btn.textContent = 'Отправлено — демо';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = prev;
    btn.disabled = false;
    e.target.reset();
  }, 2400);
});

/* ============================================================
   6. КНОПКА «НАВЕРХ»
   ============================================================ */
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  toTop.classList.toggle('is-visible', y > 600);
}, { passive:true });

toTop.addEventListener('click', () => {
  window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
});