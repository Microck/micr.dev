import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '@/lib/utils';
import Lanyard from './Lanyard/Lanyard';
import LogoWall from './LogoWall';

const aboutText = `I'm Marcos, also known as Microkeebs. I joined the keyboard hobby in early 2021 and have been active since then, but I didn't build my first custom keyboard until mid-2022, when I also started Microkeebs as a way to showcase my keyboards.

I began doing streams and content in Spanish, my native language, building keyboards for people who commissioned me, which allowed me to try a lot of keyboards without having to buy each and every one of them, as I couldn't afford it. I also made some educational videos to try and expand the hobby in Spain. I'm not good at dealing with people, so when I closed commissions, I quickly ran out of content to make and lost motivation, so I took a hiatus from December 2022 to July 2023. I was still in the hobby during this time but just didn't create content.

After switching setups and buying some better equipment, I tried to come back to making videos, but this time for a wider audience, so I switched from Spanish to English content. I slowly started picking up the pace again, making more educational videos (this time for a wider audience) and creating more content. Brands and friends started sending me keyboards to review, allowing me to create more and more content.

But then I got burned out. Build videos took hours and days to do, but received little to no support. I stopped doing them because I liked it and started making them because "I had to," which obviously decreased the quality of those videos and made them unsustainable in the long run. So I decided to stop. In my opinion, the keyboard hobby is not made for long-duration videos unless you're already established or decide to clickbait/follow trends.

I have gone back to doing just what I love, without feeling obliged to do anything I don't feel like doing. This has allowed me to develop a certain personal style and improve my videos' quality over time (as of the time of writing this, my videos are recorded with an iPhone, and if you hadn't noticed, that's a sign that I'm doing a good job). I will keep making content with this mindset, looking forward to what I hope will be many more keyboards to come!`;

const clients = [
  {
    "name": "Bowl Keyboards",
    "logo": "/microkeebs/workedwith/bowlkeyboards.webp",
    "width": 7,
    "height": 10,
    "margin": 0.75
  },
  {
    "name": "Chilkey",
    "logo": "/microkeebs/workedwith/chilkey.png",
    "width": 9,
    "height": 6.5,
    "margin": 0
  },
  {
    "name": "Luminkey",
    "logo": "/microkeebs/workedwith/luminkey.png",
    "width": 12,
    "height": 6,
    "margin": 1
  },
  {
    "name": "Akko",
    "logo": "/microkeebs/workedwith/akko.png",
    "width": 12,
    "height": 6,
    "margin": 1
  },
  {
    "name": "Baionlenja",
    "logo": "/microkeebs/workedwith/baionlenja.png",
    "width": 12,
    "height": 6,
    "margin": 1
  },
  {
    "name": "CtrlVLC",
    "logo": "/microkeebs/workedwith/ctrlvlc.png",
    "width": 12,
    "height": 6,
    "margin": 1
  },
  {
    "name": "MetaKeebs",
    "logo": "/microkeebs/workedwith/metakeebs.png",
    "width": 6.5,
    "height": 6,
    "margin": 1
  },
  {
    "name": "Monsgeek",
    "logo": "/microkeebs/workedwith/monsgeek.png",
    "width": 10,
    "height": 9,
    "margin": 0.75
  },
  {
    "name": "TKD",
    "logo": "/microkeebs/workedwith/tkd.png",
    "width": 6.5,
    "height": 6,
    "margin": 1
  },
  {
    "name": "Vertex",
    "logo": "/microkeebs/workedwith/vertex.png",
    "width": 12,
    "height": 6,
    "margin": 1
  }
];

function AboutSection({ isDark }: { isDark: boolean }) {
  return (
    <div className="w-full">
      <div style={{ transform: 'translate(457px, 0px)' }} className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn(
            'text-7xl sm:text-8xl md:text-9xl font-bold leading-none',
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          )}
        >
          About
        </motion.h1>
      </div>

      <div className={cn("text-xl sm:text-2xl leading-relaxed text-justify mb-12 max-w-4xl", isDark ? "text-[#a7a495]" : "text-[#1c1c1c]")}>
        {aboutText.split('\n\n').map((paragraph, index) => {
          let transformStyle = {};
          if (index === 0) transformStyle = { transform: 'translate(121px, -2px)' };
          if (index === 2) transformStyle = { transform: 'translate(200px, -1px)' };
          if (index === 3) transformStyle = { transform: 'translate(71px, 0px)' };
          if (index === 4) transformStyle = { transform: 'translate(128px, 4px)' };
          
          return (
            <p key={index} className="mb-6 last:mb-0" style={transformStyle}>
              {paragraph}
            </p>
          );
        })}
      </div>
    </div>
  );
}

