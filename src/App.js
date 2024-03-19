import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
//import TodoListContract from '../contracts/todo.sol';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [todoListContract, setTodoListContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    async function init() {
      // Charge Web3
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // Demande l'autorisation d'accéder au compte utilisateur
          await window.ethereum.enable();
          setWeb3(web3Instance);

          // Obtiens les comptes utilisateur
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          // Initialise le contrat TodoList
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = TodoListContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            TodoListContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setTodoListContract(contractInstance);

          // Charge les tâches existantes
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
        {tasks.map((task, index) => (
          <li key={index}>{task.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
