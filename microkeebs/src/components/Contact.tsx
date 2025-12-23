import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '@/lib/utils';
import Lanyard from './Lanyard/Lanyard';
import LogoWall from './LogoWall';

const aboutText = `I entered the keyboard hobby in early 2021. I was active immediately, but I didn't build my first custom board until mid-2022. That was the start of the channel. I wanted a place to catalog the keyboards passing through my hands.

I started out streaming and creating content in Spanish. Commissions were a practical necessity since I could not afford to buy every board I wanted to try. I also produced educational videos to help expand the hobby locally. I am not great at dealing with people, so when I stopped taking orders, I ran out of things to film. I took a hiatus from late 2022 to July 2023. I was still around, just not posting.

I eventually returned with better equipment and a switch to English. I wanted a wider audience. I picked up the pace, making more guides and general content. Brands and friends began sending me units for review. This allowed me to keep the schedule full.

It led to burnout. Build videos took days to finish but received little support. I stopped doing them for fun and started doing them out of obligation. The quality dropped. In my opinion, this hobby does not reward long-duration videos unless you are already established or rely on clickbait. It wasn't sustainable, so I stopped.

Now I just do what I love. I don't feel forced to make anything I don't want to make. This freedom helped me develop a personal style and improve my output. I record everything on an iPhone these days. If you hadn't noticed, that is a sign I am doing a good job. I plan to keep this mindset for the boards to come.`;

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