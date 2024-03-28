import './App.css';
import Web3 from 'web3';
import React from 'react';
import TodoList from './TodoList'
import TodoListABI from './artifacts/contracts/todo.sol/todo.json';
import DOMPurify from 'dompurify';
const todoAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

class App extends React.Component {
  componentWillMount() {
    this.loadBlockchainData();
  
}

  async loadBlockchainData() {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
      try {
        // Demander à l'utilisateur l'autorisation de se connecter au portefeuille
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error("L'utilisateur a refusé de connecter le compte", error);
      }
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const todoList = new web3.eth.Contract(TodoListABI.abi, todoAdress)
    this.setState({ todoList })
    const taskCount = await todoList.methods.taskCount().call()
    this.setState({ taskCount })
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
    this.setState({ loading: false })
  }

  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      taskCount: 0,
      tasks: [],
      loading: true
    }
    this.createTask = this.createTask.bind(this)
  }

  async createTask(content) {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
      try {
        // Demander à l'utilisateur l'autorisation de se connecter au portefeuille
        await window.ethereum.request({method: 'eth_requestAccounts'});
      } catch (error) {
        console.error("L'utilisateur a refusé de connecter le compte", error);
      }
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }
    const web3 = new Web3(provider);

    let safeimput = DOMPurify.sanitize(content);

    this.setState({loading: true})
    this.state.todoList.methods.createTask(safeimput).send({
      from: this.state.account,
      gasPrice: web3.utils.toWei('10', 'gwei')
    })
        .once('receipt', (receipt) => {
          this.setState({loading: false})
        })
  }

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              {this.state.loading ? <div id="loader" className="text-center"><p className="text-center">Loading...........</p></div> : <TodoList tasks={this.state.tasks} createTask={this.createTask}/>}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;