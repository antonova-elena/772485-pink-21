  const navElement = document.querySelector('.nav');
  const navToggleElement = navElement.querySelector('.nav__toggle');

  navElement.classList.remove('nav--nojs');
  navElement.classList.add('nav--closed')

  navToggleElement.addEventListener('click', () => {
    if (navElement.classList.contains('nav--opened')) {
      navElement.classList.remove('nav--opened');
      navElement.classList.add('nav--closed');
    } else {
      navElement.classList.add('nav--opened');
      navElement.classList.remove('nav--closed');
    }
  });
