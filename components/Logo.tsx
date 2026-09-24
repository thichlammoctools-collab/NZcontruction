import React from "react";

interface LogoProps {
  className?: string;
  badgeSize?: string;
  textSize?: string;
  subtextSize?: string;
  showSubtitle?: boolean;
}

export default function Logo({
  className = "",
  badgeSize = "w-9 h-9 sm:w-10 sm:h-10 text-base sm:text-lg",
  textSize = "text-base sm:text-lg md:text-xl",
  subtextSize = "text-[9px] sm:text-[10px]",
  showSubtitle = true,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <div
        className={`${badgeSize} rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black tracking-tight shadow-sm border border-amber-400/30 group-hover:scale-105 transition-transform shrink-0`}
      >
        NS
      </div>
      <div className="flex flex-col">
        <span className={`font-extrabold ${textSize} tracking-tight text-slate-900 leading-none`}>
          NS <span className="text-bronze">BUILDING</span>
        </span>
        {showSubtitle && (
          <span className={`${subtextSize} font-semibold tracking-wider text-slate-500 uppercase mt-0.5`}>
            Residential Craftsmen NZ
          </span>
        )}
      </div>
    </div>
  );
}
