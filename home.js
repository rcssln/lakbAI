const interestButtons = document.querySelectorAll('.interest-btn');
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

// budget slider
const budgetRange = document.getElementById('budget-range');
const budgetValue = document.getElementById('budget-value');

budgetRange.addEventListener('input', (e) => {
    const value = e.target.value;
    budgetValue.textContent = value;
    
    const percentage = (value / budgetRange.max) * 100;
    budgetRange.style.background = `linear-gradient(to right, #5e4ba1 0%, #5e4ba1 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
});

// calendar
let currentDate = new Date(2025, 10, 1); // nov
let startDate = null;
let endDate = null;

function renderCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const currentMonthElement = document.getElementById('current-month');
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    const calendarDaysContainer = document.getElementById('calendar-days');
    calendarDaysContainer.innerHTML = '';
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDayDate = prevLastDay.getDate();
    
    const allDays = [];
    
    // previous month days
    for (let i = firstDayIndex; i > 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'other-month');
        dayDiv.textContent = prevLastDayDate - i + 1;
        allDays.push(dayDiv);
    }
    
    // current month days
    for (let day = 1; day <= lastDayDate; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;
        
        const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        // check if this day is the start or end date
        if (startDate && currentDayDate.toDateString() === startDate.toDateString()) {
            dayDiv.classList.add('range-start');
        } else if (endDate && currentDayDate.toDateString() === endDate.toDateString()) {
            dayDiv.classList.add('range-end');
        } else if (startDate && endDate && currentDayDate > startDate && currentDayDate < endDate) {
            // check if day is in between start and end
            dayDiv.classList.add('in-range');
        }
        
        dayDiv.addEventListener('click', () => {
            if (!startDate || (startDate && endDate)) {
                startDate = currentDayDate;
                endDate = null;
            } else if (currentDayDate < startDate) {
                endDate = startDate;
                startDate = currentDayDate;
            } else {
                endDate = currentDayDate;
            }
            
            renderCalendar();
        });
        
        allDays.push(dayDiv);
    }
    
    // next month 
    const remainingDays = 42 - (firstDayIndex + lastDayDate);
    for (let day = 1; day <= remainingDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'other-month');
        dayDiv.textContent = day;
        allDays.push(dayDiv);
    }
    
    // append all days at once
    allDays.forEach(day => calendarDaysContainer.appendChild(day));
}

document.querySelector('.prev').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.querySelector('.next').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.querySelector('.plan-trip-btn').addEventListener('click', () => {
    // get selected interests using data-interest attribute
    const selectedInterests = Array.from(document.querySelectorAll('.interest-btn.active'))
        .map(btn => btn.getAttribute('data-interest'));

    const budget = Number(budgetValue.textContent);

    console.log("Saving interests:", selectedInterests);
    console.log("Saving budget:", budget);

    // SAVE TO LOCAL STORAGE
    localStorage.setItem("selectedInterests", JSON.stringify(selectedInterests));
    localStorage.setItem("selectedBudget", budget);

    window.location.href = "trips.html";
});

renderCalendar();
