/**
 * ============================================================================
 * CONVITE CHÁ REVELAÇÃO - ALEXANDRE & NYARA
 * JORGE Thales OU KIARA MARIA
 * JavaScript Puro (Vanilla JS) - Sem dependências externas
 * ============================================================================
 */

/* ============================================================================
 * 1. OBJETO DE CONFIGURAÇÃO (EDITÁVEL EXCLUSIVAMENTE PELOS PAIS)
 * Todas as informações do evento e da música são definidas aqui.
 * ============================================================================ */
const CONFIG = {
  // Nomes dos pais
  parents: 'Alexandre & Nyara',

  // Nomes escolhidos para os bebês
  boyName: 'Jorge Thales',
  girlName: 'Kiara Maria',

  // Data e hora do evento (Formato ISO: AAAA-MM-DDTHH:MM:SS)
  // 15 de Novembro de 2026 às 12:00
  eventDate: '2026-11-15T12:00:00',

  // Textos exibidos na interface
  eventDateDisplay: '15 de Novembro de 2026',
  eventTimeDisplay: 'A partir das 12:00',
  heroDateDisplay: '15 de Novembro de 2026 • 12:00',

  // Localização exata do evento (Google Maps)
  venueName: 'Vila Santo Antônio, Km 1',
  venueAddress: 'Ao lado do Restaurante Píer',
  venueCoordinates: '1°37\'49.3"S 47°29\'05.3"W',
  mapsUrl: 'https://www.google.com/maps?q=-1.630367,-47.484791&z=18&hl=pt-BR',

  // Número de WhatsApp para confirmação e palpites (formato internacional com DDI 55)
  // Exemplo: 55 + DDD + Telefone -> 5591984829252
  whatsappNumber: '5591984829252',

  // Mensagem padrão ao confirmar presença (RSVP)
  rsvpMessage: 'Oi Alexandre e Nyara! Gostaria de confirmar minha presença no Chá Revelação! Mal posso esperar para descobrir se vem aí o Jorge Thales ou a Kiara Maria! 🤍👶',

  // MÚSICA DEFINIDA PELOS PAIS
  // Os convidados NÃO possuem opção nem controle de alterar este caminho.
  musicPath: 'assets/Here Comes The Sun (Remastered 2009) - The Beatles.mp3',

  // Volume inicial suave (0.0 a 1.0)
  musicInitialVolume: 0.4,

  // Configuração da Enquete em Tempo Real na Nuvem (Votos 100% Reais e Limpos)
  pollCloud: {
    enabled: true,
    baseUrl: 'https://countapi.mileshilliard.com/api/v1',
    boyKey: 'cha_oficial_2026_jorge_Thales_alexandre_nyara_clean',
    girlKey: 'cha_oficial_2026_kiara_maria_alexandre_nyara_clean'
  }
};

/* ============================================================================
 * 2. ESTADO GLOBAL DA APLICAÇÃO
 * ============================================================================ */
const STATE = {
  musicStarted: false,
  musicPausedByUser: false,
  isEnvelopeOpen: false
};

/* ============================================================================
 * 3. INICIALIZAÇÃO DO DOM E CONFIGURAÇÃO DINÂMICA
 * ============================================================================ */
function initAll() {
  applyConfigToDOM();
  initEnvelope();
  initAudio();
  initCountdown();
  initIntersectionObserver();
  initPollForm();
  initCalendarButton();
  initMapButton();
  initRsvpForm();
  initConfettiCanvas();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/**
 * Preenche textos e links no HTML baseando-se no objeto CONFIG
 */
function applyConfigToDOM() {
  const safeSetText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  safeSetText('display-hero-date', CONFIG.heroDateDisplay);
  safeSetText('display-event-datetime', CONFIG.eventDateDisplay);
  safeSetText('display-event-time', CONFIG.eventTimeDisplay);
  safeSetText('display-venue-name', CONFIG.venueName);
  safeSetText('display-venue-address', CONFIG.venueAddress);
  safeSetText('display-boy-name', CONFIG.boyName);
  safeSetText('display-girl-name', CONFIG.girlName);
}

/* ============================================================================
 * 4. TELA DE ABERTURA: ENVELOPE INTERATIVO
 * ============================================================================ */
function initEnvelope() {
  const overlay = document.getElementById('envelope-overlay');
  const card = document.getElementById('envelope-card');

  const handleOpen = () => {
    if (STATE.isEnvelopeOpen) return;
    STATE.isEnvelopeOpen = true;

    // Adiciona classe de animação de abertura
    if (overlay) {
      overlay.classList.add('opening');
    }

    // Inicia a música com interação do usuário (com proteção contra qualquer falha)
    try {
      startMusicWithFadeIn();
    } catch (err) {
      console.log('Música não pôde iniciar automaticamente:', err);
    }

    // Pequena chuva de confete comemorativo de boas-vindas
    try {
      setTimeout(() => {
        triggerConfetti(50);
      }, 350);
    } catch (e) {}

    // Fade out e remoção garantida do overlay para liberar a tela
    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('opened');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 500);
      }
      document.body.focus();
    }, 750);
  };

  // Torna acessível globalmente
  window.abrirConviteManual = handleOpen;

  if (overlay) {
    overlay.addEventListener('click', handleOpen);
    overlay.addEventListener('touchend', (e) => {
      // Garante abertura instantânea no toque no celular
      handleOpen();
    }, { passive: true });
  }

  if (card) {
    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  }
}

