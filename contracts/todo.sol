// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
// We have to specify what version of compiler this code will compile with

import "hardhat/console.sol";

contract todo {
    struct Task {
        uint id;
        string content;
        bool completed;
        uint createdAt;
    }

    mapping(uint => Task) public tasks;
    uint public taskCount;

    // Constructor to initialize taskCount to zero
    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, block.timestamp);
        emit TaskCreated(taskCount, _content, false, block.timestamp);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

    event TaskCreated(
        uint id,
        string content,
        bool completed,
        uint createdAt
    );

    event TaskCompleted(
        uint id,
        bool completed
    );
}