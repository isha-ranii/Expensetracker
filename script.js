const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const expenseChart = document.getElementById('expense-chart');
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Update localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Render Expenses
function renderExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${expense.title} - ${expense.amount} (${expense.category})
      <div>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </div>
    `;
    expenseList.appendChild(li);
  });
  renderChart();
}

// Add Expense
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  expenses.push({ title, amount, category });
  saveExpenses();
  renderExpenses();
  expenseForm.reset();
});

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

// Edit Expense
function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('title').value = expense.title;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('category').value = expense.category;

  deleteExpense(index);
}

// Render Chart
function renderChart() {
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];
  const data = categories.map(category =>
    expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  );

  new Chart(expenseChart, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        label: 'Expenses',
        data,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
      }],
    },
  });
}
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// Apply saved theme on page load
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'enabled') {
  document.body.classList.add('dark-mode');
}

function renderChart() {
    const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];
    const categoryData = categories.map(category =>
      expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
    );
  
    // Pie chart for categories
    new Chart(expenseChart, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          label: 'Expenses by Category',
          data: categoryData,
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
        }],
      },
    });
  
    // Bar chart for trends
    const monthlyData = Array(12).fill(0);
    expenses.forEach(expense => {
      const month = new Date(expense.date || Date.now()).getMonth();
      monthlyData[month] += expense.amount;
    });
  
    const trendChart = document.getElementById('expense-trend-chart');
    new Chart(trendChart, {
      type: 'bar',
      data: {
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ],
        datasets: [{
          label: 'Monthly Expenses',
          data: monthlyData,
          backgroundColor: '#36a2eb',
        }],
      },
    });
  }
  
  function exportToCSV() {
    if (expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }
  
    const headers = ["Title", "Amount", "Category", "Date"];
    const rows = expenses.map(expense => [
      expense.title,
      expense.amount,
      expense.category,
      expense.date || new Date().toLocaleDateString()
    ]);
  
    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
  
    URL.revokeObjectURL(url);
  }
  
  document.getElementById("export-csv").addEventListener("click", exportToCSV);
  
  const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetProgress = document.getElementById("budget-progress");
const budgetStatus = document.getElementById("budget-status");

let monthlyBudget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;

function updateBudgetProgress() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlyBudget - totalExpenses;

  budgetProgress.max = monthlyBudget;
  budgetProgress.value = totalExpenses;

  budgetStatus.textContent = remainingBudget >= 0
    ? `Remaining: $${remainingBudget.toFixed(2)}`
    : `Over Budget by: ${Math.abs(remainingBudget).toFixed(2)}`;
}

budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  monthlyBudget = parseFloat(budgetInput.value);
  localStorage.setItem("monthlyBudget", monthlyBudget);
  updateBudgetProgress();
  budgetInput.value = "";
});

function updateExpenseList() {
    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${expense.title} - ₹${expense.amount} (${expense.category})
        <button onclick="deleteExpense(${index})">Delete</button>
      `;
      expenseList.appendChild(li);
    });
  }

// Initialize budget progress on page load
updateBudgetProgress();



// Initial Render
renderExpenses();

