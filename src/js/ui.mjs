export function loadHeaderFooter() {
  const header = document.querySelector('#header');
  const footer = document.querySelector('#footer');

  fetch('/partials/header.html')
    .then(res => res.text())
    .then(html => { header.innerHTML = html; });

  fetch('/partials/footer.html')
    .then(res => res.text())
    .then(html => { footer.innerHTML = html; });
}
