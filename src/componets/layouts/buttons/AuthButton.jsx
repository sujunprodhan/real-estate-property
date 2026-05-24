import React from 'react';

const AuthButton = () => {
  return (
    <div className="hidden md:flex items-center gap-3 ml-2">
      <button className="btn rounded-full px-6 font-semibold bg-transparent border border-base-content/30 hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors">
        Log In
      </button>
      <button className="btn btn-primary rounded-full px-8 font-semibold shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-300 border-none text-white">
        Sign Up
      </button>
    </div>
  );
};

export default AuthButton;
