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

// custom confirm function
function showCustomConfirm(interests, duration, style, budget) {
    return new Promise((resolve) => {

        // modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Confirm Your Trip</h3>
                    <p>Please review your selections before proceeding</p>
                </div>
                
                <div class="modal-details">
                    <div class="detail-row">
                        <span class="detail-label">Interest:</span>
                        <span class="detail-value ${interests.length === 0 ? 'empty' : ''}">
                            ${interests.length > 0 ? interests.join(', ') : 'None selected'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value ${duration.length === 0 ? 'empty' : ''}">
                            ${duration.length > 0 ? duration.join(', ') : 'None selected'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Style:</span>
                        <span class="detail-value ${style.length === 0 ? 'empty' : ''}">
                            ${style.length > 0 ? style.join(', ') : 'None selected'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Budget:</span>
                        <span class="detail-value">₱${budget.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="modal-buttons">
                    <button class="modal-btn cancel">Cancel</button>
                    <button class="modal-btn confirm">Confirm & Continue</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // animation
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
        
        // confirm btn
        modalOverlay.querySelector('.confirm').addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                resolve(true);
            }, 300);
        });
        
        // cancel btn
        modalOverlay.querySelector('.cancel').addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                resolve(false);
            }, 300);
        });
        
        // cicking oytside the confirm. tapno maikkat
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                    resolve(false);
                }, 300);
            }
        });
    });
}

document.querySelector('.plan-trip-btn').addEventListener('click', async () => {

    // get selected interests using data-interest attribute
    const selectedInterests = Array.from(document.querySelectorAll('.interest-btn.active'))
        .map(btn => btn.getAttribute('data-interest'));

    const selectedDuration = Array.from(document.querySelectorAll('.duration-btn.active'))
        .map(btn => btn.getAttribute('data-interest'));
    
    const selectedStyle = Array.from(document.querySelectorAll('.style-btn.active'))
        .map(btn => btn.getAttribute('data-interest'));

    const budget = Number(budgetValue.textContent);

    // show confirmation
    const confirmed = await showCustomConfirm(selectedInterests, selectedDuration, selectedStyle, budget);
    
    if (!confirmed) {
        return; // cancel == home.html
    }

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
