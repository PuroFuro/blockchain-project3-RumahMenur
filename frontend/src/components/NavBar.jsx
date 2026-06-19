import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import AnimatedButton from './AnimatedButtons';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full font-sans transition-colors duration-300 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto my-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-3 cursor-pointer">
            <img src={logo} alt="Voting dApp" className="logo" />
            <span className="text-xl font-bold text-tulisan font-mono">
              Voting dApp
            </span>
          </div>

          {/* Center/Right Side: Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/vote" className="text-tulisan opacity-80 hover:opacity-100 font-medium transition-opacity">
              Vote
            </Link>
            <Link to="/results" className="text-tulisan opacity-80 hover:opacity-100 font-medium transition-opacity">
              Results
            </Link>
            <Link to="/admin" className="text-tulisan opacity-80 hover:opacity-100 font-medium transition-opacity">
              Admin
            </Link>
            <AnimatedButton className="primary-btn text-sm">
              Connect Wallet
            </AnimatedButton>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-tulisan focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pt-2 pb-4 space-y-3 flex flex-col">
          <Link to="/vote" className="text-tulisan font-medium py-1">
            Vote
          </Link>
          <Link to="/results" className="text-tulisan font-medium py-1">
            Results
          </Link>
          <Link to="/admin" className="text-tulisan font-medium py-1">
            Admin
          </Link>
          <AnimatedButton className="primary-btn w-full mt-2">
            Connect Wallet
          </AnimatedButton>
        </div>
      )}
    </nav>
  );
}