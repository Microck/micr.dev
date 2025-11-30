import { AnimatedIcon } from './icons/AnimatedIcon';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { SplitText } from './SplitText';
import { VariableProximity } from './VariableProximity';
import { LogoTicker } from './LogoTicker';

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

export function Contact() {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 py-24 sm:py-32">
        
        {/* Minimalist Hero */}
        <div className="mb-32 sm:mb-48">
          <SplitText 
            className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-12 ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}
          >
            Building Keyboards Creating Content
          </SplitText>
        </div>

        {/* About Section */}
        <div className="mb-32 sm:mb-48">
          <h2 className={`text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-bold mb-16 leading-none ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}>
            About
          </h2>
          
          <div className={`space-y-8 text-xl sm:text-2xl md:text-3xl leading-relaxed max-w-4xl ${
            isDark ? 'text-[#a7a495]/90' : 'text-[#1c1c1c]/90'
          }`}>
            {aboutText.split('\n\n').map((paragraph, index) => (
              <VariableProximity
                key={index}
                text={paragraph}
                className="block"
                radius={200}
                falloff="exponential"
                minWeight={300}
                maxWeight={700}
              />
            ))}
          </div>
        </div>

        {/* Email Section */}
        <div className="mb-32 sm:mb-48 py-24 border-y-2" style={{
          borderColor: isDark ? '#a7a495' : '#1c1c1c'
        }}>
          <div className="text-center">
            <h3 className={`text-3xl sm:text-4xl font-light mb-8 uppercase tracking-widest ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}>
              Get in Touch
            </h3>
            
            <div className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-12 ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}>
              microkeebs@gmail.com
            </div>
            
            <a
              href="mailto:microkeebs@gmail.com"
              className={`inline-block px-12 py-5 text-xl transition-all duration-300 ease-out cursor-target border-2 ${
                isDark
                  ? 'border-[#a7a495] text-[#a7a495] hover:bg-[#a7a495] hover:text-[#1c1c1c]'
                  : 'border-[#1c1c1c] text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-[#a7a495]'
              }`}
            >
              Send Email
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-32 sm:mb-48">
          <div className="flex justify-center gap-16 sm:gap-24">
            <a
              href="https://www.youtube.com/@microkeebs"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-4 transition-all duration-300 ease-out hover:scale-110 cursor-target ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              <AnimatedIcon name="youtube" size={48} />
              <span className="text-sm uppercase tracking-wider">YouTube</span>
            </a>

            <a
              href="https://www.instagram.com/microkeebs/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-4 transition-all duration-300 ease-out hover:scale-110 cursor-target ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              <AnimatedIcon name="instagram" size={48} />
              <span className="text-sm uppercase tracking-wider">Instagram</span>
            </a>

            <a
              href="https://www.tiktok.com/@microkeebs"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-4 transition-all duration-300 ease-out hover:scale-110 cursor-target ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              <AnimatedIcon name="tiktok" size={48} />
              <span className="text-sm uppercase tracking-wider">TikTok</span>
            </a>
          </div>
        </div>

        {/* Clients Ticker */}
        <div className="mb-16">
          <h3 className={`text-2xl sm:text-3xl font-light mb-8 text-center uppercase tracking-widest ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}>
            Worked With
          </h3>
          <LogoTicker items={clients} title="Worked with" />
        </div>

        <Footer />
      </div>
    </div>
  );
}
