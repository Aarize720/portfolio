document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

    // Toggle active
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Show/Hide projects
    document.querySelectorAll('.project').forEach(project => {
      if (filter === 'all' || project.classList.contains(filter)) {
        project.style.display = 'block';
      } else {
        project.style.display = 'none';
      }
    });
  });
});
