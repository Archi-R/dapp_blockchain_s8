import './App.css';
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import TodoList from './TodoList'
import { ethers } from 'ethers';
import TodoListABI from './artifacts/contracts/todo.sol/todo.json';
const todoAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

class App extends React.Component {
  componentWillMount() {
    this.loadBlockchainData();
  
}

  async loadBlockchainData() {
    const web3 = new Web3(window.ethereum || "http://localhost:8545")
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

  createTask(content) {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
  })
}

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              {this.state.loading ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> : <TodoList tasks={this.state.tasks} createTask={this.createTask}/>}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;