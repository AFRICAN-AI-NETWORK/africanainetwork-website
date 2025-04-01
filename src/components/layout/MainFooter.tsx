import Logo from '@/assets/logo.svg';
import { trackLinkClick } from '@/utils/analytics';
import { FacebookIcon, LinkedinIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import DiscordIcon from '../simple/icons/DiscordIcon';
import TiktokIcon from '../simple/icons/TiktokIcon';
import WhatsappIcon from '../simple/icons/WhatsappIcon';

const MainFooter: React.FC = () => {
  const handleLinkClick = (linkName: string, url: string) => {
    trackLinkClick(linkName, url);
  };

  return (
    <footer className="bg-secondary text-white">
      <div className="py-14 px-10 grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] content-center lg:justify-items-end lg:grid-cols-[45%_18%_18%_18%] gap-y-10">
        <div>
          <img src={Logo} alt="AAN logo" className="italic mb-2 h-10 lg:h-14" />

          <p className="self-start mb-8 2xl:mr-0">
            African AI Network is a community-driven network that brings
            together AI enthusiasts from all 54 African countries. Join this
            vibrant network to share knowledge, collaborate on projects and stay
            updated with the latest AI developers in the world.
          </p>

          <div className="w-fit">
            <a
              className="mb-5 text-center block bg-primary text-white rounded-full px-8 py-2 w-full"
              href="/about"
            >
              More
            </a>

            <div className="flex gap-6">
              <a
                href="https://www.facebook.com/groups/1490131391564053/?ref=share"
                title="Visit our Facebook Page"
                onClick={() =>
                  handleLinkClick(
                    'Facebook',
                    'https://www.facebook.com/groups/1490131391564053/?ref=share'
                  )
                }
              >
                <p className="sr-only">Visit our Facebook Page</p>
                <FacebookIcon height={20} width={20} />
              </a>
              <a
                href="https://www.linkedin.com/groups/9802179"
                title="Visit our LinkedIn Account"
                onClick={() =>
                  handleLinkClick(
                    'LinkedIn',
                    'https://www.linkedin.com/groups/9802179'
                  )
                }
              >
                <p className="sr-only">Visit our LinkedIn Account</p>
                <LinkedinIcon height={20} width={20} />
              </a>
              <a
                href="https://discord.gg/zytPSazu6S"
                title="Join our Discord Channel"
                onClick={() =>
                  handleLinkClick('Discord', 'https://discord.gg/zytPSazu6S')
                }
              >
                <p className="sr-only">Join our Discord Channel</p>
                <DiscordIcon height={20} width={20} />
              </a>
              <a
                href="https://chat.whatsapp.com/G2khjYh9eVOKOGXaoXEDDZ"
                title="Join our Whatsapp community"
                onClick={() =>
                  handleLinkClick(
                    'Whatsapp',
                    'https://chat.whatsapp.com/G2khjYh9eVOKOGXaoXEDDZ'
                  )
                }
              >
                <p className="sr-only">Join our Whatsapp community</p>
                <WhatsappIcon height={20} width={20} />
              </a>
              <a
                href="https://tiktok.com/@african.ai.network"
                title="Visit our Tiktok Channel"
                onClick={() =>
                  handleLinkClick(
                    'Tiktok',
                    'https://tiktok.com/@african.ai.network'
                  )
                }
              >
                <p className="sr-only">Visit our Tiktok Channel</p>
                <TiktokIcon height={20} width={20} />
              </a>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-lg">AI Tool Categories</h3>
          <ul className="flex flex-col gap-y-2">
            <li>
              <a href="/ai-tools">Business & Productivity</a>
            </li>
            <li>
              <a href="/ai-tools">Design</a>
            </li>
            <li>
              <a href="/ai-tools">Education</a>
            </li>
            <li>
              <a href="/ai-tools">Research</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-lg">Resources</h3>
          <ul className="flex flex-col gap-y-2">
            <li>
              <a href="#">Courses</a>
            </li>
            <li>
              <a href="#">Blog Posts</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-lg">Company</h3>
          <ul className="flex flex-col gap-y-2">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap p-5 gap-3 border border-white border-r-0 border-l-0">
        <p>
          {new Date().getFullYear()} African AI Network LLC, All rights
          reserved.
        </p>
        <a
          href="#"
          className="underline hover:text-blue-300 focus-visible:text-blue-300 transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="underline hover:text-blue-300 focus-visible:text-blue-300 transition-colors"
        >
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default MainFooter;
