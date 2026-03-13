import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/use-theme';
import { cn } from '@/lib/utils';
import LogoWall from './LogoWall';
import { SplitText } from './SplitText';
import { ScrollReveal } from './ScrollReveal';
import { InteractiveDivider } from './InteractiveDivider';

// Import logos directly for Vite processing
import bowlLogo from '@/assets/workedwith/bowlkeyboards.webp';
import chilkeyLogo from '@/assets/workedwith/chilkey.png';
import luminkeyLogo from '@/assets/workedwith/luminkey.png';
import akkoLogo from '@/assets/workedwith/akko.png';
import baionLogo from '@/assets/workedwith/baionlenja.png';
import ctrlvlcLogo from '@/assets/workedwith/ctrlvlc.png';
import metakeebsLogo from '@/assets/workedwith/metakeebs.png';
import monsgeekLogo from '@/assets/workedwith/monsgeek.png';
import vertexLogo from '@/assets/workedwith/vertex.png';
import tkdLogo from '@/assets/workedwith/tkd.png';

const Lanyard = lazy(() => import('./Lanyard/Lanyard'));
const ContactMobile = lazy(() =>
  import('./ContactMobile').then((module) => ({ default: module.ContactMobile }))
);

const aboutText = `I entered the keyboard hobby in early 2021. I was active immediately, but I didn't build my first custom board until mid-2022. That was the start of the channel. I wanted a place to catalog the keyboards passing through my hands.

I started out streaming and creating content in Spanish. Commissions were a practical necessity since I could not afford to buy every board I wanted to try. I also produced educational videos to help expand the hobby locally. I am not great at dealing with people, so when I stopped taking orders, I ran out of things to film. I took a hiatus from late 2022 to July 2023. I was still around, just not posting.

I eventually returned with better equipment and a switch to English. I wanted a wider audience. I picked up the pace, making more guides and general content. Brands and friends began sending me units for review. This allowed me to keep the schedule full.

It led to burnout. Build videos took days to finish but received little support. I stopped doing them for fun and started doing them out of obligation. The quality dropped. In my opinion, this hobby does not reward long-duration videos unless you are already established or rely on clickbait. It wasn't sustainable, so I stopped.

Now I just do what I love. I don't feel forced to make anything I don't want to make. This freedom helped me develop a personal style and improve my output. I record everything on an iPhone these days. If you hadn't noticed, that is a sign I am doing a good job. I plan to keep this mindset for the boards to come.`;

const clients = [
  {
    "name": "TKD",
    "logo": tkdLogo,
    "width": 10,
    "height": 6,
    "margin": 1,
    "link": ""
  },
  {
    "name": "Bowl Keyboards",
    "logo": bowlLogo,
    "width": 7,
    "height": 10,
    "margin": 0.4,
    "link": "https://bowlkeyboards.com/"
  },
  {
    "name": "Chilkey",
    "logo": chilkeyLogo,
    "width": 9,
    "height": 6.5,
    "margin": 0,
    "link": "https://chilkey.com/"
  },
  {
    "name": "Luminkey",
    "logo": luminkeyLogo,
    "width": 12,
    "height": 6,
    "margin": 1,
    "link": "https://luminkey.com/"
  },
  {
    "name": "Akko",
    "logo": akkoLogo,
    "width": 12,
    "height": 6,
    "margin": 1,
    "link": "https://en.akkogear.com/"
  },
  {
    "name": "Baionlenja",
    "logo": baionLogo,
    "width": 12,
    "height": 6,
    "margin": 1,
    "link": "https://www.instagram.com/baionlenja/"
  },
  {
    "name": "CtrlVLC",
    "logo": ctrlvlcLogo,
    "width": 12,
    "height": 6,
    "margin": 1,
    "link": "https://www.instagram.com/ctrl.vlc/"
  },
  {
    "name": "MetaKeebs",
    "logo": metakeebsLogo,
    "width": 6.5,
    "height": 6,
    "margin": 1,
    "link": "https://metakeebs.com/"
  },
  {
    "name": "Monsgeek",
    "logo": monsgeekLogo,
    "width": 10,
    "height": 9,
    "margin": 0.75,
    "link": "https://www.monsgeek.com/"
  },
  {
    "name": "Vertex",
    "logo": vertexLogo,
    "width": 12,
    "height": 6,
    "margin": 1,
    "link": "https://www.instagram.com/vtxengine"
  }
];

