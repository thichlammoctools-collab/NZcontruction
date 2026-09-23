import React from "react";
import Link from "next/link";
import {
  Home,
  Bath,
  Armchair,
  Layers,
  DoorOpen,
  Paintbrush,
  Wrench,
  Hammer,
  ArrowRight,
} from "lucide-react";

interface ServiceCardProps {
  id: string;
  tag: string;
  title: string;
  desc: string;
  locale: "en" | "vi";
  viewServiceText: string;
}

const iconMap: Record<string, any> = {
  renovations: Home,
  bathrooms: Bath,
  cabinets: Armchair,
  flooring: Layers,
  doors: DoorOpen,
  painting: Paintbrush,
  hiring: Wrench,
  maintenance: Hammer,
};

export default function ServiceCard({
  id,
  tag,
  title,
  desc,
  locale,
  viewServiceText,
}: ServiceCardProps) {
  const IconComponent = iconMap[id] || Home;

  return (
    <div className="group bg-white p-6 sm:p-7 rounded-2xl border border-border-light shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">
      <div>
        {/* ICON BOX */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-bronze transition-colors">
          <IconComponent className="w-6 h-6" />
        </div>

        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
          {tag}
        </span>

        <h3 className="text-lg font-bold text-primary tracking-tight mb-2 group-hover:text-bronze transition-colors">
          {title}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          {desc}
        </p>
      </div>

      <Link
        href={`/${locale}/services/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-bronze group-hover:translate-x-1 transition-all pt-3 border-t border-slate-100"
      >
        <span>{viewServiceText}</span>
        <ArrowRight className="w-3.5 h-3.5 text-bronze" />
      </Link>
    </div>
  );
}
