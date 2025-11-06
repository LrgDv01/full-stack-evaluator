import styles from './Button.module.css';

export default function Button({ label, onClick }) {
  return (
    <div>
      <button 
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        onClick={onClick}
      >
        {label}
      </button>

      <button className={styles.button}>Add Task</button>
      <button className='bg-blue-500 p-2 m-3 w-1/4'>Update Task</button>
      <button className='bg-blue-500 p-2 m-3 w-1/4'>Delete Task</button>
    </div>
  );
}
