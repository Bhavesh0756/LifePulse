import React, { useState, useEffect } from 'react';
import LifePulseLogo from '../assets/logo/LifePulseLogo';
import { NAV_LINKS } from '../data/landingData';
import { Button } from './Button';
import Container from './Container';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRight, LogIn, UserCheck, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeLink, setActiveLink] = useState('');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setActiveLink(hash ? `/${hash}` : (path === '/' ? '/#hero' : path));
    };

    handleLocationChange();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const getPortalPath = () => {
    if (!user) return '/login';
    return user.role === 'DONOR'
      ? '/donor/dashboard'
      : user.role === 'HOSPITAL'
      ? '/hospital/dashboard'
      : '/admin/dashboard';
  };

  const handleNavClick = (e, href) => {
    const isHomePage = window.location.pathname === '/';
    const targetHash = href.includes('#') ? href.substring(href.indexOf('#')) : '';

    if (isHomePage && targetHash) {
      e.preventDefault();
      if (targetHash === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
        setActiveLink('/#hero');
      } else {
        const element = document.querySelector(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', targetHash);
          setActiveLink('/' + targetHash);
        } else {
          window.location.href = href;
        }
      }
    } else {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-4 border-b border-slate-100'}`}>
      <Container size="lg">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {/* Logo */}
          <a href="/" className="focus:outline-none focus:ring-2 focus:ring-brand-red rounded-lg p-1">
            <LifePulseLogo size="md" />
          </a>

          {/* Desktop Nav Links */}
          <div 
            className="hidden lg:flex items-center p-1.5 rounded-full bg-[#081B3A]/[0.05] border border-[#081B3A]/10 backdrop-blur-[12px] shadow-sm"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.href || (activeLink === '/' && link.href === '/#hero');
              const isHovered = hoveredLink === link.href;

              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setHoveredLink(link.href)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-[#E31E45] rounded-full shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-white/70 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative z-10 block px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-white' : 'text-[#081B3A] hover:text-[#081B3A]'
                    }`}
                  >
                    {link.name}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={UserCheck}
                  onClick={() => { window.location.href = getPortalPath(); }}
                >
                  Dashboard ({user?.role})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={LogIn}
                  onClick={() => { window.location.href = '/login'; }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => { window.location.href = '/register'; }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-brand-navy hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-red"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Animated Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden shadow-xl"
          >
            <Container className="py-6 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, link.href);
                    }}
                    className="text-base font-semibold text-brand-navy hover:text-brand-red px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      icon={UserCheck}
                      onClick={() => { setMobileMenuOpen(false); window.location.href = getPortalPath(); }}
                    >
                      Dashboard ({user?.role})
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      icon={LogOut}
                      onClick={() => { setMobileMenuOpen(false); logout(); }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      icon={LogIn}
                      onClick={() => { setMobileMenuOpen(false); window.location.href = '/login'; }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={() => { setMobileMenuOpen(false); window.location.href = '/register'; }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
