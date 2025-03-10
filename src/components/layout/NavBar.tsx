import Logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import HamburgerMenu from '@/components/ui/hamburger-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { useEscapeKey } from '@/hooks/use-escape-key';
import { useScrollToHash } from '@/hooks/use-scroll-to-hash';
import { storageHandler } from '@/lib/localStorage';
import { cn } from '@/lib/utils';
import { navigationLinks } from '@/utils/constants';
import { Confirm } from 'notiflix';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const isAuthenticated = !!storageHandler.getToken();
  const scrollToHash = useScrollToHash();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Confirm.show(
      'Logout',
      'Are you sure you want to logout?',
      'Yes',
      'No',
      () => {
        storageHandler.removeCredentials();
        navigate('/auth/login');
      }
    );
  };

  const handleNavigation = (to: string) => {
    if (to.includes('#')) {
      // If it's a hash link, handle scroll behavior
      scrollToHash(to.split('#')[1]);
    }
  };

  // Close menu when escape is pressed
  useEscapeKey(() => setIsOpen(false));

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        'fixed z-50 inset-0 bottom-auto text-white grid grid-cols-2 md:flex justify-between items-center px-7 py-5',
        transparent
          ? 'bg-black bg-opacity-10 backdrop-blur-md mix-blend-hard-light'
          : 'bg-primary'
      )}
    >
      <Link to="/">
        <p className="sr-only">Back to Home</p>
        <img src={Logo} alt="AAN logo" className="italic h-10 lg:h-14" />
      </Link>

      <HamburgerMenu
        ref={buttonRef}
        isOpen={isOpen}
        onClick={toggleMenu}
        className="justify-self-end md:hidden text-white hover:text-slate-100 focus-visible:text-slate-100"
      />

      <div
        ref={menuRef}
        className={cn(
          'col-span-2',
          'transition-all duration-300 ease-in-out',
          'transform md:transform-none',
          isOpen ? 'block' : 'hidden md:block'
        )}
      >
        <ul className="flex flex-col md:flex-row md:mt-0 gap-5 items-center p-5 md:p-0">
          {navigationLinks
            .filter((link) => !link.subLinks)
            .map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-blue-300 focus-visible:text-blue-300 transition-all"
                  onClick={() => handleNavigation(link.to)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          <li className="relative">
            {navigationLinks
              .filter((link) => link.subLinks && link.subLinks.length)
              .map((link) => (
                <NavigationMenu key={link.label}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-white bg-transparent text-base">
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuIndicator />
                        {link.subLinks!.map((subLink, i) => (
                          <div key={subLink.to}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={subLink.to}
                                className={cn(
                                  'block w-32 text-center p-3 hover:text-blue-500 focus-visible:text-blue-500 transition-all',
                                  i === 0 && 'mt-2',
                                  i === link.subLinks!.length - 1 && 'mb-2'
                                )}
                                onClick={() => handleNavigation(subLink.to)}
                              >
                                {subLink.label}
                              </Link>
                            </NavigationMenuLink>

                            {i !== link.subLinks!.length - 1 && (
                              <Separator className="my-2" />
                            )}
                          </div>
                        ))}
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ))}
          </li>
          <li>
            {isAuthenticated ? (
              <Button
                variant="destructive"
                className="hover:bg-red-600"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            ) : (
              <Link
                to="/auth/signup"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition-all"
              >
                Get Started
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
