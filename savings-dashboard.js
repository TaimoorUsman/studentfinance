document.addEventListener('DOMContentLoaded', () => {
    const totalSavings = document.getElementById('totalSavings');
    const savingsForm = document.getElementById('savingsForm');
    const addSavings = document.getElementById('addSavings');
    const withdrawSavings = document.getElementById('withdrawSavings');
    const savingsHistory = document.getElementById('savingsHistory').getElementsByTagName('tbody')[0];
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savingsGrowthChartCtx = document.getElementById('savingsGrowthChart').getContext('2d');

    let savings = parseFloat(localStorage.getItem('savings')) || 0;
    let savingsTransactions = JSON.parse(localStorage.getItem('savingsTransactions')) || [];

    // Update savings display
    const updateSavings = () => {
        totalSavings.textContent = `$${savings.toFixed(2)}`;
    };

    // Add savings transaction
    const addSavingsTransaction = (date, description, amount) => {
        const row = savingsHistory.insertRow();
        row.innerHTML = `
            <td>${date}</td>
            <td>${description}</td>
            <td>${amount >= 0 ? '+' : '-'}$${Math.abs(amount).toFixed(2)}</td>
        `;
    };

    // Update savings growth chart
    const updateChart = () => {
        const savingsData = savingsTransactions.map(t => t.amount);
        const labels = savingsTransactions.map(t => t.date);

        new Chart(savingsGrowthChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Savings Growth',
                    data: savingsData,
                    borderColor: '#1976d2',
                    fill: false,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // Handle savings form submission
    savingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('savingsAmount').value);
        const description = e.submitter === addSavings ? 'Added to Savings' : 'Withdrawn from Savings';
        const date = new Date().toLocaleString();

        if (e.submitter === withdrawSavings && amount > savings) {
            alert('Insufficient savings!');
            return;
        }

        savings += e.submitter === addSavings ? amount : -amount;
        savingsTransactions.push({ date, description, amount });

        localStorage.setItem('savings', savings);
        localStorage.setItem('savingsTransactions', JSON.stringify(savingsTransactions));

        updateSavings();
        addSavingsTransaction(date, description, amount);
        updateChart();

        savingsForm.reset();
    });

    // Initialize
    updateSavings();
    savingsTransactions.forEach(t => addSavingsTransaction(t.date, t.description, t.amount));
    updateChart();

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});