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
  iconName?: string;
  locale: "en" | "vi";
  viewServiceText: string;
}

const materialIconMap: Record<string, string> = {
  renovations: "home_repair_service",
  bathrooms: "bathtub",
  cabinets: "countertops",
  flooring: "texture",
  doors: "door_front",
  painting: "format_paint",
  plastering: "square_foot",
  equipment: "construction",
  hiring: "construction",
  maintenance: "handyman",
};

const lucideIconMap: Record<string, any> = {
  renovations: Home,
  bathrooms: Bath,
  cabinets: Armchair,
  flooring: Layers,
  doors: DoorOpen,
  painting: Paintbrush,
  equipment: Wrench,
  hiring: Wrench,
  maintenance: Hammer,
};

export default function ServiceCard({
  id,
  tag,
  title,
  desc,
  iconName,
  locale,
  viewServiceText,
}: ServiceCardProps) {
  const matIcon = iconName || materialIconMap[id] || "home_repair_service";
  const LucideIcon = lucideIconMap[id] || Home;

  return (
    <div className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-border-light hover:-translate-y-0.5">
      <div>
        {/* ICON BOX */}
        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-on-primary transition-colors">
          <span className="material-symbols-outlined text-[26px] select-none">{matIcon}</span>
        </div>

        <span className="text-[11px] uppercase tracking-wider text-secondary font-bold block mb-1">
          {tag}
        </span>

        <h3 className="text-lg font-bold text-primary tracking-tight mt-1 mb-2 group-hover:text-bronze transition-colors">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
          {desc}
        </p>
      </div>

      <Link
        href={`/${locale}/services/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary group-hover:translate-x-0.5 transition-all pt-3 border-t border-slate-100"
      >
        <span>{viewServiceText}</span>
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </Link>
    </div>
  );
}
