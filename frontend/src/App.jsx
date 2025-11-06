import './styles/App.css'
import Tasks from "./pages/Tasks/Tasks"

function App() {
  return (
    <div className="app">
      <h1 className='font-bold text-5xl'>📝 React Task Evaluator</h1>
      <Tasks />
    </div>
  );
}

export default App
