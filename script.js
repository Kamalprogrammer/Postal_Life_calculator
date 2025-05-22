// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Remove any existing event listeners on calculate buttons
document.querySelectorAll('.calculate-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Get the href from the button
        const href = this.getAttribute('href');
        if (href) {
            // Clean navigation - prevent any default form submission
            window.location.href = href;
        }
    });
});

// Clean up any existing popups/overlays
function cleanupPopups() {
    // Remove any existing calculator popups
    const popups = document.querySelectorAll('.calculator-modal, .calculator-popup, .popup-overlay');
    popups.forEach(popup => popup.remove());
}

// Call cleanup on page load
document.addEventListener('DOMContentLoaded', cleanupPopups);

// Call cleanup before unload
window.addEventListener('beforeunload', cleanupPopups);

function openCalculator(calculatorType) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'calculator-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'calculator-modal-content';
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => modal.remove();
    
    // Add calculator title
    const title = document.createElement('h2');
    title.textContent = calculatorType;
    
    // Add calculator form
    const form = createCalculatorForm(calculatorType);
    
    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Add modal styles dynamically
    addModalStyles();
}

function createCalculatorForm(calculatorType) {
    const form = document.createElement('form');
    form.className = 'calculator-form';
    
    // Add form fields based on calculator type
    switch(calculatorType) {
        case 'PLI Endowment Assurance (Santosh)':
        case 'PLI Whole Life Assurance (Suraksha)':
        case 'PLI Convertible Whole Life Assurance (Suvidha)':
        case 'RPLI Endowment Assurance (Gram Santosh)':
        case 'RPLI Whole Life Assurance (Gram Suraksha)':
            form.innerHTML = `
                <div class="form-group">
                    <label for="age">Age</label>
                    <input type="number" id="age" required min="18" max="60">
                </div>
                <div class="form-group">
                    <label for="sum-assured">Sum Assured (₹)</label>
                    <input type="number" id="sum-assured" required min="10000" step="10000">
                </div>
                <div class="form-group">
                    <label for="term">Policy Term (Years)</label>
                    <input type="number" id="term" required min="5" max="35">
                </div>
                <button type="submit" class="calculate-btn">Calculate Premium</button>
                <div id="result" class="result-section"></div>
            `;
            break;
            
        case 'Post Office RD Calculator':
            form.innerHTML = `
                <div class="form-group">
                    <label for="monthly-deposit">Monthly Deposit (₹)</label>
                    <input type="number" id="monthly-deposit" required min="100" step="10">
                </div>
                <div class="form-group">
                    <label for="term">Term (Years)</label>
                    <input type="number" id="term" required min="5" max="10">
                </div>
                <button type="submit" class="calculate-btn">Calculate Returns</button>
                <div id="result" class="result-section"></div>
            `;
            break;
            
        // Add more calculator types as needed
    }
    
    // Add form submit handler
    form.onsubmit = (e) => {
        e.preventDefault();
        calculateResults(calculatorType, form);
    };
    
    return form;
}

function calculateResults(calculatorType, form) {
    const resultDiv = form.querySelector('#result');
    let result = '';
    
    // Implement calculation logic based on calculator type
    switch(calculatorType) {
        case 'PLI Endowment Assurance (Santosh)':
        case 'PLI Whole Life Assurance (Suraksha)':
        case 'PLI Convertible Whole Life Assurance (Suvidha)':
        case 'RPLI Endowment Assurance (Gram Santosh)':
        case 'RPLI Whole Life Assurance (Gram Suraksha)':
            const age = parseInt(form.querySelector('#age').value);
            const sumAssured = parseInt(form.querySelector('#sum-assured').value);
            const term = parseInt(form.querySelector('#term').value);
            
            // Sample calculation (replace with actual formula)
            const premium = (sumAssured * 0.04) / 12;
            
            result = `
                <h3>Premium Details</h3>
                <p>Monthly Premium: ₹${premium.toFixed(2)}</p>
                <p>Quarterly Premium: ₹${(premium * 3).toFixed(2)}</p>
                <p>Half-Yearly Premium: ₹${(premium * 6).toFixed(2)}</p>
                <p>Yearly Premium: ₹${(premium * 12).toFixed(2)}</p>
            `;
            break;
            
        case 'Post Office RD Calculator':
            const monthlyDeposit = parseInt(form.querySelector('#monthly-deposit').value);
            const rdTerm = parseInt(form.querySelector('#term').value);
            
            // Sample calculation (replace with actual formula)
            const interest = 5.8; // Current RD interest rate
            const maturityAmount = monthlyDeposit * rdTerm * 12 * (1 + interest/100);
            
            result = `
                <h3>Maturity Details</h3>
                <p>Total Investment: ₹${(monthlyDeposit * rdTerm * 12).toFixed(2)}</p>
                <p>Interest Earned: ₹${(maturityAmount - (monthlyDeposit * rdTerm * 12)).toFixed(2)}</p>
                <p>Maturity Amount: ₹${maturityAmount.toFixed(2)}</p>
            `;
            break;
    }
    
    resultDiv.innerHTML = result;
}

function addModalStyles() {
    // Add modal styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = `
            .calculator-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .calculator-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                position: relative;
            }
            
            .close-btn {
                position: absolute;
                right: 1rem;
                top: 1rem;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .calculator-form {
                margin-top: 1rem;
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
            }
            
            .form-group input {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            
            .result-section {
                margin-top: 1rem;
                padding: 1rem;
                background: #f5f5f5;
                border-radius: 5px;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// Function to standardize header text across all calculator pages
function standardizeHeaderText() {
    // Check if we're on a calculator page (not the main home page)
    if (window.location.pathname.includes('calculators/')) {
        // Get the header elements
        const headerTitle = document.querySelector('.header-content h1');
        const headerSubtitle = document.querySelector('.header-content p');

        // Update the header text to be consistent with home page
        if (headerTitle) {
            headerTitle.textContent = 'Postal Life Insurance Calculator';
        }
        
        // Update the subtitle to be generic but informative
        if (headerSubtitle) {
            headerSubtitle.textContent = 'Calculate premiums and benefits for various postal insurance policies';
        }
    }
}

// Handle policy type change WITHOUT updating header
document.addEventListener('DOMContentLoaded', function() {
    const policyTypeSelect = document.getElementById('policy-type');
    
    if (policyTypeSelect) {
        policyTypeSelect.addEventListener('change', function() {
            const selectedPolicy = this.value;
            const policy = policyDetails?.[selectedPolicy];
            
            if (policy) {
                // Update form elements but NOT the header
                // Update form-heading if it exists
                const formHeading = document.getElementById('form-heading');
                if (formHeading) {
                    formHeading.textContent = `${policy.name} Premium Calculator`;
                }
                
                // Update document title
                document.title = `${policy.name} Calculator - Postal Life Insurance`;

                // Handle policy-specific logic
                if (policy.term) {
                    const termInput = document.getElementById('term');
                    if (termInput) {
                        termInput.value = policy.term;
                        termInput.readOnly = true;
                    }
                }
                
                // Redirect to the appropriate calculator page if different from current
                const currentPage = window.location.pathname.split('/').pop().split('.')[0];
                if (selectedPolicy !== currentPage) {
                    window.location.href = `${selectedPolicy}.html`;
                }
            }
        });
    }

    // Call the standardize header function
    standardizeHeaderText();
}); 