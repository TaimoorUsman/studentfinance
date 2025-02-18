document.addEventListener('DOMContentLoaded', () => {
    const goalForm = document.getElementById('goalForm');
    const addMoneyForm = document.getElementById('addMoneyForm');
    const goalSelect = document.getElementById('goalSelect');
    const goalsContainer = document.getElementById('goalsContainer');
    const completedGoalsHistory = document.getElementById('completedGoalsHistory').getElementsByTagName('tbody')[0];
    const darkModeToggle = document.getElementById('darkModeToggle');
    const goalsProgressChartCtx = document.getElementById('goalsProgressChart').getContext('2d');

    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    let completedGoals = JSON.parse(localStorage.getItem('completedGoals')) || [];

    // Render goals
    const renderGoals = () => {
        goalsContainer.innerHTML = '';
        goalSelect.innerHTML = '<option value="">Select a goal</option>';
        goals.forEach((goal, index) => {
            const progress = (goal.saved / goal.target) * 100;
            const goalCard = document.createElement('div');
            goalCard.className = `goal-card ${progress >= 100 ? 'completed' : ''}`;
            goalCard.innerHTML = `
                <h4>${goal.name}</h4>
                <p>Target: $${goal.target.toFixed(2)}</p>
                <p>Saved: $${goal.saved.toFixed(2)}</p>
                <p>Deadline: ${goal.deadline}</p>
                <div class="progress-bar">
                    <div style="width: ${progress}%"></div>
                </div>
                <div class="actions">
                    <button onclick="editGoal(${index})">Edit</button>
                    <button class="delete" onclick="deleteGoal(${index})">Delete</button>
                </div>
            `;
            goalsContainer.appendChild(goalCard);

            // Add goal to the dropdown
            const option = document.createElement('option');
            option.value = index;
            option.textContent = goal.name;
            goalSelect.appendChild(option);
        });
    };

    // Render completed goals
    const renderCompletedGoals = () => {
        completedGoalsHistory.innerHTML = '';
        completedGoals.forEach(goal => {
            const row = completedGoalsHistory.insertRow();
            row.innerHTML = `
                <td>${goal.name}</td>
                <td>$${goal.target.toFixed(2)}</td>
                <td>$${goal.saved.toFixed(2)}</td>
                <td>${goal.deadline}</td>
                <td>✅ Completed</td>
            `;
        });
    };

    // Update charts
    const updateCharts = () => {
        const goalsData = goals.map(g => (g.saved / g.target) * 100);
        const goalLabels = goals.map(g => g.name);

        new Chart(goalsProgressChartCtx, {
            type: 'bar',
            data: {
                labels: goalLabels,
                datasets: [{
                    label: 'Progress (%)',
                    data: goalsData,
                    backgroundColor: '#4caf50',
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    };

    // Handle goal form submission
    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('goalName').value;
        const target = parseFloat(document.getElementById('targetAmount').value);
        const deadline = document.getElementById('deadline').value;

        goals.push({ name, target, saved: 0, deadline });
        localStorage.setItem('goals', JSON.stringify(goals));

        renderGoals();
        updateCharts();
        goalForm.reset();
    });

    // Handle add money form submission
    addMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const goalIndex = parseInt(goalSelect.value);
        const amount = parseFloat(document.getElementById('addAmount').value);

        if (goalIndex >= 0 && goalIndex < goals.length) {
            goals[goalIndex].saved += amount;
            if (goals[goalIndex].saved >= goals[goalIndex].target) {
                completedGoals.push(goals[goalIndex]);
                goals.splice(goalIndex, 1);
                localStorage.setItem('completedGoals', JSON.stringify(completedGoals));
            }
            localStorage.setItem('goals', JSON.stringify(goals));
            renderGoals();
            renderCompletedGoals();
            updateCharts();
        }

        addMoneyForm.reset();
    });

    // Edit goal
    window.editGoal = (index) => {
        const goal = goals[index];
        document.getElementById('goalName').value = goal.name;
        document.getElementById('targetAmount').value = goal.target;
        document.getElementById('deadline').value = goal.deadline;
        goals.splice(index, 1);
        renderGoals();
    };

    // Delete goal
    window.deleteGoal = (index) => {
        goals.splice(index, 1);
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
        updateCharts();
    };

    // Initialize
    renderGoals();
    renderCompletedGoals();
    updateCharts();

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});