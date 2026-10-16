export const initNavigation = () => {
  const nav = document.querySelector('.site__navigation');
  const navToggle = document.querySelector('.js-menu-toggle');

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
}