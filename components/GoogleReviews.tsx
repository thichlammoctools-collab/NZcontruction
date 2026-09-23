import React from "react";
import { Star, ShieldCheck, CheckCircle2, Award } from "lucide-react";

interface GoogleReviewsProps {
  dict: any;
}

export default function GoogleReviews({ dict }: GoogleReviewsProps) {
  const reviews = dict.reviews.items;

  return (
    <section id="reviews" className="w-full py-20 bg-slate-50 border-t border-b border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-0.5 w-6 bg-bronze"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze">
                {dict.reviews.badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {dict.reviews.title}
            </h2>
          </div>

          {/* GOOGLE SCORE BADGE */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-border-light shadow-sm">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center font-black text-2xl text-amber-600">
              5.0
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-medium text-slate-500 mt-1">
                {dict.reviews.rating_text}
              </span>
            </div>
          </div>
        </div>

        {/* 3 REVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev: any, index: number) => (
            <div
              key={index}
              className="bg-white p-7 rounded-2xl border border-border-light shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-bronze" />
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-primary">{rev.name}</span>
                    <span className="text-xs text-slate-500">{rev.location}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-secondary bg-slate-100 px-2 py-1 rounded">
                    {rev.project}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TRUST BADGES ROW */}
        <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-bronze mb-2" />
            <span className="font-bold text-sm text-primary">100% Code Compliant</span>
            <span className="text-xs text-slate-500">NZ Building Code Standards</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-bronze mb-2" />
            <span className="font-bold text-sm text-primary">Comprehensive Insurance</span>
            <span className="text-xs text-slate-500">Full Public Liability Cover</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-8 h-8 text-bronze mb-2" />
            <span className="font-bold text-sm text-primary">Master Craftsmanship</span>
            <span className="text-xs text-slate-500">Experienced Licensed Tradies</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-bronze mb-2" />
            <span className="font-bold text-sm text-primary">Fixed Scope Quotes</span>
            <span className="text-xs text-slate-500">No Hidden Cost Surprises</span>
          </div>
        </div>
      </div>
    </section>
  );
}
