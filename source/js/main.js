  const navElement = document.querySelector('.nav');
  const navToggleElement = navElement.querySelector('.nav__toggle');

  navElement.classList.remove('nav--nojs');

  navToggleElement.addEventListener('click', function() {
    if (navElement.classList.contains('nav--closed')) {
      navElement.classList.remove('nav--closed');
      navElement.classList.add('nav--opened');
    } else {
      navElement.classList.add('nav--closed');
      navElement.classList.remove('nav--opened');
    }
  });
