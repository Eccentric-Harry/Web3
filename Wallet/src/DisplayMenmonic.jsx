function DisplayMenmonic({ mnemonics, onGenerateMnemonic }) {
    return (
      <div className="flex flex-col items-center space-y-6 p-6 max-w-lg mx-auto">
        <button
          onClick={onGenerateMnemonic}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Generate Mnemonics
        </button>
  
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Mnemonic Words</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mnemonics.map((word, index) => (
              <li
                key={index}
                className="bg-gray-100 p-3 rounded-lg text-center text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition duration-300"
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  export default DisplayMenmonic;
  