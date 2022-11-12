import { useState, useEffect } from 'react'
import '../assets/style.css'
import { Link } from "react-router-dom";

const newTask = {
    name: '',
    description: '',
    priority: '',
    deadline: '',
    completed: false,
    visibleDescription: false
}

const Tasks = () => {
    const [state, setState] = useState(getTaskValues);

    const handleChange = e => {
        const { name, value } = e.target

        setState(prev => ({
            ...prev,
            newTask: {
                ...prev.newTask,
                [name]: value
            }
        }))
    }

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(state))
    }, [state]);

    function getTaskValues() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (!storedTasks) {
            return {
                tasks: [],
                newTask,
                editMode: false,
                activeTabId: 0
            }
        }
        else 
            return storedTasks;
        }

    const handleAdd = () => {
        setEditMode(false)
        if (state.editMode) {
            const { tasks } = state

            const updatedTasks = tasks.map((task, i) => {
                if (Number(state.editMode) === i) {
                    task = state.newTask
                }
                return task
            })

            setState(prev => ({
                ...prev,
                tasks: updatedTasks,
                newTask
            }))
            return

        }
        setState(prev => ({
            ...prev,
            tasks: [
                prev.newTask,
                ...prev.tasks
            ],
            newTask
        }))
    }

    const toggleDescription = index => {
        const { tasks } = state

        const updatedTasks = tasks.map((task, i) => {
            if (index === i) {
                task.visibleDescription = !task.visibleDescription
            }
            return task
        })

        setState(prev => ({
            ...prev,
            tasks: updatedTasks,
            newTask
        }))
    }

    const handleRemove = index => {
        const { tasks } = state

        const updatedTasks = tasks.filter((task, i) => {
            return index !== i
        })

        setState(prev => ({
            ...prev,
            tasks: updatedTasks,
            newTask
        }))
    }

    const handleEdit = index => {
        setEditMode(String(index))
        const { tasks } = state

        const currentElement = tasks[index]

        setState(prev => ({
            ...prev,
            newTask: currentElement
        }))
    }

    const setEditMode = (editMode = false) => {
        setState(prev => ({
            ...prev,
            editMode
        }))
    }

    const handleComplete = (e, index) => {
        const { checked } = e.target
        const { tasks } = state

        const updatedTasks = tasks.map((task, i) => {
            if (index === i) {
                task.completed = checked
            }
            return task
        })

        setState(prev => ({
            ...prev,
            tasks: updatedTasks,
            newTask
        }))
    }

    const handleSetActiveTab = activeTabId => {
        setState(prev => ({
            ...prev,
            activeTabId
        }))
    }

    const isItemVisible = isCompleted => {
        if (state.activeTabId === 0) {
            return true
        } else if (state.activeTabId === 1 && isCompleted) {
            return true
        } else if (state.activeTabId === 2 && !isCompleted) {
            return true
        }
        return false
    }

    const getTasks = () => {
        const { tasks } = state

        const updatedTasks = tasks.filter(task => {
            return isItemVisible(task.completed)
        })
        return updatedTasks
    }

    return (
        <div className="container">
            <div className="col">
                <div className='row'>
                    <b className="top" onClick={() => {
                    }}>
                        <Link className='links' to={`/`}>Back to projects</Link>
                    </b>
                </div>
                <div className="row">
                    <input type="text" placeholder="Task name..." onChange={handleChange} name="name" value={state.newTask.name} />
                </div>
                <div className="row">
                    <textarea placeholder="Description..." onChange={handleChange} name="description" value={state.newTask.description}></textarea>
                </div>
                <div className="row">
                    <b>Priority: &nbsp;</b><select placeholder="Priority..." onChange={handleChange} name="priority" value={state.newTask.priority}>
                        <option>Normal</option>
                        <option>Medium</option>
                        <option>Urgent</option>
                    </select>
                </div>
                <div className="row">
                    <b>Deadline: &nbsp;&nbsp;</b><input type="date" onChange={handleChange} name="deadline" value={state.newTask.deadline}></input>
                </div>
                <div className="row">
                    <i className='names' hidden={state.newTask.name.length > 1 && state.newTask.description.length > 1} >Please fill in all fields, or the "Add" button won't work.</i>
                </div>
                <button disabled={state.newTask.name.length < 1 || state.newTask.description.length < 1 || state.newTask.deadline.length < 1} onClick={handleAdd}>
                    {state.editMode ? 'Save task' : 'Add task'}
                </button>&nbsp;
                <ul className="status">
                    <li className={state.activeTabId === 0 ? 'active' : ''} onClick={() => {
                        handleSetActiveTab(0)
                    }}>
                        <b>All tasks</b>
                    </li>
                    <li className={state.activeTabId === 1 ? 'active' : ''} onClick={() => {
                        handleSetActiveTab(1)
                    }}>
                        <b>Fulfilled</b>
                    </li>
                    <li className={state.activeTabId === 2 ? 'active' : ''} onClick={() => {
                        handleSetActiveTab(2)
                    }}>
                        <b>Unfulfilled</b>
                    </li>
                </ul>&nbsp;
                <ul className="list">
                    {getTasks().map((task, i) =>
                        <li key={task.name}>
                            <div className="row">
                                <div>
                                    <input type="checkbox" checked={task.completed} onChange={e => {
                                        handleComplete(e, i)
                                    }} />
                                    <b className='links' onClick={() => {
                                    }}>
                                        {task.name}
                                    </b>
                                    <span className="description" onClick={() => {
                                        toggleDescription(i)
                                    }}>
                                        {'[Show description]'}
                                    </span>
                                </div>
                                <div className="options">
                                    <span className="edit" onClick={() => {
                                        handleEdit(i)
                                    }}>
                                        {'[Edit]'}
                                    </span>
                                    <span className="delete" onClick={() => {
                                        handleRemove(i)
                                    }}>
                                        {'[Remove]'}
                                    </span>
                                </div>
                            </div>
                            {task.visibleDescription ?
                                <><p className="row">
                                    <b>Description: &nbsp;</b>{task.description}
                                </p><p className="row">
                                        <b>Priority: &nbsp;</b>{task.priority}
                                    </p><p className="row">
                                        <b>Deadline: &nbsp;</b>{task.deadline}
                                    </p></>
                                :
                                <>
                                </>
                            }
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Tasks