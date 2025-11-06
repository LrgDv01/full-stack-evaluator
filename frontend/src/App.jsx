import './styles/App.css'
import Tasks from "./pages/Tasks/Tasks"
import UserForm from './components/UserForm';

function App() {
  return (
    <div className="app">
      <UserForm onSuccess={() => console.log('Success!')} />
      <h1 className='font-bold text-5xl'>📝 React Task Evaluator</h1>
      <Tasks />
    </div>
  );
}

export default App