interface WorkedWithSectionProps {
  isDark: boolean;
  fadeStart: string;
  fadeEnd: string;
}

function WorkedWithSection({ 
  isDark, 
  fadeStart = "45", 
  fadeEnd = "55", 
}: WorkedWithSectionProps) {
  const textColor = isDark ? '#a7a495' : '#1c1c1c';
  
  return (
    <div className="py-4 w-full overflow-hidden">
      <h3
        className={cn(
          'text-sm font-light mb-4 text-center uppercase tracking-[0.3em] mt-32',
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        )}
        style={{ transform: 'translate(0px, 42px)' }}
      >
        Worked With
      </h3>
      
      <div className="w-full relative">
        <LogoWall
          items={clients.map((client) => {
            return (
              <div 
                key={client.name} 
                className="flex items-center justify-center transition-all duration-300"
                style={{ 
                  height: `${client.height}rem`, 
                  width: `${client.width}rem`,
                  marginLeft: `${client.margin}rem`,
                  marginRight: `${client.margin}rem`
                }}
              >
                 <div 
                   className={cn(
                     "w-full h-full transition-all duration-300 opacity-80 hover:opacity-100",
                     isDark ? "bg-[#a7a495]" : "bg-black"
                   )}
                   style={{
                     maskImage: `url(${client.logo})`,
                     WebkitMaskImage: `url(${client.logo})`,
                     maskSize: 'contain',
                     WebkitMaskSize: 'contain',
                     maskRepeat: 'no-repeat',
                     WebkitMaskRepeat: 'no-repeat',
                     maskPosition: 'center',
                     WebkitMaskPosition: 'center'
                   }}
                   role="img"
                   aria-label={client.name}
                 />
              </div>
            );
          })}
          direction="horizontal"
          pauseOnHover={true}
          size="clamp(4rem, 1rem + 10vmin, 10rem)"
          duration="40s"
          bgColor="transparent"
          bgAccentColor="transparent"
          textColor={textColor}
          gap="0px" // Using per-item margin instead
          fadeStart={`${fadeStart}%`}
          fadeEnd={`${fadeEnd}%`}
        />
      </div>
    </div>
  );
}

function GiantEmailSection({ isDark }: { isDark: boolean }) {
  const fontSize = 11.7;
  const marginBottom = -1.8;
  const marginLeft = -0.5;

  return (
    <div className="w-full mt-16 overflow-hidden">
      <motion.a
        href="mailto:contact@micr.dev"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className={cn(
          'block text-center font-bold cursor-pointer select-none w-full leading-none',
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        )}
        style={{
          fontSize: `${fontSize}vw`,
          marginBottom: `${marginBottom}vw`,
          marginLeft: `${marginLeft}vw`
        }}
      >
        contact@micr.dev
      </motion.a>
    </div>
  );
}

export function Contact() {
  const { isDark } = useTheme();

  const contentX = 0;
  const contentY = 0;
  const contentScale = 1;

  const fadeStart = 42.5;
  const fadeEnd = 57.5;

  return (
    <div className={cn('min-h-screen relative overflow-hidden', isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]')}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <Suspense fallback={null}>
          <div className="w-full h-full pointer-events-auto">
            <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} fov={40} transparent />
          </div>
        </Suspense>
      </div>

      <div 
        className="relative z-10 pointer-events-none"
        style={{
          transform: `translate(${contentX}px, ${contentY}px) scale(${contentScale})`,
          transformOrigin: 'top center'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-8 lg:gap-16">
            <div className="hidden lg:block" />
            <div className="pointer-events-auto">
              <AboutSection isDark={isDark} />
            </div>
          </div>
        </div>

        <div className="pointer-events-auto w-full">
          <WorkedWithSection 
            isDark={isDark} 
            fadeStart={`${fadeStart}`}
            fadeEnd={`${fadeEnd}`}
          />
          <GiantEmailSection isDark={isDark} />
        </div>
      </div>
    </div>
  );
}