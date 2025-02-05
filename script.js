let web3;
let currentUser;
let tasks = []; // Global array to store tasks

window.onload = () => {
    document.getElementById('connectWallet').onclick = connectWallet;
    document.getElementById('generateKeypair').onclick = generateKeypair;
    document.getElementById('addTask').onclick = addTask;
    document.getElementById('filterCompleted').onclick = () => filterTasks(true);
    document.getElementById('filterPending').onclick = () => filterTasks(false);
};

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentUser = await web3.eth.getAccounts();
        alert('Wallet connected: ' + currentUser);
        loadTasks(); // Load tasks after connecting the wallet
    } else {
        alert('Please install MetaMask!');
    }
}

function generateKeypair() {
    // Logic to generate a keypair and store it in local storage
    const keypair = {
        privateKey: 'your-private-key', // Replace with actual generation logic
        publicKey: 'your-public-key'
    };
    localStorage.setItem('keypair', JSON.stringify(keypair));
    alert('Keypair generated and stored in local storage!');
}

async function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;

    // Call the smart contract function to add the task
    // await contract.methods.addTask(title, description, dueDate).send({ from: currentUser });

    alert('Task added: ' + title);
    loadTasks(); // Reload tasks after adding
}

async function loadTasks() {
    // Fetch tasks from the blockchain
    tasks = await getUserTasks(); // Implement this function to fetch tasks from the blockchain
    displayTasks(tasks); // Display all tasks initially
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear current list

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} - Due: ${task.dueDate} - ${task.completed ? 'Completed' : 'Pending'}`;
        
        // Add edit and delete buttons
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTask(task.id);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);
        
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

async function filterTasks(status) {
    if (tasks.length === 0) {
        alert('No tasks available. Please add a task first.');
        return; // Exit if no tasks are loaded
    }
    
    // Filter tasks based on status (completed or pending)
    const filteredTasks = tasks.filter(task => task.completed === status);
    displayTasks(filteredTasks); // Display filtered tasks
}

// Mock function for retrieving user tasks (to be replaced with actual contract call)
async function getUserTasks() {
    // You should replace this mock data with actual calls to your blockchain smart contract
    return [
        { id: 1, title: "Task 1", description: "Test task 1", dueDate: "2025-02-01T12:00", completed: false },
        { id: 2, title: "Task 2", description: "Test task 2", dueDate: "2025-02-02T12:00", completed: true },
        // Add more mock tasks as needed
    ];
}

async function editTask(taskId) {
    // Logic to edit a task
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newTitle = prompt("Edit task title:", task.title);
        const newDescription = prompt("Edit task description:", task.description);
        const newDueDate = prompt("Edit task due date:", task.dueDate);

        // Call the smart contract function to update the task
        // await contract.methods.updateTask(taskId, newTitle, newDescription, newDueDate).send({ from: currentUser });

        alert('Task updated: ' + newTitle);
        loadTasks();
    }
}

async function deleteTask(taskId) {
    // Call the smart contract function to delete the task
    // await contract.methods.deleteTask(taskId).send({ from: currentUser });

    alert('Task deleted');
    loadTasks();
}