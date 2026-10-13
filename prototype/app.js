const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded','false');
  navigation.classList.remove('open');
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active',selected);
    item.setAttribute('aria-pressed',String(selected));
  });
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
}));
const enrollment = document.querySelector('#enrollment');
document.querySelectorAll('[data-enroll]').forEach(button => button.addEventListener('click', () => {
  enrollment.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('.close-dialog').addEventListener('click',() => enrollment.close());
enrollment.addEventListener('click',event => {
  const bounds = enrollment.getBoundingClientRect();
  if(event.target === enrollment && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) enrollment.close();
});
enrollment.addEventListener('close',() => document.body.classList.remove('modal-open'));
document.querySelector('#year').textContent = new Date().getFullYear();
