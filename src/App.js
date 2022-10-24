import './assets/style.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Error404 from "./components/Error404"
import Projects from "./components/Projects"
import Tasks from "./components/Tasks"

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Projects />} />
                    <Route path="/:projects/:projectName" element={<Tasks />} />
                    <Route path="/*" element={<Error404 />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App