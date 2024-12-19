function DisplayMnemonic({ mnemonics, onGenerateMnemonic }) {
  return (
    <div className="flex flex-col items-center space-y-6 p-6 max-w-lg mx-auto bg-gray-800 text-white">
      <button
        onClick={onGenerateMnemonic}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Generate Mnemonics
      </button>
    </div>
  );
}

export default DisplayMnemonic;