/* ============================================================================
 * 5. MÚSICA DE FUNDO (EXCLUSIVA DOS PAIS - APENAS PLAY/PAUSE/MUDO PARA O CONVIDADO)
 * ============================================================================ */
let audioElement = null;
let musicToggleBtn = null;

function initAudio() {
  audioElement = document.getElementById('bg-music');
  musicToggleBtn = document.getElementById('music-toggle');

  if (!audioElement || !musicToggleBtn) return;

  // Define a fonte exclusiva da música do CONFIG
  audioElement.src = encodeURI(CONFIG.musicPath);
  audioElement.volume = 0;

  // Se o arquivo não existir ou falhar o carregamento, oculta o botão sem dar erro visível
  audioElement.addEventListener('error', () => {
    console.warn('Música local não encontrada no caminho:', CONFIG.musicPath);
    musicToggleBtn.style.display = 'none';
  });

  // Se o áudio estiver carregado e pronto, exibe o botão
  const showBtnIfReady = () => {
    musicToggleBtn.style.display = 'flex';
  };
  audioElement.addEventListener('canplay', showBtnIfReady);
  audioElement.addEventListener('loadeddata', showBtnIfReady);
  if (audioElement.readyState >= 2) {
    showBtnIfReady();
  }

  // Alternar Play / Pause pelo botão flutuante
  musicToggleBtn.addEventListener('click', () => {
    if (audioElement.paused) {
      resumeMusic();
    } else {
      pauseMusic();
    }
  });
}

/**
 * Inicia a reprodução com transição suave de volume
 */
function startMusicWithFadeIn() {
  if (!audioElement) return;

  audioElement.play().then(() => {
    STATE.musicStarted = true;
    STATE.musicPausedByUser = false;
    updateMusicUI(true);

    // Fade-in de volume até CONFIG.musicInitialVolume
    let currentVol = 0;
    const targetVol = CONFIG.musicInitialVolume || 0.4;
    const step = 0.04;
    const interval = setInterval(() => {
      currentVol = Math.min(targetVol, currentVol + step);
      audioElement.volume = currentVol;
      if (currentVol >= targetVol) clearInterval(interval);
    }, 80);

  }).catch((err) => {
    console.log('Autoplay com áudio bloqueado ou arquivo não pronto:', err);
    updateMusicUI(false);
  });
}

function pauseMusic() {
  if (!audioElement) return;
  audioElement.pause();
  STATE.musicPausedByUser = true;
  updateMusicUI(false);
}

function resumeMusic() {
  if (!audioElement) return;
  audioElement.play().then(() => {
    STATE.musicPausedByUser = false;
    updateMusicUI(true);
  }).catch(() => {
    updateMusicUI(false);
  });
}

function updateMusicUI(isPlaying) {
  if (!musicToggleBtn) return;
  if (isPlaying) {
    musicToggleBtn.classList.remove('paused');
    musicToggleBtn.classList.add('playing');
    musicToggleBtn.setAttribute('aria-label', 'Pausar música');
    musicToggleBtn.title = 'Pausar música';
  } else {
    musicToggleBtn.classList.remove('playing');
    musicToggleBtn.classList.add('paused');
    musicToggleBtn.setAttribute('aria-label', 'Retomar música');
    musicToggleBtn.title = 'Retomar música';
  }
}

