
import React from 'react';
import { NewsItem, Language } from '../types';

interface NewsTickerProps {
  news: NewsItem[];
  position: 'Top' | 'Bottom';
  lang: Language;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ news, position, lang }) => {
  const activeNews = news.filter(n => {
    if (!n.isActive || n.position !== position) return false;
    
    const now = new Date();
    const start = new Date(n.startDate);
    const end = new Date(n.endDate);
    
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return now >= start && now <= end;
  });

  if (activeNews.length === 0) return null;

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'Breaking': return 'bg-red-600 text-white shadow-lg ring-2 ring-red-400 animate-pulse';
      case 'Alert': return 'bg-amber-500 text-black shadow-md ring-2 ring-amber-300';
      case 'General': return 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-600';
      default: return 'bg-slate-900 text-white shadow-sm';
    }
  };

  const getSpeedDuration = (speed: string) => {
    switch(speed) {
      case 'Slow': return '45s';
      case 'Fast': return '12s';
      default: return '25s';
    }
  };

  return (
    <div className={`w-full overflow-hidden bg-black border-y-2 border-amber-400 flex items-center h-14 z-[40] relative shadow-2xl ${position === 'Bottom' ? 'mt-auto rounded-b-3xl' : 'rounded-t-3xl mb-4'}`}>
      {/* Industrial Caution Tape Left Edge */}
      <div className="flex-none w-4 h-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)] opacity-80"></div>
      
      <div className="flex-none bg-black px-6 h-full flex items-center z-50 border-r border-amber-400/30">
        <span className="text-[11px] font-black text-amber-400 uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-3">
          <i className="fa-solid fa-tower-broadcast text-sm"></i>
          {lang === 'en' ? 'SATELLITE BROADCAST' : 'ระบบข่าวสารแบบเรียลไทม์'}
        </span>
      </div>

      <div className="flex-1 relative flex items-center overflow-hidden h-full bg-black">
        <div 
          className="whitespace-nowrap flex items-center gap-16 absolute animate-marquee-dynamic"
          style={{ animationDuration: getSpeedDuration(activeNews[0].speed) }}
        >
          {activeNews.concat(activeNews).map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-6">
              <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${getTypeStyle(item.type)}`}>
                {item.type}
              </span>
              <span className="text-sm font-black text-white tracking-wide uppercase font-mono">
                {item.text}
              </span>
              <span className="text-amber-400 font-black opacity-40">::</span>
            </div>
          ))}
        </div>
      </div>

      {/* Industrial Caution Tape Right Edge */}
      <div className="flex-none w-4 h-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)] opacity-80"></div>

      <style>{`
        @keyframes marquee-dynamic {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-dynamic {
          animation: marquee-dynamic linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
