
export default function Button({ label, onClick }) {
  return (
    <div>
      <button 
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        onClick={onClick}
      >
        {label}
      </button>

    </div>
  );
}
