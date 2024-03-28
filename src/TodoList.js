import React, { Component } from 'react'

class TodoList extends Component {

  render() {
    return (
      <div id="content">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <form onSubmit={(event) =>{
          event.preventDefault()
          this.props.createTask(this.task.value)
        }}>
          <input id="newTask" ref={(input) => this.task = input} type="text" className="form-control" placeholder="Add task ..." required />
          <input type="submit" hidden={true} />
        </form>
        <ul id="taskList" className="list-unstyled">
          { this.props.tasks.map((task, key) => {
            return(
              <div class="taskTemplate" className="checkbox" key={key}>
                <label>
                  <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => this.props.toggleTaskCompleted(task.id)} // Utilisez la méthode ici
                    />
                  <span class="content">{task.content}</span>
                </label>
                
                <hr/>
              </div>
            )
          })}
        </ul>
        <ul id="completedTaskList" className="list-unstyled">
        </ul>
      </div>
    );
  }
}

export default TodoList;