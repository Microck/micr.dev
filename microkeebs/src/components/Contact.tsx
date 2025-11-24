import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { SplitText } from './SplitText';
import { MaskedText } from './MaskedText';
import { ScrollVelocity } from './ScrollVelocity';
import { LogoTicker } from './LogoTicker';
import { Youtube, Instagram } from 'lucide-react';

const aboutText = `I'm Marcos, also known as Microkeebs. I joined the keyboard hobby in early 2021 and have been active since then, but I didn't build my first custom keyboard until mid-2022, when I also started Microkeebs as a way to showcase my keyboards.

I began doing streams and content in Spanish, my native language, building keyboards for people who commissioned me, which allowed me to try a lot of keyboards without having to buy each and every one of them, as I couldn't afford it. I also made some educational videos to try and expand the hobby in Spain. I'm not good at dealing with people, so when I closed commissions, I quickly ran out of content to make and lost motivation, so I took a hiatus from December 2022 to July 2023. I was still in the hobby during this time but just didn't create content.

After switching setups and buying some better equipment, I tried to come back to making videos, but this time for a wider audience, so I switched from Spanish to English content. I slowly started picking up the pace again, making more educational videos (this time in English) and creating more content. Brands and friends started sending me keyboards to review, allowing me to create more and more content.

But then I got burned out. Build videos took hours and days to do, but received little to no support. I stopped doing them because I liked it and started making them because "I had to," which obviously decreased the quality of those videos and made them unsustainable in the long run. So I decided to stop. In my opinion, the keyboard hobby is not made for long-duration videos unless you're already established or decide to clickbait/follow trends.

I have gone back to doing just what I love, without feeling obliged to do anything I don't feel like doing. This has allowed me to develop a certain personal style and improve my videos' quality over time (as of the time of writing this, my videos are recorded with an iPhone, and if you hadn't noticed, that's a sign that I'm doing a good job). I will keep making content with this mindset, looking forward to what I hope will be many more keyboards to come!`;

const clients = [
  'Keychron',
  'Epomaker',
  'Akko',
  'Womier',
  'Nuphy',
  'Royal Kludge',
  'Glorious',
  'Lemokey',
  'Monsgeek'
];

const TikTokIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04.01z"/>
  </svg>
);

export function Contact() {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen relative overflow-hidden`}>
      <div className="contact-grid" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 relative z-10">
        
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto mb-24">
          <SplitText 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-8 ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}
          >
            Building Keyboards Creating Content
          </SplitText>
          
          <p className={`text-center text-lg sm:text-xl max-w-3xl mx-auto ${
            isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
          }`}>
            A passion project turned into a journey through mechanical keyboards, sound design, and content creation
          </p>
        </div>

        {/* About Me Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <MaskedText 
            className={`text-3xl sm:text-4xl font-bold mb-8 ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}
            delay={200}
          >
            About Me
          </MaskedText>
          
          <div className={`space-y-6 text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-[#a7a495]/90' : 'text-[#1c1c1c]/90'
          }`}>
            {aboutText.split('\n\n').map((paragraph, index) => (
              <MaskedText 
                key={index} 
                delay={400 + index * 100}
              >
                {paragraph}
              </MaskedText>
            ))}
          </div>
        </div>

        {/* Email Section with Scroll Velocity */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-8 text-center ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}>
            Get in Touch
          </h2>
          
          <div className={`text-center p-12 rounded-3xl border ${
            isDark 
              ? 'bg-[#121212] border-[#2f2f2f]' 
              : 'bg-[#d6d3c4] border-[#c7c3b3]'
          }`}>
            <ScrollVelocity 
              className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
              baseVelocity={0.5}
            >
              microkeebs@gmail.com
            </ScrollVelocity>
            
            <a
              href="mailto:microkeebs@gmail.com"
              className={`inline-block mt-8 px-8 py-4 rounded-full border-2 transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 ${
                isDark
                  ? 'border-[#a7a495] text-[#a7a495] hover:bg-[#a7a495] hover:text-[#1c1c1c]'
                  : 'border-[#1c1c1c] text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-[#b5b3a7]'
              }`}
            >
              Send an Email
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="max-w-4xl mx-auto mb-24">
          <h3 className={`text-xl sm:text-2xl font-bold mb-8 text-center ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}>
            Follow the Journey
          </h3>
          
          <div className="flex justify-center gap-8">
            <a
              href="https://www.youtube.com/@microkeebs"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 transition-all duration-300 ease-out hover:scale-110 ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              <Youtube size={32} />
              <span className="text-sm">YouTube</span>
            </a>
            
            <a
              href="https://www.instagram.com/microkeebs/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 transition-all duration-300 ease-out hover:scale-110 ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              <Instagram size={32} />
              <span className="text-sm">Instagram</span>
            </a>
            
            <a
              href="https://www.tiktok.com/@microkeebs"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 transition-all duration-300 ease-out hover:scale-110 ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              <TikTokIcon size={32} />
              <span className="text-sm">TikTok</span>
            </a>
          </div>
        </div>

        {/* Clients Ticker */}
        <LogoTicker items={clients} title="Worked with" />

        <Footer />
      </div>
    </div>
  );
}
