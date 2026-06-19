import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import AnimatedButton from './AnimatedButtons';
import { Link, NavLink } from 'react-router-dom';
import { shortenAddress } from '../utils/helpers';

export default function Navbar({ account, connecting, hasMetaMask, onConnect }) {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `font-medium transition-opacity ${
      isActive
        ? 'text-accent opacity-100'
        : 'text-tulisan opacity-80 hover:opacity-100'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `font-medium py-1 ${isActive ? 'text-accent' : 'text-tulisan'}`;

  const walletLabel = !hasMetaMask
    ? 'Install MetaMask'
    : account
    ? shortenAddress(account)
    : connecting
    ? 'Connecting…'
    : 'Connect Wallet';

  const handleWallet = () => {
    if (!hasMetaMask) {
      window.open('https://metamask.io/download/', '_blank', 'noreferrer');
      return;
    }
    if (!account) onConnect?.();
  };

  return (
    <nav className="w-full font-sans transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto my-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/">
            <div className="flex items-center space-x-3 cursor-pointer">
                <img src={logo} alt="Voting dApp" className="logo" />
                <span className="text-xl font-bold text-tulisan font-mono">
                Voting dApp
                </span>
            </div>
          </Link>

          {/* Center/Right Side: Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/vote" className={linkClass}>
              Vote
            </NavLink>
            <NavLink to="/results" className={linkClass}>
              Results
            </NavLink>
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
            <AnimatedButton
              className="primary-btn text-sm"
              onClick={handleWallet}
            >
              {walletLabel}
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
          <NavLink to="/vote" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
            Vote
          </NavLink>
          <NavLink to="/results" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
            Results
          </NavLink>
          <NavLink to="/admin" className={mobileLinkClass} onClick={() => setIsOpen(false)}>
            Admin
          </NavLink>
          <AnimatedButton
            className="primary-btn w-full mt-2"
            onClick={handleWallet}
          >
            {walletLabel}
          </AnimatedButton>
        </div>
      )}
    </nav>
  );
}