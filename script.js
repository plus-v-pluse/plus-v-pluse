(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#heroNav');
  const siteHeader = document.querySelector('#siteHeader');

  const syncHeaderState = () => {
    siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (navigation?.classList.contains('is-open') && !navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  const navLinks = [...(navigation?.querySelectorAll('a[href^="#"]') || [])];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-30% 0px -55%', threshold: [0, .15, .4] });

    navSections.forEach((section) => sectionObserver.observe(section));
  }

  const player = document.querySelector("[data-player]");
  const video = document.querySelector('#workVideo');
  const largePlay = document.querySelector('.video-play');
  const controlPlay = document.querySelector('.control-play');
  const playPath = document.querySelector('.play-path');
  const muteButton = document.querySelector('.control-mute');
  const soundWaves = document.querySelector('.sound-waves');
  const progress = document.querySelector('#videoProgress');
  const currentTime = document.querySelector('#currentTime');
  const duration = document.querySelector('#duration');
  const description = document.querySelector('#videoDescription');
  const choices = [...document.querySelectorAll('.video-choice')];

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const syncPlayState = () => {
    if (!video || !player || !playPath) return;
    const playing = !video.paused && !video.ended;
    player.classList.toggle('is-playing', playing);
    playPath.setAttribute('d', playing ? 'M7 5h4v14H7Zm7 0h4v14h-4Z' : 'm8 5 11 7-11 7Z');
    controlPlay?.setAttribute('aria-label', playing ? 'Поставить на паузу' : 'Воспроизвести');
    largePlay?.setAttribute('aria-label', playing ? 'Поставить на паузу' : 'Воспроизвести видео');
  };

  const togglePlayback = () => {
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  largePlay?.addEventListener('click', togglePlayback);
  controlPlay?.addEventListener('click', togglePlayback);
  video?.addEventListener('click', togglePlayback);
  video?.addEventListener('play', syncPlayState);
  video?.addEventListener('pause', syncPlayState);
  video?.addEventListener('ended', syncPlayState);
  video?.addEventListener('loadedmetadata', () => {
    if (duration) duration.textContent = formatTime(video.duration);
  });
  video?.addEventListener('timeupdate', () => {
    if (currentTime) currentTime.textContent = formatTime(video.currentTime);
    if (progress && video.duration) progress.value = String((video.currentTime / video.duration) * 100);
  });

  progress?.addEventListener('input', () => {
    if (video?.duration) video.currentTime = (Number(progress.value) / 100) * video.duration;
  });

  muteButton?.addEventListener('click', () => {
    if (!video) return;
    video.muted = !video.muted;
    muteButton.setAttribute('aria-label', video.muted ? 'Включить звук' : 'Выключить звук');
    if (soundWaves) soundWaves.style.display = video.muted ? 'none' : '';
  });

  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      if (!video || choice.classList.contains('is-active')) return;
      choices.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });
      choice.classList.add('is-active');
      choice.setAttribute('aria-pressed', 'true');
      video.pause();
      video.poster = choice.dataset.poster;
      const supportsWebM = video.canPlayType('video/webm; codecs="vp9, opus"') !== '';
      video.src = supportsWebM ? choice.dataset.webm : choice.dataset.src;
      video.load();
      if (description) description.textContent = choice.dataset.description;
      video.play().catch(() => {});
    });
  });

  const form = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.classList.remove('is-error');
    if (!form.checkValidity()) {
      formStatus.textContent = 'Заполните имя, телефон и описание задачи.';
      formStatus.classList.add('is-error');
      form.reportValidity();
      return;
    }
    const name = document.querySelector('#userName').value.trim();
    const phone = document.querySelector('#userPhone').value.trim();
    const message = document.querySelector('#userMessage').value.trim();
    const manager = document.querySelector('#managerSelect').value;
    const text = `Новая заявка с сайта\n\nИмя: ${name}\nТелефон: ${phone}\nЗадача: ${message}`;
    formStatus.textContent = 'Сообщение подготовлено — открываем WhatsApp.';
    window.open(`https://wa.me/${manager}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: no-preference)', () => {

      gsap.to('.hero-media', {
        yPercent: -3,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-dossier', start: 'top top', end: 'bottom top', scrub: .6 }
      });

      document.querySelectorAll('.reveal-copy').forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: .9,
          ease: 'expo.out',
          scrollTrigger: { trigger: element, start: 'top 82%', once: true }
        });
      });

      document.querySelectorAll('.reveal-media').forEach((element) => {
        gsap.from(element, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: element, start: 'top 82%', once: true }
        });
      });

      document.querySelectorAll('.reveal-row:not(.equipment-row)').forEach((element, index) => {
        gsap.from(element, {
          xPercent: index % 2 ? 5 : -5,
          opacity: 0,
          duration: .85,
          ease: 'expo.out',
          scrollTrigger: { trigger: element, start: 'top 84%', once: true }
        });
      });

      const equipmentRows = gsap.utils.toArray('.equipment-row');
      if (equipmentRows.length) {
        gsap.from(equipmentRows, {
          y: 30,
          scale: .985,
          opacity: 0,
          duration: .7,
          stagger: .09,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.equipment-list',
            start: 'top 82%',
            once: true
          }
        });
      }

      document.querySelectorAll('.stat-number').forEach((element) => {
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.8,
          ease: 'power3.out',
          snap: { value: 1 },
          scrollTrigger: { trigger: element, start: 'top 84%', once: true },
          onStart: () => { element.textContent = `0${suffix}`; },
          onUpdate: () => { element.textContent = `${Math.round(state.value)}${suffix}`; },
          onComplete: () => { element.textContent = `${target}${suffix}`; }
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
})();
