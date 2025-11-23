import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { Send, MapPin, Clock3 } from 'lucide-react';

const focusAreas = [
  'Sound design & tuning',
  'Educational content',
  'Live build coverage',
  'Product feedback',
];

export function Contact() {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen relative overflow-hidden`}>
      <div className="contact-grid" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 relative z-10 space-y-16">
        <div className="space-y-4 text-center">
          <p className={`tracking-[0.4em] text-xs uppercase ${isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/70'}`}>
            Microkeebs
          </p>
          <h1 className={`text-4xl sm:text-5xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
            Let's build something unforgettable
          </h1>
          <p className={`max-w-2xl mx-auto text-sm sm:text-base ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
            Collaborations, commissions, product feedback, content ideas—my inbox is open for projects that push the keyboard scene forward.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`p-8 rounded-3xl border ${isDark ? 'border-[#2f2f2f] bg-[#121212]' : 'border-[#c7c3b3] bg-[#d6d3c4]'} shadow-2xl shadow-black/20`}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className={`text-sm uppercase tracking-[0.3em] ${isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/60'}`}>Direct Line</p>
                <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1c1c1c]'} mt-2`}>
                  Say hi anytime
                </h2>
              </div>
              <Send className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} w-8 h-8`} />
            </div>

            <div className={`contact-email ${isDark ? 'contact-email--dark' : 'contact-email--light'}`}>
              <a href="mailto:microkeebs@gmail.com" className="inline-flex items-center gap-2 text-lg font-semibold">
                microkeebs@gmail.com
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border ${isDark ? 'border-[#2f2f2f]' : 'border-[#c7c3b3]'}`}>
                <p className={`text-xs uppercase tracking-[0.3em] mb-2 ${isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/60'}`}>Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Madrid, Spain</span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl border ${isDark ? 'border-[#2f2f2f]' : 'border-[#c7c3b3]'}`}>
                <p className={`text-xs uppercase tracking-[0.3em] mb-2 ${isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/60'}`}>Timezone</p>
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4" />
                  <span className="text-sm">CET / GMT+1</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`p-8 rounded-3xl border ${isDark ? 'border-[#2f2f2f] bg-[#171717]' : 'border-[#c7c3b3] bg-[#e3dfcf]'} shadow-lg shadow-black/10`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/60'}`}>Focus</p>
              <h2 className={`text-2xl font-semibold mt-3 ${isDark ? 'text-white' : 'text-[#1c1c1c]'}`}>
                What I love working on
              </h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {focusAreas.map((item) => (
                  <div
                    key={item}
                    className={`contact-chip ${isDark ? 'contact-chip--dark' : 'contact-chip--light'}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'border-[#2f2f2f] bg-[#121212]' : 'border-[#c7c3b3] bg-[#d6d3c4]'} shadow-lg shadow-black/10`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/60'}`}>Follow</p>
              <h2 className={`text-2xl font-semibold mt-3 ${isDark ? 'text-white' : 'text-[#1c1c1c]'}`}>
                Stay in the loop
              </h2>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="https://www.youtube.com/@microkeebs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/microkeebs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@microkeebs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
