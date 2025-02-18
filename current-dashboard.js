document.addEventListener('DOMContentLoaded', () => {
    const totalBalance = document.getElementById('totalBalance');
    const remainingBalance = document.getElementById('remainingBalance');
    const addMoneyForm = document.getElementById('addMoneyForm');
    const withdrawMoneyForm = document.getElementById('withdrawMoneyForm');
    const transactionHistory = document.getElementById('transactionHistory').getElementsByTagName('tbody')[0];
    const darkModeToggle = document.getElementById('darkModeToggle');
    const incomeExpenseChartCtx = document.getElementById('incomeExpenseChart').getContext('2d');
    const expenseCategoryChartCtx = document.getElementById('expenseCategoryChart').getContext('2d');
    const todayBtn = document.getElementById('todayBtn');
    const yesterdayBtn = document.getElementById('yesterdayBtn');
    const monthlyBtn = document.getElementById('monthlyBtn');

    let balance = parseFloat(localStorage.getItem('balance')) || 0;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let highBalanceThisMonth = parseFloat(localStorage.getItem('highBalanceThisMonth')) || 0;

    // Update total and remaining balance
    const updateBalance = () => {
        if (balance > highBalanceThisMonth) {
            highBalanceThisMonth = balance;
            localStorage.setItem('highBalanceThisMonth', highBalanceThisMonth);
        }
        totalBalance.textContent = `$${highBalanceThisMonth.toFixed(2)}`;
        remainingBalance.textContent = `$${balance.toFixed(2)}`;
    };

    // Add transaction to history
    const addTransaction = (date, description, amount) => {
        const row = transactionHistory.insertRow(0); // Add new transactions at the top
        row.innerHTML = `
            <td>${date}</td>
            <td>${description}</td>
            <td>${amount >= 0 ? '+' : '-'}$${Math.abs(amount).toFixed(2)}</td>
        `;
    };

    // Filter transactions by date
    const filterTransactions = (filter) => {
        const now = new Date();
        const today = now.toDateString();
        const yesterday = new Date(now.setDate(now.getDate() - 1)).toDateString();
        return transactions.filter(t => {
            const transactionDate = new Date(t.date).toDateString();
            switch (filter) {
                case 'today':
                    return transactionDate === today;
                case 'yesterday':
                    return transactionDate === yesterday;
                case 'monthly':
                    return new Date(t.date).getMonth() === now.getMonth();
                default:
                    return true;
            }
        });
    };

    // Render transactions based on filter
    const renderTransactions = (filter) => {
        transactionHistory.innerHTML = '';
        const filteredTransactions = filterTransactions(filter);
        filteredTransactions.forEach(t => addTransaction(t.date, t.description, t.amount));
    };

    // Update charts
    const updateCharts = () => {
        const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

        // Income vs Expenses Chart
        new Chart(incomeExpenseChartCtx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    label: 'Amount',
                    data: [income, Math.abs(expenses)],
                    backgroundColor: ['#4caf50', '#f44336'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Expense Categories Chart
        const categories = {};
        transactions.filter(t => t.amount < 0).forEach(t => {
            categories[t.description] = (categories[t.description] || 0) + Math.abs(t.amount);
        });

        new Chart(expenseCategoryChartCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    label: 'Amount',
                    data: Object.values(categories),
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    };

    // Handle add money form submission
    addMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('addAmount').value);
        const description = document.getElementById('addDescription').value;
        const date = new Date().toLocaleString();

        if (amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        balance += amount;
        transactions.unshift({ date, description, amount });

        localStorage.setItem('balance', balance);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        updateBalance();
        addTransaction(date, description, amount);
        updateCharts();

        addMoneyForm.reset();
    });

    // Handle withdraw money form submission
    withdrawMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const description = document.getElementById('withdrawDescription').value;
        const date = new Date().toLocaleString();

        if (amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (balance - amount < 0) {
            alert('Insufficient balance!');
            return;
        }

        balance -= amount;
        transactions.unshift({ date, description, amount: -amount });

        localStorage.setItem('balance', balance);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        updateBalance();
        addTransaction(date, description, -amount);
        updateCharts();

        withdrawMoneyForm.reset();
    });

    // Handle navigation buttons
    todayBtn.addEventListener('click', () => {
        renderTransactions('today');
        todayBtn.classList.add('active');
        yesterdayBtn.classList.remove('active');
        monthlyBtn.classList.remove('active');
    });

    yesterdayBtn.addEventListener('click', () => {
        renderTransactions('yesterday');
        yesterdayBtn.classList.add('active');
        todayBtn.classList.remove('active');
        monthlyBtn.classList.remove('active');
    });

    monthlyBtn.addEventListener('click', () => {
        renderTransactions('monthly');
        monthlyBtn.classList.add('active');
        todayBtn.classList.remove('active');
        yesterdayBtn.classList.remove('active');
    });

    // Initialize
    updateBalance();
    renderTransactions('today');
    updateCharts();

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});