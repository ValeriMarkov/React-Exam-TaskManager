import { useState, useEffect } from 'react'
import '../App'
import '../assets/style.css'
import './Tasks'
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


const newProject = {
    id: uuidv4(),
    name: '',
    description: '',
    visibleDescription: false,
}

const App = () => {
    const [state, setState] = useState(getProjectValues);

    const handleChange = e => {
        const { name, value } = e.target

        setState(prev => ({
            ...prev,
            newProject: {
                ...prev.newProject,
                [name]: value
            }
        }))
    }

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(state))
    }, [state]);

    function getProjectValues() {
        const storedProjects = JSON.parse(localStorage.getItem('projects'));
        if (!storedProjects) return {
            name: '',
            description: '',
            visibleDescription: false
        };
        return storedProjects;
    }

    const handleAdd = () => {
        setEditMode(false)
        if (state.editMode) {
            const { projects } = state

            const updatedProjects = projects.map((project, i) => {
                if (Number(state.editMode) === i) {
                    project = state.newProject
                }
                return project
            })

            setState(prev => ({
                ...prev,
                projects: updatedProjects,
                newProject
            }))
            return

        }
        setState(prev => ({
            ...prev,
            projects: [
                prev.newProject,
                ...prev.projects
            ],
            newProject
        }))
    }

    const toggleDescription = index => {
        const { projects } = state

        const updatedProjects = projects.map((project, i) => {
            if (index === i) {
                project.visibleDescription = !project.visibleDescription
            }
            return project
        })

        setState(prev => ({
            ...prev,
            projects: updatedProjects,
            newProject
        }))
    }

    const handleRemove = index => {
        const { projects } = state

        const updatedProjects = projects.filter((project, i) => {
            return index !== i
        })

        setState(prev => ({
            ...prev,
            projects: updatedProjects,
            newProject
        }))
    }

    const handleEdit = index => {
        setEditMode(String(index))
        const { projects } = state

        const currentElement = projects[index]

        setState(prev => ({
            ...prev,
            newProject: currentElement
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
        const { projects } = state

        const updatedProjects = projects.map((project, i) => {
            if (index === i) {
                project.completed = checked
            }
            return project
        })

        setState(prev => ({
            ...prev,
            projects: updatedProjects,
            newProject
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

    const handleSetActiveTab = activeTabId => {
        setState(prev => ({
            ...prev,
            activeTabId
        }))
    }

    const getProjects = () => {
        const { projects } = state

        const updatedProjects = projects.filter(project => {
            return isItemVisible(project.completed)
        })
        return updatedProjects
    }

    return (
        <div className="container">
            <div className="col">
                <div className="row">
                    <input type="text" required placeholder="Project name..." onChange={handleChange} name="name" value={state.newProject.name} />
                </div>
                <div className="row">
                    <textarea placeholder="Description..." required onChange={handleChange} name="description" value={state.newProject.description}></textarea>
                </div>
                <div className="row">
                    <i className='names' hidden={state.newProject.name.length > 1 && state.newProject.description.length > 1} >Please fill in all fields, or the "Add" button won't work.</i>
                </div>
                <button disabled={state.newProject.name.length < 1 || state.newProject.description.length < 1} onClick={handleAdd}>
                    {state.editMode ? 'Save project' : 'Add project'}
                </button>&nbsp;
                <ul className="status">
                    <li className={state.activeTabId === 0 ? 'active' : ''} onClick={() => {
                        handleSetActiveTab(0)
                    }}>
                        <b>All projects</b>
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
                    {getProjects().map((project, i) =>
                        <li key={project.id}>
                            <div className="row">
                                <div>
                                    <input type="checkbox" checked={project.completed} onChange={e => {
                                        handleComplete(e, i)
                                    }} />&nbsp;
                                    <b onClick={() => {
                                    }}>
                                        <Link className="links" key={project.id} to={`/projects/${project.name}`}>{project.name}</Link>&nbsp;
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
                            {project.visibleDescription ?
                                <p className="row">
                                    {project.description}
                                </p>
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

export default App