function AboutSection({ isDark }: { isDark: boolean }) {
  return (
    <div className="w-full flex flex-col items-end text-right">
      <div className="mb-8 w-full max-w-4xl" style={{ transform: 'translate(122px, 1px)' }}>
        <SplitText
          delay={0}
          className={cn(
            'text-7xl sm:text-8xl md:text-9xl font-bold leading-none text-right',
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          )}
        >
          About
        </SplitText>
      </div>

      <div className={cn("text-xl sm:text-2xl leading-relaxed text-justify mb-12 max-w-4xl w-full", isDark ? "text-[#a7a495]" : "text-[#1c1c1c]")}>
        {aboutText.split('\n\n').map((paragraph, index) => {
          const transforms = [
            'translate(121px, -2px)',
            'none',
            'translate(200px, -1px)',
            'translate(71px, 0px)',
            'translate(128px, 4px)'
          ];
          return (
            <ScrollReveal key={index} delay={index * 0.1} className="mb-6 last:mb-0">
              <p style={{ transform: transforms[index] || 'none' }}>{paragraph}</p>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

interface WorkedWithSectionProps {
  isDark: boolean;
}

function WorkedWithSection({ 
  isDark, 
}: WorkedWithSectionProps) {
  const textColor = isDark ? '#a7a495' : '#1c1c1c';
  
  return (
    <div className="py-4 w-full overflow-hidden">
      <h3
        className={cn(
          'text-sm font-light mb-4 text-center uppercase tracking-[0.3em] mt-4',
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        )}
        style={{ transform: 'translate(0px, 42px)' }}
      >
        Worked With
      </h3>

      <div className="w-full relative">
        <LogoWall
          items={clients.map((client) => {
            const isLink = !!client.link;
            const Wrapper = isLink ? 'a' : 'div';
            const wrapperProps = isLink ? {
              href: client.link,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
            } : {
              className: "flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-default"
            };

            return (
              <Wrapper 
                {...wrapperProps}
                key={client.name} 
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
                     maskImage: `url("${client.logo}")`,
                     WebkitMaskImage: `url("${client.logo}")`,
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
              </Wrapper>
            );
          })}
          direction="horizontal"
          pauseOnHover={true}
          size="clamp(4rem, 1rem + 10vmin, 10rem)"
          duration="40s"
          bgColor="transparent"
          bgAccentColor="transparent"
          textColor={textColor}
          gap="0px"
          fadeLeft="42.5%"
          fadeRight="57.5%"
        />
      </div>
    </div>
  );
}

function GiantEmailSection({ isDark }: { isDark: boolean }) {
  const emailSize = 11.7;
  const posX = -7;
  const posY = 0;
  const marginTop = 0;
  const marginBottom = -15;
  const marginLeft = 0;
  const marginRight = 0;

  return (
    <div className="w-full mt-16 overflow-visible">
      <motion.a
        href="mailto:contact@micr.dev"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className={cn(
          'block text-center font-bold cursor-pointer select-none w-full leading-[0.85] whitespace-nowrap',
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        )}
        style={{
          fontSize: `${emailSize}vw`,
          transform: `translate(${posX}px, ${posY}px)`,
          marginTop: `${marginTop}px`,
          marginBottom: `${marginBottom}px`,
          marginLeft: `${marginLeft}px`,
          marginRight: `${marginRight}px`
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

  return (
    <>
      {/* Mobile version */}
      <div className="block lg:hidden">
        <Suspense fallback={null}>
          <ContactMobile />
        </Suspense>
      </div>

      {/* Desktop version */}
      <div className={cn('hidden lg:block min-h-screen relative overflow-hidden', isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]')}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <Suspense fallback={null}>
            <div className="w-full h-full pointer-events-auto">
              <Lanyard 
                position={[-1, 0, 13]} 
                gravity={[0, -40, 0]} 
                fov={40} 
                transparent 
              />
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
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <InteractiveDivider />
            </div>
            <WorkedWithSection 
              isDark={isDark} 
            />
            <GiantEmailSection isDark={isDark} />
          </div>
        </div>
      </div>
    </>
  );
}
