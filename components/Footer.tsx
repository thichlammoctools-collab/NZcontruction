import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

interface FooterProps {
  locale: "en" | "vi";
  dict: any;
}

export default function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="bg-primary text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* BRAND COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-bronze rounded-lg flex items-center justify-center font-black text-lg border border-slate-700">
                NS
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white leading-none">
                  NS BUILDING
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                  Residential Craftsmen NZ
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.footer.tagline}
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded text-[11px] text-slate-300 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
              <span>{dict.footer.rights}</span>
            </div>
          </div>

          {/* TRADE SERVICES */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-bronze mb-4">
              {dict.footer.services}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href={`/${locale}/services/renovations`} className="hover:text-white transition-colors">
                  {dict.services.items.renovations.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/bathrooms`} className="hover:text-white transition-colors">
                  {dict.services.items.bathrooms.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/cabinets`} className="hover:text-white transition-colors">
                  {dict.services.items.cabinets.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/flooring`} className="hover:text-white transition-colors">
                  {dict.services.items.flooring.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/doors`} className="hover:text-white transition-colors">
                  {dict.services.items.doors.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/painting`} className="hover:text-white transition-colors">
                  {dict.services.items.painting.title}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/hiring`} className="hover:text-white transition-colors">
                  {dict.services.items.hiring.title}
                </Link>
              </li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-bronze mb-4">
              {dict.footer.quick_links}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#services`} className="hover:text-white transition-colors">
                  {dict.nav.services}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#our-work`} className="hover:text-white transition-colors">
                  {dict.nav.work}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#reviews`} className="hover:text-white transition-colors">
                  {dict.nav.reviews}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/#quote`} className="hover:text-white transition-colors">
                  {dict.nav.quote}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-400 hover:text-bronze transition-colors flex items-center gap-1">
                  <span>Admin Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-bronze mb-4">
              {dict.footer.contact_us}
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <a href="tel:0276666510" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-bronze shrink-0" />
                <span>Hotline: <strong>027 666 6510</strong></span>
              </a>
              <a href="tel:0211531510" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-bronze shrink-0" />
                <span>Mr. Son: <strong>021 153 1510</strong></span>
              </a>
              <a href="mailto:contact@nsbuilding.co.nz" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-bronze shrink-0" />
                <span>contact@nsbuilding.co.nz</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-bronze shrink-0" />
                <span>Auckland &amp; Greater New Zealand</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} NS Building Ltd. {dict.footer.copyright}
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-slate-500">Website: nsbuilding.co.nz</span>
            <Link href="/admin/login" className="hover:text-slate-300 transition-colors">
              CMS Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
