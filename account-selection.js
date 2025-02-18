document.addEventListener('DOMContentLoaded', () => {
    const currentAccount = document.getElementById('currentAccount');
    const savingsAccount = document.getElementById('savingsAccount');
    const goalsAccount = document.getElementById('goalsAccount');

    // Redirect to the selected account dashboard
    const redirectToDashboard = (accountType) => {
        localStorage.setItem('accountType', accountType);
        switch (accountType) {
            case 'current':
                window.location.href = 'current-dashboard.html';
                break;
            case 'savings':
                window.location.href = 'savings-dashboard.html';
                break;
            case 'goals':
                window.location.href = 'goals-dashboard.html';
                break;
            default:
                break;
        }
    };

    // Add event listeners to account cards
    currentAccount.addEventListener('click', () => redirectToDashboard('current'));
    savingsAccount.addEventListener('click', () => redirectToDashboard('savings'));
    goalsAccount.addEventListener('click', () => redirectToDashboard('goals'));
});