import { Link } from 'react-router-dom';

export function Header() {
  // TODO: Replace with actual user data from auth context
  const user = { name: 'Irena Pasic', company: 'Valipat S.A.', initials: 'IP' };

  return (
    <header className="bg-navy h-14 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 relative">
            <div className="w-[18px] h-[18px] border-[2.5px] border-gold rounded-[3px] rotate-45 absolute top-[5px] left-[5px]" />
            <div className="w-3.5 h-3.5 border-2 border-gold-light rounded-[2px] rotate-45 absolute top-[7px] left-[7px]" />
          </div>
          <span className="text-white text-lg font-bold">Valipat</span>
        </Link>
        <span className="text-gray-400 text-xs hidden sm:inline">
          PCT National / Regional Phase Entries
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-xs hidden md:inline">
          {user.name} · {user.company}
        </span>
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-xs font-bold">
          {user.initials}
        </div>
      </div>
    </header>
  );
}
