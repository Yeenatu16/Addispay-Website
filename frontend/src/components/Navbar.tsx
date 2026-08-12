'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import AddisPayLogo from './AddisPayLogo';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/data/translations';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage, languages, currentLanguageOption } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.careers'), href: '/careers' },
  ];

  const handleSelectLang = (code: Language) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo with actual AddisPay icon */}
          <AddisPayLogo animated={true} size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold transition-colors duration-200 ${
                    isActive
                      ? 'text-[#00A36D]'
                      : 'text-gray-700 hover:text-[#00A36D]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* External Documentation Link */}
            <a
              href="https://devportal.addispay.et/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-gray-700 hover:text-[#00A36D] transition-colors flex items-center gap-1"
            >
              <span>{t('nav.docs')}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

          </nav>

          {/* Right side CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Language Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-[#E5F5EE]/60 px-3.5 py-2 rounded-full border border-gray-200 cursor-pointer transition-all duration-200 shadow-xs hover:border-[#00A36D]/40"
                aria-label="Select Language"
              >
                <span className="text-base leading-none">{currentLanguageOption.flag}</span>
                <span>{currentLanguageOption.nativeName}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${
                    langDropdownOpen ? 'rotate-180 text-[#00A36D]' : ''
                  }`}
                />
              </button>

              {/* Animated Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-gray-400 tracking-wider border-b border-gray-100">
                    {t('nav.select_language')}
                  </div>
                  <div className="py-1">
                    {languages.map((langOption) => {
                      const isSelected = language === langOption.code;
                      return (
                        <button
                          key={langOption.code}
                          onClick={() => handleSelectLang(langOption.code)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#E5F5EE] text-[#00A36D]'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-[#00A36D]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base leading-none">{langOption.flag}</span>
                            <span>{langOption.nativeName}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00A36D]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* External Log In Button */}
            <a
              href="https://uat.dashboard.addispay.et/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-gray-700 hover:text-[#00A36D] transition-colors px-2 py-1"
            >
              {t('nav.login')}
            </a>

            {/* External Sign Up Button */}
            <a
              href="https://uat.dashboard.addispay.et/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00A36D] hover:bg-[#008959] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md shadow-[#00A36D]/20 hover:shadow-lg hover:shadow-[#00A36D]/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {t('nav.signup')}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1"
            >
              <span>{currentLanguageOption.flag}</span>
              <span>{currentLanguageOption.code.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Language Switcher Selector Bar */}
          <div className="bg-[#F8FDFB] p-2 rounded-2xl border border-gray-200/80 space-y-2">
            <div className="text-[10px] font-black uppercase text-gray-400 px-2 tracking-wider">
              {t('nav.select_language')}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLang(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-[#00A36D] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-gray-800 hover:text-[#00A36D] hover:bg-[#F8FDFB] transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <a
              href="https://devportal.addispay.et/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-gray-800 hover:text-[#00A36D] hover:bg-[#F8FDFB] transition-colors flex items-center justify-between"
            >
              <span>{t('nav.docs')}</span>
              <ExternalLink className="w-4 h-4 opacity-50" />
            </a>

          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2.5">
            <a
              href="https://uat.dashboard.addispay.et/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-full border border-gray-200 text-gray-800 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              {t('nav.login')}
            </a>
            <a
              href="https://uat.dashboard.addispay.et/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-full bg-[#00A36D] text-white font-bold text-sm shadow-md transition-colors"
            >
              {t('nav.signup')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
