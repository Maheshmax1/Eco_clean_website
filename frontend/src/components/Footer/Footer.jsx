import React from 'react';
import { Link } from 'react-router-dom';
import {
  ABOUT_US_TEXT,
  QUICK_LINKS,
  SERVICES_LINKS,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_LOCATION
} from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* About Section */}
          <div className="lg:col-span-1.5 flex flex-col gap-4">
            <h3 className="text-white text-lg font-bold tracking-tight">🌿 EcoClean</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {ABOUT_US_TEXT}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_LINKS.map((svc) => (
                <li key={svc.label}>
                  <a
                    href={svc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-400 transition-colors duration-200"
                  >
                    {svc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Follow Us</h4>
            <ul className="space-y-2.5 text-sm">
              {SOCIAL_LINKS.map((soc) => (
                <li key={soc.label}>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-400 transition-colors duration-200"
                  >
                    {soc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary-400 transition-colors duration-200 block truncate">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="hover:text-primary-400 transition-colors duration-200">
                  {CONTACT_PHONE}
                </a>
              </li>
              <li className="leading-relaxed">
                Location: {CONTACT_LOCATION}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} EcoClean Awareness. All Rights Reserved.</p>
          <p>
            Governed under{' '}
            <a
              href="https://copyright.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white underline transition-colors"
            >
              Copyright Office India
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
