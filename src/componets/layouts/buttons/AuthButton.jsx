import Link from 'next/link';


const AuthButton = ({ scrolled }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <Link
        href={'/login'}
        className={`btn btn-ghost rounded-full w-full sm:w-28 font-semibold border transition-all flex items-center justify-center ${
          scrolled 
            ? 'border-base-content/20 text-base-content hover:bg-primary/10 hover:text-primary' 
            : 'border-white/30 text-white hover:bg-white/10 hover:text-white'
        }`}
      >
        Login
      </Link>
      <Link
        href={'/register'}
        className="btn btn-primary rounded-full w-full sm:w-28 font-semibold shadow-lg shadow-primary/30 border-none text-white flex items-center justify-center shrink-0"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default AuthButton;
