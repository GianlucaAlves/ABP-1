  document.querySelectorAll('.box a').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // impede o redirecionamento imediato

      const current = document.querySelector('.box.selected');
      const targetBox = this.closest('.box');
      const href = this.getAttribute('href');

      if (current) current.classList.remove('selected');
      targetBox.classList.add('selected');

      // Espera a animação terminar antes de trocar de página
      setTimeout(() => {
        window.location.href = href;
      }, 300); // mesmo tempo da transição CSS
    });
  });

