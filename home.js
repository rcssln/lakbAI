const interestButtons = document.querySelectorAll('.interest-btn');
const durationButtons = document.querySelectorAll('.duration-btn');
const styleButtons = document.querySelectorAll('.style-btn');
const navbar = document.querySelector(".navbar");
const inLogo = document.querySelector(".IN-logo");

window.addEventListener("scroll", () => {
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

durationButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});

styleButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});

// budget slider
const budgetRange = document.getElementById('budget-range');
const budgetValue = document.getElementById('budget-value');

budgetRange.addEventListener('input', (e) => {
    const value = e.target.value;
    budgetValue.textContent = value;
    
    const percentage = (value / budgetRange.max) * 100;
    budgetRange.style.background = `linear-gradient(to right, #5e4ba1 0%, #5e4ba1 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
});

document.querySelector('.plan-trip-btn').addEventListener('click', () => {
    // get selected interests using data-interest attribute
    const selectedInterests = Array.from(document.querySelectorAll('.interest-btn.active'))
        .map(btn => btn.getAttribute('data-interest'));

    const selectedDuration = Array.from(document.querySelectorAll('.duration-btn.active'))
        .map(btn => btn.getAttribute('data-interest'));
    
    const selectedStyle = Array.from(document.querySelectorAll('.style-btn.active'))
        .map(btn => btn.getAttribute('data-interest'));

    const budget = Number(budgetValue.textContent);

    console.log("Saving interests:", selectedInterests);
    console.log("Saving budget:", budget);
    console.log("Saving duration:", selectedDuration);
    console.log("Saving style:", selectedStyle);

    // SAVE TO LOCAL STORAGE
    localStorage.setItem("selectedInterests", JSON.stringify(selectedInterests));
    localStorage.setItem("selectedBudget", budget);
    localStorage.setItem("selectedDuration", JSON.stringify(selectedDuration));
    localStorage.setItem("selectedStyle", JSON.stringify(selectedStyle));

    window.location.href = "trips.html";
});

renderCalendar();
