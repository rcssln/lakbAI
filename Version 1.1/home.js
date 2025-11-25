(function(){
  // Interest buttons
  const interestButtons = document.querySelectorAll('.interest-btn');
  const navbar = document.querySelector(".navbar");
  const inLogo = document.querySelector(".IN-logo");

  window.addEventListener("scroll", () => {
      if (!navbar || !inLogo) return;
      if (window.scrollY > navbar.offsetHeight + 10) {
          inLogo.classList.add("hide");
      } else {
          inLogo.classList.remove("hide");
      }
  });

  interestButtons.forEach(button => {
      button.addEventListener('click', () => {
          button.classList.toggle('active');
      });
  });

  // budget slider
  const budgetRange = document.getElementById('budget-range');
  const budgetValue = document.getElementById('budget-value');

  if (budgetRange && budgetValue) {
    budgetRange.addEventListener('input', (e) => {
        const value = e.target.value;
        budgetValue.textContent = value;

        const percentage = (value / budgetRange.max) * 100;
        budgetRange.style.background = `linear-gradient(to right, #5e4ba1 0%, #5e4ba1 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
    });
  }

  // Plan Trip button - saves interests & budget and redirects
  const planBtn = document.querySelector('.plan-trip-btn');
  if (planBtn) {
    planBtn.addEventListener('click', () => {
      const selectedInterests = Array.from(document.querySelectorAll('.interest-btn.active'))
          .map(btn => btn.getAttribute('data-interest'));

      const budget = Number(budgetValue ? budgetValue.textContent : 0);

      if (selectedInterests.length === 0) {
        alert('Please select at least one interest before planning your trip.');
        return;
      }

      localStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
      localStorage.setItem('selectedBudget', String(budget));

      // We removed the calendar — no dates saved

      // Redirect to trips page
      window.location.href = 'trips.html';
    });
  }

})();