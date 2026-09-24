"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Hammer,
  FileText,
  Briefcase,
  Phone,
  X,
  ChevronRight,
  Bath,
  Armchair,
  Layers,
  DoorOpen,
  Paintbrush,
  Wrench,
  Construction,
  PhoneCall,
  Mail,
} from "lucide-react";

interface MobileBottomNavProps {
  locale: "en" | "vi";
  dict: any;
}

export default function MobileBottomNav({ locale, dict }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [servicesSheetOpen, setServicesSheetOpen] = useState(false);
  const [contactSheetOpen, setContactSheetOpen] = useState(false);

  const isVi = locale === "vi";

  // Close drawers when navigating to a new path
  useEffect(() => {
    setServicesSheetOpen(false);
    setContactSheetOpen(false);
  }, [pathname]);

  // Lock body scroll when any sheet is open
  useEffect(() => {
    if (servicesSheetOpen || contactSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [servicesSheetOpen, contactSheetOpen]);

  const isHomeActive =
    pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";
  const isServicesActive = pathname?.includes("/services");
  const isProjectsActive = pathname?.includes("/projects");

  const serviceItems = [
    {
      id: "renovations",
      icon: Home,
      title: dict?.services?.items?.renovations?.title || (isVi ? "Cải tạo nhà trọn gói" : "Full Home Renovations"),
      tag: isVi ? "Kết cấu & Phép Council" : "Structural & Consents",
    },
    {
      id: "bathrooms",
      icon: Bath,
      title: dict?.services?.items?.bathrooms?.title || (isVi ? "Phòng tắm cao cấp" : "Luxury Bathrooms"),
      tag: isVi ? "Chống thấm Council PS3" : "PS3 Waterproofing",
    },
    {
      id: "cabinets",
      icon: Armchair,
      title: dict?.services?.items?.cabinets?.title || (isVi ? "Tủ bếp & Đồ gỗ nội thất" : "Custom Cabinetry & Joinery"),
      tag: isVi ? "Đo đạc chính xác mm" : "Precision Joinery",
    },
    {
      id: "flooring",
      icon: Layers,
      title: dict?.services?.items?.flooring?.title || (isVi ? "Giải pháp sàn nhà" : "Flooring Specialists"),
      tag: isVi ? "Gỗ sồi, xương cá, gạch" : "Hardwood & Tiling",
    },
    {
      id: "doors",
      icon: DoorOpen,
      title: dict?.services?.items?.doors?.title || (isVi ? "Hệ cửa & Ô mở kiến trúc" : "Architectural Doors & Openings"),
      tag: isVi ? "Cửa trượt, bản lề giấu" : "Pocket & Pivot Doors",
    },
    {
      id: "painting",
      icon: Paintbrush,
      title: dict?.services?.items?.painting?.title || (isVi ? "Sơn phủ & Bả tường Level 5" : "Surface Finishing & Paint"),
      tag: isVi ? "Tiêu chuẩn Level 4-5" : "Level 4-5 Finish",
    },
    {
      id: "hiring",
      icon: Construction,
      title: dict?.services?.items?.equipment?.title || (isVi ? "Cho thuê thiết bị công trình" : "Equipment & Machinery Hire"),
      tag: isVi ? "Máy xúc mini, giàn giáo" : "Mini Diggers & Scaffolding",
    },
    {
      id: "maintenance",
      icon: Wrench,
      title: dict?.services?.items?.maintenance?.title || (isVi ? "Bảo trì & Sửa chữa nhà ở" : "Property Maintenance & Repairs"),
      tag: isVi ? "Sửa mái, dột, mục gỗ" : "Rot & Leak Repairs",
    },
  ];

  return (
    <>
      {/* FIXED BOTTOM NAVIGATION BAR ON MOBILE ONLY */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 px-2 select-none"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center">
          {/* TAB 1: HOME */}
          <Link
            href={`/${locale}`}
            onClick={() => {
              setServicesSheetOpen(false);
              setContactSheetOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all ${
              isHomeActive && !servicesSheetOpen && !contactSheetOpen
                ? "text-bronze font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className="relative">
              <Home className="w-5 h-5" />
              {isHomeActive && !servicesSheetOpen && !contactSheetOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-bronze"></span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px]">
              {dict?.nav?.home || (isVi ? "Trang Chủ" : "Home")}
            </span>
          </Link>

          {/* TAB 2: SERVICES (Toggles Quick Services Sheet) */}
          <button
            type="button"
            onClick={() => {
              setContactSheetOpen(false);
              setServicesSheetOpen(!servicesSheetOpen);
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all ${
              servicesSheetOpen || isServicesActive
                ? "text-bronze font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className="relative">
              <Hammer className="w-5 h-5" />
              {(servicesSheetOpen || isServicesActive) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-bronze"></span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px]">
              {dict?.nav?.services || (isVi ? "Dịch Vụ" : "Services")}
            </span>
          </button>

          {/* TAB 3: CENTER ACTION BUTTON - GET QUOTE */}
          <div className="flex flex-col items-center justify-center -mt-5">
            <a
              href={`/${locale}#quote-section`}
              onClick={() => {
                setServicesSheetOpen(false);
                setContactSheetOpen(false);
              }}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-bronze-dark to-bronze text-white flex items-center justify-center shadow-lg shadow-bronze/40 border-[3px] border-white active:scale-95 transition-transform"
              aria-label="Request a quote"
            >
              <FileText className="w-5 h-5" />
            </a>
            <span className="text-[10px] font-bold text-bronze mt-1 tracking-tight">
              {isVi ? "Báo Giá" : "Quote"}
            </span>
          </div>

          {/* TAB 4: PROJECTS / WORK */}
          <a
            href={`/${locale}#work-section`}
            onClick={() => {
              setServicesSheetOpen(false);
              setContactSheetOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all ${
              isProjectsActive && !servicesSheetOpen && !contactSheetOpen
                ? "text-bronze font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className="relative">
              <Briefcase className="w-5 h-5" />
              {isProjectsActive && !servicesSheetOpen && !contactSheetOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-bronze"></span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px]">
              {dict?.nav?.work || (isVi ? "Dự Án" : "Work")}
            </span>
          </a>

          {/* TAB 5: CALL / CONTACT */}
          <button
            type="button"
            onClick={() => {
              setServicesSheetOpen(false);
              setContactSheetOpen(!contactSheetOpen);
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 w-full rounded-xl transition-all ${
              contactSheetOpen
                ? "text-bronze font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className="relative">
              <Phone className="w-5 h-5" />
              {contactSheetOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-bronze"></span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px]">
              {dict?.nav?.contact || (isVi ? "Liên Hệ" : "Contact")}
            </span>
          </button>
        </div>
      </nav>

      {/* QUICK SERVICES BOTTOM SHEET */}
      {servicesSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setServicesSheetOpen(false)}
          />

          {/* Sheet Content */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom duration-300 pb-[max(env(safe-area-inset-bottom),16px)]">
            {/* Sheet Handle & Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center">
                  <Hammer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-primary">
                    {isVi ? "Danh Mục Dịch Vụ" : "Our Trade Services"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isVi ? "Chọn dịch vụ để xem báo giá & hình ảnh" : "Select a service to view specs & pricing"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setServicesSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
                aria-label="Close sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Services List */}
            <div className="overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
              {serviceItems.map((s) => {
                const IconComponent = s.icon;
                return (
                  <Link
                    key={s.id}
                    href={`/${locale}/services/${s.id}`}
                    onClick={() => setServicesSheetOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors pt-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-primary flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-bronze" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary">{s.title}</h4>
                        <span className="text-[11px] text-slate-500">{s.tag}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Link to All Services Section */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <a
                href={`/${locale}#services`}
                onClick={() => setServicesSheetOpen(false)}
                className="w-full py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <span>{isVi ? "Xem tổng quan 8 dịch vụ" : "View Overview of All 8 Services"}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QUICK CONTACT BOTTOM SHEET */}
      {contactSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setContactSheetOpen(false)}
          />

          {/* Sheet Content */}
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom duration-300 pb-[max(env(safe-area-inset-bottom),20px)]">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-primary">
                    {isVi ? "Liên Hệ Nhanh NS Building" : "Direct Contact NS Building"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isVi ? "Tư vấn & khảo sát tận nơi tại Auckland & New Zealand" : "On-site surveys across Auckland & Greater NZ"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
                aria-label="Close sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Action Buttons */}
            <div className="p-4 space-y-3">
              <a
                href="tel:0276666510"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-primary text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bronze flex items-center justify-center text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-300 font-medium">
                      {isVi ? "Hotline Chính (Nguyễn Sơn)" : "Direct Line (Nguyen Son)"}
                    </span>
                    <span className="text-sm font-extrabold tracking-wide">027 666 6510</span>
                  </div>
                </div>
                <span className="text-xs bg-white/15 px-3 py-1.5 rounded-lg font-bold">
                  {isVi ? "Gọi Ngay" : "Call Now"}
                </span>
              </a>

              <a
                href="tel:0211531510"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 text-primary hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-medium">
                      {isVi ? "Số Di Động Thứ 2" : "Secondary Mobile"}
                    </span>
                    <span className="text-sm font-bold">021 153 1510</span>
                  </div>
                </div>
                <span className="text-xs text-primary font-bold">
                  {isVi ? "Gọi Ngay" : "Call"}
                </span>
              </a>

              <a
                href="mailto:contact@nsbuilding.co.nz"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 text-primary hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[11px] text-slate-500 font-medium">Email</span>
                    <span className="text-xs font-bold truncate">contact@nsbuilding.co.nz</span>
                  </div>
                </div>
                <span className="text-xs text-primary font-bold">
                  {isVi ? "Gửi Thư" : "Email"}
                </span>
              </a>

              <a
                href={`/${locale}#quote-section`}
                onClick={() => setContactSheetOpen(false)}
                className="w-full py-3 bg-bronze hover:bg-bronze-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{isVi ? "Điền mẫu yêu cầu báo giá chi tiết" : "Fill Detailed Quote Request Form"}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
