/* Menu */

const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  navigation.classList.remove('open');

  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menu');
}

menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');

  menu.setAttribute('aria-expanded', String(open));

  menu.setAttribute(
    'aria-label',
    open ? 'Fechar menu' : 'Abrir menu'
  );
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

/* Ano */

document.querySelector('#year').textContent =
  new Date().getFullYear();

/* WhatsApp */

const phone = '5521965958821';

const whatsappURL = message => {
  return (
    'https://wa.me/' +
    phone +
    '?text=' +
    encodeURIComponent(message)
  );
};

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const message =
    link.dataset.message ||
    'Olá, Mariana! Conheci seu site e gostaria de consultar uma data para atendimento.';

  link.href = whatsappURL(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

/* Inspiração personalizada */

const form = document.querySelector('#inspiration');

function getSelection() {
  const values = new FormData(form);

  return {
    occasion: values.get('occasion'),
    style: values.get('style')
  };
}

form.addEventListener('change', () => {
  const { occasion, style } = getSelection();

  document.querySelector('#selection').textContent =
    occasion + ' · ' + style;
});

form.addEventListener('submit', event => {
  event.preventDefault();

  const { occasion, style } = getSelection();

  const message =
    'Olá, Mariana! Conheci seu site e gostaria de consultar um atendimento. ' +
    'Minha ocasião: ' +
    occasion +
    '. Minha inspiração: ' +
    style +
    '. Podemos conversar sobre datas e valores?';

  window.open(
    whatsappURL(message),
    '_blank',
    'noopener,noreferrer'
  );
});

/* Galeria ampliada */

const dialog = document.querySelector('#lightbox');
const image = document.querySelector('#lightbox-image');
const caption = document.querySelector('#lightbox-caption');

const items = [
  ...document.querySelectorAll('.gallery-item')
];

const titles = [
  'Soft glam',
  'Beleza atemporal',
  'Olhar marcante',
  'Glow & harmonia',
  'Brilho em detalhes'
];

let current = 0;
let previousFocus = null;

function showPhoto(index) {
  current = (index + items.length) % items.length;

  const original = items[current].querySelector('img');

  image.src = original.getAttribute('src');
  image.alt = original.alt;

  caption.textContent =
    (current + 1) +
    ' / ' +
    items.length +
    ' — ' +
    titles[current];
}

items.forEach((item, index) => {
  item.addEventListener('click', () => {
    previousFocus = item;

    showPhoto(index);
    dialog.showModal();

    document.body.classList.add('locked');
  });
});

document.querySelector('.close').addEventListener('click', () => {
  dialog.close();
});

document.querySelector('.previous').addEventListener('click', () => {
  showPhoto(current - 1);
});

document.querySelector('.next').addEventListener('click', () => {
  showPhoto(current + 1);
});

dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    dialog.close();
  }
});

dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(current + 1);
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showPhoto(current - 1);
  }
});

dialog.addEventListener('close', () => {
  document.body.classList.remove('locked');
  previousFocus?.focus();
});

/* Deslize entre as fotos ampliadas */

let touchStart = null;

image.addEventListener(
  'touchstart',
  event => {
    touchStart = event.changedTouches[0].clientX;
  },
  { passive: true }
);

image.addEventListener(
  'touchend',
  event => {
    if (touchStart === null) {
      return;
    }

    const distance =
      event.changedTouches[0].clientX - touchStart;

    if (Math.abs(distance) > 50) {
      showPhoto(
        current + (distance < 0 ? 1 : -1)
      );
    }

    touchStart = null;
  },
  { passive: true }
);

/* Navegação da galeria mobile */

const gallery = document.querySelector('.gallery');

function moveGallery(direction) {
  const first = gallery.querySelector('.gallery-item');

  const distance =
    first.getBoundingClientRect().width + 16;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  gallery.scrollBy({
    left: direction * distance,
    behavior: reducedMotion ? 'auto' : 'smooth'
  });
}

document.querySelector('.gallery-prev').addEventListener(
  'click',
  () => {
    moveGallery(-1);
  }
);

document.querySelector('.gallery-next').addEventListener(
  'click',
  () => {
    moveGallery(1);
  }
);

gallery.addEventListener('keydown', event => {
  if (
    event.target !== gallery ||
    window.innerWidth > 760
  ) {
    return;
  }

  if (
    event.key === 'ArrowRight' ||
    event.key === 'ArrowLeft'
  ) {
    event.preventDefault();

    moveGallery(
      event.key === 'ArrowRight' ? 1 : -1
    );
  }
});