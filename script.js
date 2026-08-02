const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const workDialog = document.querySelector('#work-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#dialog-title');

document.querySelectorAll('[data-full]').forEach((button) => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.full;
    dialogImage.alt = button.dataset.title;
    dialogTitle.textContent = button.dataset.title;
    workDialog.showModal();
  });
});

document.querySelectorAll('[data-brochure-viewer]').forEach((viewer) => {
  const pages = [...viewer.querySelectorAll('.brochure-page-data [data-src]')];
  const display = viewer.querySelector('.brochure-display');
  const image = display.querySelector('img');
  const current = viewer.querySelector('[data-page-current]');
  const total = viewer.querySelector('[data-page-total]');
  let pageIndex = 0;

  total.textContent = pages.length;

  const showPage = (nextIndex) => {
    pageIndex = (nextIndex + pages.length) % pages.length;
    const page = pages[pageIndex].dataset;
    image.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = page.src;
      image.alt = page.alt;
      display.dataset.full = page.src;
      display.dataset.title = page.title;
      current.textContent = pageIndex + 1;
      image.classList.remove('is-changing');
    }, 120);
  };

  viewer.querySelectorAll('[data-page-direction]').forEach((control) => {
    control.addEventListener('click', () => showPage(pageIndex + (control.dataset.pageDirection === 'next' ? 1 : -1)));
  });
});

document.querySelector('#dialog-close')?.addEventListener('click', () => workDialog.close());
workDialog?.addEventListener('click', (event) => {
  if (event.target === workDialog) workDialog.close();
});

document.querySelectorAll('.interactive-surface').forEach((surface) => {
  surface.addEventListener('pointermove', (event) => {
    const rect = surface.getBoundingClientRect();
    surface.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    surface.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll('.principles-grid article, .ecosystem-grid article').forEach((card) => {
  card.tabIndex = 0;
});

const sectionLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-28% 0px -62% 0px' });

sectionLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) sectionObserver.observe(section);
});

const campaignTabs = [...document.querySelectorAll('[data-campaign-tab]')];
const campaignPanels = [...document.querySelectorAll('[data-campaign-panel]')];

const selectCampaign = (campaign) => {
  campaignTabs.forEach((tab) => {
    const selected = tab.dataset.campaignTab === campaign;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  campaignPanels.forEach((panel) => {
    panel.hidden = panel.dataset.campaignPanel !== campaign;
  });
};

campaignTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCampaign(tab.dataset.campaignTab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % campaignTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + campaignTabs.length) % campaignTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = campaignTabs.length - 1;
    campaignTabs[nextIndex].focus();
    selectCampaign(campaignTabs[nextIndex].dataset.campaignTab);
  });
});
