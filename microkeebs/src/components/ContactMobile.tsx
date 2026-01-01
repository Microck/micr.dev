import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '@/lib/utils';
import LogoWall from './LogoWall';
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

const aboutText = `I entered the keyboard hobby in early 2021. I was active immediately, but I didn't build my first custom board until mid-2022. That was the start of the channel. I wanted a place to catalog the keyboards passing through my hands.

I started out streaming and creating content in Spanish. Commissions were a practical necessity since I could not afford to buy every board I wanted to try. I also produced educational videos to help expand the hobby locally. I am not great at dealing with people, so when I stopped taking orders, I ran out of things to film. I took a hiatus from late 2022 to July 2023. I was still around, just not posting.

I eventually returned with better equipment and a switch to English. I wanted a wider audience. I picked up the pace, making more guides and general content. Brands and friends began sending me units for review. This allowed me to keep the schedule full.

It led to burnout. Build videos took days to finish but received little support. I stopped doing them for fun and started doing them out of obligation. The quality dropped. In my opinion, this hobby does not reward long-duration videos unless you are already established or rely on clickbait. It wasn't sustainable, so I stopped.

Now I just do what I love. I don't feel forced to make anything I don't want to make. This freedom helped me develop a personal style and improve my output. I record everything on an iPhone these days. If you hadn't noticed, that is a sign I am doing a good job. I plan to keep this mindset for the boards to come.`;

const clients = [
  { name: "TKD", logo: tkdLogo, width: 6, height: 4, margin: 0.5, link: "" },
  { name: "Bowl Keyboards", logo: bowlLogo, width: 4.5, height: 6, margin: 0.3, link: "https://bowlkeyboards.com/" },
  { name: "Chilkey", logo: chilkeyLogo, width: 5.5, height: 4, margin: 0, link: "https://chilkey.com/" },
  { name: "Luminkey", logo: luminkeyLogo, width: 7, height: 4, margin: 0.5, link: "https://luminkey.com/" },
  { name: "Akko", logo: akkoLogo, width: 7, height: 4, margin: 0.5, link: "https://en.akkogear.com/" },
  { name: "Baionlenja", logo: baionLogo, width: 7, height: 4, margin: 0.5, link: "https://www.instagram.com/baionlenja/" },
  { name: "CtrlVLC", logo: ctrlvlcLogo, width: 7, height: 4, margin: 0.5, link: "https://www.instagram.com/ctrl.vlc/" },
  { name: "MetaKeebs", logo: metakeebsLogo, width: 4, height: 4, margin: 0.5, link: "https://metakeebs.com/" },
  { name: "Monsgeek", logo: monsgeekLogo, width: 6, height: 5.5, margin: 0.4, link: "https://www.monsgeek.com/" },
  { name: "Vertex", logo: vertexLogo, width: 7, height: 4, margin: 0.5, link: "https://www.instagram.com/vtxengine" }
];

function AboutSectionMobile({ isDark }: { isDark: boolean }) {
  return (
    <div className="w-full flex flex-col items-center">
      <h1
        className={cn(
          'text-5xl font-bold mb-8 text-center drop-shadow-lg',
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        )}
        style={{
          textShadow: isDark 
            ? '0 2px 8px rgba(28, 28, 28, 0.9), 0 0 20px rgba(28, 28, 28, 0.7)' 
            : '0 2px 8px rgba(167, 164, 149, 0.9), 0 0 20px rgba(167, 164, 149, 0.7)'
        }}
      >
        About
      </h1>

      <div className={cn(
        "text-lg leading-relaxed text-left w-full",
        isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
      )}>
        {aboutText.split('\n\n').map((paragraph, index) => (
          <ScrollReveal key={index} delay={index * 0.1} className="mb-5 last:mb-0">
            <p 
              className="rounded-lg px-3 py-2"
              style={{
                backgroundColor: isDark 
                  ? 'rgba(28, 28, 28, 0.5)' 
                  : 'rgba(167, 164, 149, 0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            >
              {paragraph}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function WorkedWithSectionMobile({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? '#a7a495' : '#1c1c1c';

  return (
    <div className="py-4 w-full">
      <h3
        className={cn(
          'text-xs font-light mb-2 text-center uppercase tracking-[0.2em]',
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        )}
      >
        Worked With
      </h3>

      <div className="w-full relative overflow-hidden">
        <LogoWall
          items={clients.map((client) => {
            const isLink = !!client.link;
            const Wrapper = isLink ? 'a' : 'div';
            const wrapperProps = isLink ? {
              href: client.link,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center"
            } : {
              className: "flex items-center justify-center"
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
                    "w-full h-full opacity-80",
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
          pauseOnHover={false}
          size="clamp(3rem, 1rem + 8vmin, 6rem)"
          duration="30s"
          bgColor="transparent"
          bgAccentColor="transparent"
          textColor={textColor}
          gap="0px"
          fadeLeft="10%"
          fadeRight="90%"
        />
      </div>
    </div>
  );
}

function EmailSectionMobile({ isDark }: { isDark: boolean }) {
  return (
    <div className="w-full py-8">
      <motion.a
        href="mailto:contact@micr.dev"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className={cn(
          'block text-center font-bold',
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        )}
        style={{ fontSize: '7vw' }}
      >
        contact@micr.dev
      </motion.a>
    </div>
  );
}

export function ContactMobile() {
  const { isDark } = useTheme();

  return (
    <div className={cn('min-h-screen relative overflow-hidden', isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]')}>
      {/* Content */}
      <div className="relative z-10 px-5 pt-6 pb-4">
        <AboutSectionMobile isDark={isDark} />

        <div className="my-8">
          <InteractiveDivider />
        </div>

        <WorkedWithSectionMobile isDark={isDark} />
        
        <EmailSectionMobile isDark={isDark} />
      </div>
    </div>
  );
}
