// Initialize expenses array from localStorage or empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseName = document.getElementById('expenseName');
const expenseAmount = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseList = document.getElementById('expenseList').getElementsByTagName('tbody')[0];
const summary = document.getElementById('summary');
const darkModeToggle = document.getElementById('darkModeToggle');

let editId = null;

// Add or Edit Expense
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value.trim());
  const category = expenseCategory.value;

  if (name && amount && category) {
    if (editId) {
      // Edit existing expense
      const expenseIndex = expenses.findIndex((expense) => expense.id === editId);
      if (expenseIndex !== -1) {
        expenses[expenseIndex] = { id: editId, name, amount, category };
      }
      editId = null;
    } else {
      // Add new expense
      const expense = { id: Date.now(), name, amount, category };
      expenses.push(expense);
    }
    saveExpenses();
    renderExpenses();
    updateSummary();
    expenseForm.reset();
  }
});

// Save Expenses to localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Render Expenses
function renderExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach((expense) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="p-2">${expense.name}</td>
      <td class="p-2">$${expense.amount.toFixed(2)}</td>
      <td class="p-2">${expense.category}</td>
      <td class="p-2">
        <button onclick="editExpense(${expense.id})" class="text-blue-500 hover:text-blue-700">Edit</button>
        <button onclick="deleteExpense(${expense.id})" class="text-red-500 hover:text-red-700 ml-2">Delete</button>
      </td>
    `;
    expenseList.appendChild(row);
  });
}

// Edit Expense
function editExpense(id) {
  const expense = expenses.find((expense) => expense.id === id);
  if (expense) {
    expenseName.value = expense.name;
    expenseAmount.value = expense.amount;
    expenseCategory.value = expense.category;
    editId = id;
  }
}

// Delete Expense
function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  saveExpenses();
  renderExpenses();
  updateSummary();
}

// Update Summary
function updateSummary() {
  const summaryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  summary.innerHTML = Object.keys(summaryData)
    .map((category) => `<div class="flex justify-between"><span>${category}:</span> <span>$${summaryData[category].toFixed(2)}</span></div>`)
    .join('');
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  // Save dark mode preference to localStorage
  const isDarkMode = document.documentElement.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode);
  // Update button text
  darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
  document.documentElement.classList.add('dark');
  darkModeToggle.textContent = '☀️';
} else {
  document.documentElement.classList.remove('dark');
  darkModeToggle.textContent = '🌙';
}

// Initial Render
renderExpenses();
updateSummary();