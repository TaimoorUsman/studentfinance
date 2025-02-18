document.addEventListener('DOMContentLoaded', () => {
    const pinInputs = document.querySelectorAll('.pin');
    const pinForm = document.getElementById('pinForm');
    const securityQuestions = document.getElementById('securityQuestions');
    const forgotPIN = document.getElementById('forgotPIN');
    const forgotPINLink = document.getElementById('forgotPINLink');
    const pinError = document.getElementById('pinError');
    const securityForm = document.getElementById('securityForm');
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryError = document.getElementById('recoveryError');

    // Auto-focus navigation for PIN input
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
        });
    });

    // PIN submission
    pinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = Array.from(pinInputs).map(input => input.value).join('');
        if (pin.length === 4) {
            localStorage.setItem('pin', pin);
            pinError.textContent = '';
            securityQuestions.classList.remove('hidden');
        } else {
            pinError.textContent = 'Please enter a valid 4-digit PIN.';
        }
    });

    // Security questions submission
    securityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const dob = document.getElementById('dob').value;
        const favoriteDay = document.getElementById('favoriteDay').value;
        const favoriteNumber = document.getElementById('favoriteNumber').value;

        if (dob && favoriteDay && favoriteNumber) {
            localStorage.setItem('dob', dob);
            localStorage.setItem('favoriteDay', favoriteDay);
            localStorage.setItem('favoriteNumber', favoriteNumber);
            window.location.href = 'account-selection.html';
        } else {
            alert('Please fill out all security questions.');
        }
    });

    // Forgot PIN link
    forgotPINLink.addEventListener('click', (e) => {
        e.preventDefault();
        pinForm.classList.add('hidden');
        securityQuestions.classList.add('hidden');
        forgotPIN.classList.remove('hidden');
    });

    // PIN recovery
    recoveryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recoveryDOB = document.getElementById('recoveryDOB').value;
        const recoveryDay = document.getElementById('recoveryDay').value;
        const recoveryNumber = document.getElementById('recoveryNumber').value;

        const storedDOB = localStorage.getItem('dob');
        const storedDay = localStorage.getItem('favoriteDay');
        const storedNumber = localStorage.getItem('favoriteNumber');

        if (recoveryDOB === storedDOB && recoveryDay === storedDay && recoveryNumber === storedNumber) {
            alert('PIN reset successful. Please set a new PIN.');
            window.location.href = 'login.html';
        } else {
            recoveryError.textContent = 'Invalid security answers. Please try again.';
        }
    });
});