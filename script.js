let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const expenseForm = document.getElementById('expenseForm');
const expenseName = document.getElementById('expenseName');
const expenseAmount = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseList = document.getElementById('expenseList').getElementsByTagName('tbody')[0];
const summary = document.getElementById('summary');
const darkModeToggle = document.getElementById('darkModeToggle');
const filterCategory = document.getElementById('filterCategory'); // Get the filter element

let editId = null;

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value.trim());
    const category = expenseCategory.value;

    if (name && !isNaN(amount) && category) {
        if (editId) {
            const expenseIndex = expenses.findIndex((expense) => expense.id === editId);
            if (expenseIndex !== -1) {
                expenses[expenseIndex] = { id: editId, name, amount, category };
            }
            editId = null;
        } else {
            const expense = { id: Date.now(), name, amount, category };
            expenses.push(expense);
        }

        saveExpenses();
        expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Update expenses from storage
        renderExpenses(getFilteredExpenses()); // Render with current filter
        updateSummary(getFilteredExpenses()); // Update summary with current filter
        expenseForm.reset();
    } else {
        alert("Please enter a valid amount (number).");
    }
});

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses(expensesToRender = expenses) { // Accept filtered expenses
    expenseList.innerHTML = ''; // Clear the table

    expensesToRender.forEach((expense) => {
        const row = expenseList.insertRow();
        const nameCell = row.insertCell();
        const amountCell = row.insertCell();
        const categoryCell = row.insertCell();
        const actionsCell = row.insertCell();

        nameCell.textContent = expense.name;
        amountCell.textContent = `$${expense.amount.toFixed(2)}`;
        categoryCell.textContent = expense.category;

        actionsCell.innerHTML = `
            <button onclick="editExpense(${expense.id})" class="text-blue-500 hover:text-blue-700 mr-1 mb-1 px-2 py-1 rounded">Edit</button>
            <button onclick="deleteExpense(${expense.id})" class="text-red-500 hover:text-red-700 ml-1 mb-1 px-2 py-1 rounded">Delete</button>
        `;
    });
}

function editExpense(id) {
    const expense = expenses.find((expense) => expense.id === id);
    if (expense) {
        expenseName.value = expense.name;
        expenseAmount.value = expense.amount;
        expenseCategory.value = expense.category;
        editId = id;
    }
}

function deleteExpense(id) {
    expenses = expenses.filter((expense) => expense.id !== id);
    saveExpenses();
    expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Update expenses from storage
    renderExpenses(getFilteredExpenses()); // Render with current filter
    updateSummary(getFilteredExpenses()); // Update summary with current filter

}

function updateSummary(expensesToSummarize = expenses) { // Accept filtered expenses
    const summaryData = expensesToSummarize.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    summary.innerHTML = Object.entries(summaryData)
        .map(([category, amount]) => `<div class="flex justify-between"><span>${category}:</span> <span>$${amount.toFixed(2)}</span></div>`)
        .join('');
}


function getFilteredExpenses() {
    const selectedCategory = filterCategory.value;
    return selectedCategory === 'All' ? expenses : expenses.filter(expense => expense.category === selectedCategory);
}

filterCategory.addEventListener('change', () => {
    renderExpenses(getFilteredExpenses());
    updateSummary(getFilteredExpenses());
});



darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    darkModeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
});

const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    document.documentElement.classList.add('dark');
    darkModeToggle.textContent = '☀️';
}

renderExpenses(getFilteredExpenses()); // Initial render with filter
updateSummary(getFilteredExpenses()); // Initial summary with filter