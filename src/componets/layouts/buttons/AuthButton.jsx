import React from 'react';

const AuthButton = () => {
  return (
    <div className="hidden md:flex items-center gap-4">
      <button className="border px-5 rounded-md py-2 bg-primary text-white">Log In</button>
      <button className="border border-primary-content px-5 py-2 rounded-md">Sign Up</button>
    </div>
  );
};

export default AuthButton;
