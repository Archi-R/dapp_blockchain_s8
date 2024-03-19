// Dans un fichier de composant React, par exemple src/components/TaskManager.js
import React, { useEffect, useState } from 'react';
import { todo } from '../ethereum/contracts/todo';

const TaskManager = () => {
    const [taskCount, setTaskCount] = useState(0);
    const todoInstance = new todo();

    useEffect(() => {
        const fetchTasks = async () => {
            const count = await todoInstance.fetchTaskCount();
            setTaskCount(count.toNumber());
        };

        fetchTasks();
    }, []); // Exécuté une fois au montage du composant

    return (
        <div>
            Nombre de tâches : {taskCount}
            {/* Afficher d'autres éléments de l'interface utilisateur ici */}
        </div>
    );
}

export default TaskManager;