/* ============================================================================
 * 6. CONTAGEM REGRESSIVA EM TEMPO REAL
 * ============================================================================ */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const statusEl = document.getElementById('countdown-status-text');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date(CONFIG.eventDate).getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (statusEl) {
        statusEl.textContent = 'O grande momento da revelação chegou! 🤍✨';
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================================
 * 7. ANIMAÇÕES AO ROLAR (INTERSECTION OBSERVER)
 * ============================================================================ */
function initIntersectionObserver() {
  const elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================================
 * 8. ENQUETE COM VOTAÇÃO DIRETA (1 TOQUE) E BANCO EM NUVEM EM TEMPO REAL
 * ============================================================================ */
function initPollForm() {
  const btnBoy = document.getElementById('btn-vote-boy');
  const btnGirl = document.getElementById('btn-vote-girl');
  const tagBoy = document.getElementById('tag-vote-boy');
  const tagGirl = document.getElementById('tag-vote-girl');
  const feedbackBox = document.getElementById('poll-feedback');

  if (!btnBoy || !btnGirl) return;

  const STORAGE_KEY_CHOICE = 'cha_revelacao_voted_choice';

  // Contadores reais (iniciam em zero)
  let cloudBoyVotes = 0;
  let cloudGirlVotes = 0;

  function updatePollDisplay() {
    const totalVotes = cloudBoyVotes + cloudGirlVotes;

    const boyPctEl = document.getElementById('boy-percent');
    const girlPctEl = document.getElementById('girl-percent');
    const boyCountEl = document.getElementById('boy-votes-count');
    const girlCountEl = document.getElementById('girl-votes-count');
    const totalVotesEl = document.getElementById('poll-total-votes');
    const boyBarFill = document.getElementById('boy-bar-fill');
    const girlBarFill = document.getElementById('girl-bar-fill');

    if (totalVotes === 0) {
      if (boyPctEl) boyPctEl.textContent = '0%';
      if (girlPctEl) girlPctEl.textContent = '0%';
      if (boyCountEl) boyCountEl.textContent = '(0 votos)';
      if (girlCountEl) girlCountEl.textContent = '(0 votos)';
      if (totalVotesEl) totalVotesEl.textContent = 'Nenhum palpite ainda • Seja o primeiro a votar!';
      if (boyBarFill) boyBarFill.style.width = '50%';
      if (girlBarFill) girlBarFill.style.width = '50%';
      return;
    }

    const boyPct = Math.round((cloudBoyVotes / totalVotes) * 100);
    const girlPct = 100 - boyPct;

    if (boyPctEl) boyPctEl.textContent = `${boyPct}%`;
    if (girlPctEl) girlPctEl.textContent = `${girlPct}%`;
    if (boyCountEl) boyCountEl.textContent = `(${cloudBoyVotes} ${cloudBoyVotes === 1 ? 'voto' : 'votos'})`;
    if (girlCountEl) girlCountEl.textContent = `(${cloudGirlVotes} ${cloudGirlVotes === 1 ? 'voto' : 'votos'})`;
    if (totalVotesEl) totalVotesEl.textContent = `Total: ${totalVotes} ${totalVotes === 1 ? 'palpite' : 'palpites'}`;

    if (boyBarFill) boyBarFill.style.width = `${boyPct}%`;
    if (girlBarFill) girlBarFill.style.width = `${girlPct}%`;
  }

  const STORAGE_KEY_ALREADY_VOTED = 'cha_revelacao_voted_permanently_v2';

  function lockVotingButtons(votedChoice) {
    btnBoy.disabled = true;
    btnGirl.disabled = true;
    btnBoy.classList.add('locked');
    btnGirl.classList.add('locked');

    if (votedChoice === 'boy') {
      btnBoy.classList.add('selected');
      btnGirl.classList.remove('selected');
      btnGirl.classList.add('not-selected');
      if (tagBoy) tagBoy.textContent = '✓ Seu voto registrado';
      if (tagGirl) tagGirl.textContent = 'Opção não escolhida';
    } else if (votedChoice === 'girl') {
      btnGirl.classList.add('selected');
      btnBoy.classList.remove('selected');
      btnBoy.classList.add('not-selected');
      if (tagGirl) tagGirl.textContent = '✓ Seu voto registrado';
      if (tagBoy) tagBoy.textContent = 'Opção não escolhida';
    }

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      const feedbackText = feedbackBox.querySelector('.poll-feedback-text');
      if (feedbackText) {
        feedbackText.textContent = '✨ Seu voto já foi registrado! Cada pessoa pode votar apenas uma vez.';
      }
    }
  }

  // Busca os números reais no banco de dados em nuvem
  async function syncVotesFromCloud() {
    if (!CONFIG.pollCloud || !CONFIG.pollCloud.enabled) {
      updatePollDisplay();
      return;
    }

    const { baseUrl, boyKey, girlKey } = CONFIG.pollCloud;

    try {
      const [resBoy, resGirl] = await Promise.all([
        fetch(`${baseUrl}/get/${boyKey}`).then(r => r.ok ? r.json() : { value: 0 }).catch(() => ({ value: 0 })),
        fetch(`${baseUrl}/get/${girlKey}`).then(r => r.ok ? r.json() : { value: 0 }).catch(() => ({ value: 0 }))
      ]);

      cloudBoyVotes = typeof resBoy.value === 'number' ? resBoy.value : 0;
      cloudGirlVotes = typeof resGirl.value === 'number' ? resGirl.value : 0;
      updatePollDisplay();
    } catch (e) {
      console.log('Modo offline/fallback na busca de votos:', e);
      updatePollDisplay();
    }
  }

  // Disparo de voto único ao clicar no botão
  async function handleVote(choice) {
    const alreadyVoted = localStorage.getItem(STORAGE_KEY_ALREADY_VOTED) === 'true';
    if (alreadyVoted) {
      // Bloqueio rigoroso: já votou, não faz absolutamente nada
      return;
    }

    // Grava imediatamente o bloqueio permanente para este navegador
    localStorage.setItem(STORAGE_KEY_ALREADY_VOTED, 'true');
    localStorage.setItem(STORAGE_KEY_CHOICE, choice);

    // Trava os botões na hora
    lockVotingButtons(choice);
    triggerConfetti(70);

    // Incrementa na interface local instantaneamente
    if (choice === 'boy') {
      cloudBoyVotes++;
    } else {
      cloudGirlVotes++;
    }
    updatePollDisplay();

    // Envia o voto em tempo real para a nuvem
    if (CONFIG.pollCloud && CONFIG.pollCloud.enabled) {
      const { baseUrl, boyKey, girlKey } = CONFIG.pollCloud;
      const keyToHit = choice === 'boy' ? boyKey : girlKey;

      try {
        const res = await fetch(`${baseUrl}/hit/${keyToHit}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.value === 'number') {
            if (choice === 'boy') cloudBoyVotes = data.value;
            if (choice === 'girl') cloudGirlVotes = data.value;
            updatePollDisplay();
          }
        }
      } catch (err) {
        console.log('Voto registrado localmente:', err);
      }
    }
  }

  // Verifica se este dispositivo já votou anteriormente
  const previouslyVoted = localStorage.getItem(STORAGE_KEY_ALREADY_VOTED) === 'true';
  const savedChoice = localStorage.getItem(STORAGE_KEY_CHOICE);
  if (previouslyVoted && savedChoice) {
    lockVotingButtons(savedChoice);
  }

  // Eventos de clique nos botões
  btnBoy.addEventListener('click', () => handleVote('boy'));
  btnGirl.addEventListener('click', () => handleVote('girl'));

  // Carrega os dados reais do banco em nuvem
  syncVotesFromCloud();
}

/* ============================================================================
 * 9. BOTÕES DE DETALHES (GOOGLE MAPS & CALENDÁRIO .ICS)
 * ============================================================================ */
function initMapButton() {
  const mapBtn = document.getElementById('btn-map');
  if (!mapBtn) return;

  mapBtn.href = CONFIG.mapsUrl;
}

function initCalendarButton() {
  const calBtn = document.getElementById('btn-calendar');
  if (!calBtn) return;

  calBtn.addEventListener('click', () => {
    generateAndDownloadICS();
  });
}

/**
 * Cria dinamicamente um arquivo iCalendar (.ics) para adicionar aos calendários
 */
function generateAndDownloadICS() {
  const startDate = new Date(CONFIG.eventDate);
  // Duração estimada: 5 horas
  const endDate = new Date(startDate.getTime() + (5 * 60 * 60 * 1000));

  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cha Revelacao//Alexandre e Nyara//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:revelacao-${Date.now()}@charevelacao.local`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:Chá Revelação • ${CONFIG.boyName} ou ${CONFIG.girlName}`,
    `DESCRIPTION:Venha descobrir conosco se é ${CONFIG.boyName} ou ${CONFIG.girlName}! Alexandre & Nyara esperam por você! 🤍`,
    `LOCATION:${CONFIG.venueName} - ${CONFIG.venueAddress} (${CONFIG.mapsUrl})`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'cha-revelacao-alexandre-nyara.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}

/* ============================================================================
 * 10. CONFIRMAÇÃO DE PRESENÇA (RSVP) COM QUANTIDADE DE PESSOAS
 * ============================================================================ */
function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const nameInput = document.getElementById('rsvp-guest-name');
  const companionsInput = document.getElementById('rsvp-companions-names');
  const companionsGroup = document.getElementById('group-companions');
  const btnMinus = document.getElementById('btn-counter-minus');
  const btnPlus = document.getElementById('btn-counter-plus');
  const countDisplay = document.getElementById('people-count-number');
  const summaryHint = document.getElementById('people-summary-hint');

  if (!form || !nameInput || !countDisplay) return;

  let peopleCount = 1;

  function updateCounterUI() {
    countDisplay.textContent = peopleCount;

    if (peopleCount === 1) {
      if (summaryHint) summaryHint.textContent = 'Somente você';
      if (companionsGroup) companionsGroup.style.display = 'none';
    } else {
      const companionsCount = peopleCount - 1;
      if (summaryHint) {
        summaryHint.textContent = `Você + ${companionsCount} ${companionsCount === 1 ? 'acompanhante' : 'acompanhantes'} (${peopleCount} pessoas no total)`;
      }
      if (companionsGroup) companionsGroup.style.display = 'block';
    }
  }

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (peopleCount > 1) {
        peopleCount--;
        updateCounterUI();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      if (peopleCount < 15) {
        peopleCount++;
        updateCounterUI();
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const guestName = nameInput.value.trim();
    if (!guestName) {
      nameInput.focus();
      return;
    }

    const companions = companionsInput ? companionsInput.value.trim() : '';

    // Dispara confetes comemorativos
    triggerConfetti(70);

    // Formata mensagem ultra clara, organizada e bonita para os organizadores
    const userVoteChoice = localStorage.getItem('cha_revelacao_voted_choice');
    let guessDetail = '';
    if (userVoteChoice === 'boy') {
      guessDetail = `\n🔮 *Meu Palpite:* 👦 ${CONFIG.boyName} (Menino)`;
    } else if (userVoteChoice === 'girl') {
      guessDetail = `\n🔮 *Meu Palpite:* 👧 ${CONFIG.girlName} (Menina)`;
    }

    const companionsText = (peopleCount > 1 && companions) 
      ? `\n📝 *Acompanhantes:* ${companions}` 
      : (peopleCount > 1 ? '\n📝 *Acompanhantes:* Família / Convidados' : '');

    const message = [
      `✨ *CONFIRMAÇÃO DE PRESENÇA* ✨`,
      `👶 *Chá Revelação • ${CONFIG.boyName} ou ${CONFIG.girlName}*`,
      ``,
      `👤 *Convidado(a):* ${guestName}`,
      `👥 *Total Confirmado:* ${peopleCount} ${peopleCount === 1 ? 'pessoa' : 'pessoas'}${companionsText}${guessDetail}`,
      ``,
      `Oi ${CONFIG.parents}! Confirmo com muita alegria que estarei com vocês para descobrir esse segredo tão especial! 🤍 Mal podemos esperar!`
    ].join('\n');

    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Abre o WhatsApp após breve intervalo para exibir os confetes
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 450);
  });
}

/* ============================================================================
 * 11. SISTEMA DE CONFETES DELICADOS (CANVAS PURO)
 * Cores perfeitamente equilibradas: Dourado, Branco, Azul suave e Rosa suave
 * ============================================================================ */
let confettiParticles = [];
let confettiAnimationId = null;

function initConfettiCanvas() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);
}

function triggerConfetti(count = 50) {
  // Respeita acessibilidade de movimento reduzido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Paleta refinada: branco perolado, dourado fino, azul bebê sutil e rosa bebê sutil
  const colors = [
    '#FFFFFF',
    '#C9B28A', // Dourado
    '#CBD8E2', // Azul suave
    '#E8CFCB', // Rosa suave
    '#FAF5E8'  // Marfim
  ];

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.4;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 8;
    confettiParticles.push({
      x: originX + (Math.random() - 0.5) * 120,
      y: originY + (Math.random() - 0.5) * 60,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      alpha: 1,
      gravity: 0.16,
      decay: 0.008 + Math.random() * 0.008,
      shape: Math.random() > 0.4 ? 'circle' : 'rect'
    });
  }

  if (!confettiAnimationId) {
    animateConfetti(ctx, canvas);
  }
}

function animateConfetti(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0 || p.y > canvas.height + 20) {
      confettiParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
    }

    ctx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(() => animateConfetti(ctx, canvas));
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiAnimationId = null;
  }
}
