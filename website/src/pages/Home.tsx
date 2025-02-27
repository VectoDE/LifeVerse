import React from 'react';
import logo from '../assets/logo.svg';
import Navbar from '../components/Navbar';

function App() {
  return (
    <div className="text-center">
      <Navbar />
      <header className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_infinite_linear]"
          alt="logo"
        />
        <p className="text-xl md:text-2xl">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
