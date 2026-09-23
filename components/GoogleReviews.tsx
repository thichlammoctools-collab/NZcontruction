import React from "react";

interface GoogleReviewsProps {
  dict: any;
}

export default function GoogleReviews({ dict }: GoogleReviewsProps) {
  const reviews = dict.reviews.items;

  return (
    <section id="reviews" className="w-full bg-surface-container-low py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-0.5 w-5 bg-secondary"></span>
              <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                {dict.reviews.badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {dict.reviews.title}
            </h2>
          </div>

          {/* GOOGLE REVIEW METRIC BADGE */}
          <div className="bg-surface-container-lowest px-5 py-3 rounded-xl shadow-sm border border-border-light flex items-center gap-4">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-primary">
                {dict.reviews.rating_score || "4.9 on Google Reviews"}
              </p>
              <p className="text-xs text-on-surface-variant">
                {dict.reviews.rating_sub || "Top-Rated Builder Across Auckland"}
              </p>
            </div>
          </div>
        </div>

        {/* 3 TESTIMONIAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev: any, index: number) => (
            <div
              key={index}
              className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-border-light flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-sm text-on-surface italic mb-6 leading-relaxed">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-primary">{rev.name}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">{rev.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
