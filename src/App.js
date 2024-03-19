import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TodoListContract from './artifacts/contracts/todo.sol/todo.json';
const todoAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [todoListContract, setTodoListContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = TodoListContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            TodoListContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setTodoListContract(contractInstance);

          loadTasks(contractInstance);
        } catch (error) {
          console.error('Erreur lors de la connexion à Ethereum: ', error);
        }
      } else {
        console.error(
          "Le navigateur ne supporte pas Ethereum. Essayez d'installer MetaMask."
        );
      }
    }
    init();
  }, []);

  async function loadTasks(contract) {
    const taskCount = await contract.methods.taskCount().call();
    const loadedTasks = [];
    for (let i = 1; i <= taskCount; i++) {
      const task = await contract.methods.tasks(i).call();
      loadedTasks.push(task);
    }
    setTasks(loadedTasks);
  }

  async function createTask() {
    if (!newTaskInput) return;
    await todoListContract.methods
      .createTask(newTaskInput)
      .send({ from: accounts[0] });
    setNewTaskInput('');
    loadTasks(todoListContract);
  }

  async function toggleCompleted(taskId) {
    await todoListContract.methods.toggleCompleted(taskId).send({ from: accounts[0] });
    loadTasks(todoListContract);
  }

  return (
    <div className="App">
      <h1>TODO List Blockchain</h1>
      <div>
        <input
          type="text"
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
        />
        <button onClick={createTask}>Ajouter une tâche</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.content}</span>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;