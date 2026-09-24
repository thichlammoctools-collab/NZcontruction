// Transforms a simple admin-managed project (from content/projects.json) into
// the rich shape that components/ProjectDetailView expects. Projects edited via
// the admin CMS only carry basic fields (before/after images, title, suburb,
// description, category). This keeps the public detail page functional without
// forcing the admin form to collect the full editorial schema.

interface SimpleProject {
  id: string;
  title_en?: string;
  title_vi?: string;
  suburb?: string;
  category?: string;
  completed_year?: string;
  before_image?: string;
  after_image?: string;
  description_en?: string;
  description_vi?: string;
}

const CATEGORY_LABELS: Record<string, { vi: string; en: string }> = {
  renovations: { vi: "Cải Tạo Nhà", en: "Renovation" },
  bathrooms: { vi: "Phòng Tắm", en: "Bathroom" },
  cabinets: { vi: "Tủ Bếp & Đồ Gỗ", en: "Joinery" },
  flooring: { vi: "Sàn Nhà", en: "Flooring" },
  doors: { vi: "Cửa & Mộc", en: "Doors" },
  painting: { vi: "Sơn Bả", en: "Painting" },
  hiring: { vi: "Cho Thuê Thiết Bị", en: "Equipment Hire" },
  maintenance: { vi: "Bảo Trì Nhà Cửa", en: "Maintenance" },
};

export function normalizeProject(p: SimpleProject): any {
  const catLabel = CATEGORY_LABELS[p.category || ""] || {
    vi: p.category || "Công Trình",
    en: p.category || "Project",
  };
  const titleEn = p.title_en || p.title_vi || "NS Building Project";
  const titleVi = p.title_vi || p.title_en || "Dự Án NS Building";
  const descEn = p.description_en || "";
  const descVi = p.description_vi || "";
  const image = p.after_image || p.before_image || "";
  const year = p.completed_year || new Date().getFullYear().toString();

  return {
    id: p.id,
    source: "cms",
    header: {
      location: p.suburb || "Auckland, New Zealand",
      title: { en: titleEn, vi: titleVi },
      subtitle: {
        en: descEn || `${catLabel.en} project delivered by NS Building across Auckland, New Zealand.`,
        vi: descVi || `Công trình ${catLabel.vi} do NS Building thi công tại Auckland, New Zealand.`,
      },
      cta_discuss: { en: "Discuss a Similar Project", vi: "Tư Vấn Dự Án Tương Tự" },
      cta_lookbook: { en: "Project Lookbook", vi: "Tải Hồ Sơ Công Trình" },
    },
    meta: {
      completed: { en: `Completed ${year}`, vi: `Hoàn thành ${year}` },
      lbp: "LBP #BP128842",
      award: {
        en: "Licensed & Insured",
        vi: "Cấp phép & Bảo hiểm",
      },
    },
    specs: [
      {
        label: { en: "Category", vi: "Hạng mục" },
        val: catLabel.en,
        sub: { en: "Scope of works", vi: "Phạm vi thi công" },
      },
      {
        label: { en: "Location", vi: "Khu vực" },
        val: p.suburb || "Auckland",
        sub: { en: "Greater Auckland", vi: "Khu vực Auckland" },
      },
      {
        label: { en: "Year", vi: "Năm" },
        val: year,
        sub: { en: "Handover", vi: "Bàn giao" },
      },
      {
        label: { en: "Compliance", vi: "Tuân thủ" },
        val: { en: "NZ Building Code", vi: "Quy chuẩn NZ" },
        sub: { en: "Council approved", vi: "Đạt kiểm duyệt" },
      },
      {
        label: { en: "Warranty", vi: "Bảo hành" },
        val: { en: "Workmanship", vi: "Thợ lành nghề" },
        sub: { en: "LBP certified", vi: "Chứng chỉ LBP" },
      },
    ],
    hero_showcase: {
      image,
      tag: { en: catLabel.en, vi: catLabel.vi },
      caption: {
        en: `${titleEn} — NS Building`,
        vi: `${titleVi} — NS Building`,
      },
    },
    comparison: {
      badge: { en: "Before / After", vi: "Trước / Sau" },
      title: {
        en: "See the Transformation",
        vi: "Chiêm Ngưỡng Sự Thay Đổi",
      },
      hint: {
        en: "Drag the slider to compare",
        vi: "Kéo thanh trượt để so sánh",
      },
      before_image: p.before_image || image,
      after_image: p.after_image || image,
      before_label: { en: "Before", vi: "Trước" },
      after_label: { en: "After", vi: "Sau" },
      metrics: [
        {
          icon: "location_on",
          label: { en: "Location", vi: "Vị trí" },
          val: { en: p.suburb || "Auckland", vi: p.suburb || "Auckland" },
        },
        {
          icon: "event",
          label: { en: "Completed", vi: "Hoàn thành" },
          val: { en: year, vi: year },
        },
        {
          icon: "verified",
          label: { en: "Standard", vi: "Tiêu chuẩn" },
          val: { en: "NZ Code", vi: "Quy chuẩn NZ" },
        },
      ],
    },
    scope_summary: {
      tag: { en: "Scope Summary", vi: "Tóm Tắt Hạng Mục" },
      title: {
        en: `What We Delivered in ${titleEn}`,
        vi: `Những Gì Chúng Tôi Thực Hiện cho ${titleVi}`,
      },
      desc: {
        en: descEn || `${catLabel.en} project delivered by NS Building across Auckland, New Zealand.`,
        vi: descVi || `Công trình ${catLabel.vi} do NS Building thi công tại Auckland, New Zealand.`,
      },
      highlights: descEn
        ? [
            {
              title: { en: "Full scope delivery", vi: "Thi công trọn gói" },
              desc: {
                en: descEn,
                vi: descVi || descEn,
              },
            },
          ]
        : [],
      key_specs: [
        {
          icon: "construction",
          cat: { en: "Trade", vi: "Hạng mục" },
          title: { en: catLabel.en, vi: catLabel.vi },
          sub: { en: "NS Building", vi: "NS Building" },
        },
        {
          icon: "security",
          cat: { en: "Compliance", vi: "Tuân thủ" },
          title: { en: "LBP Certified", vi: "Chứng chỉ LBP" },
          sub: { en: "BP128842", vi: "BP128842" },
        },
      ],
    },
    gallery: {
      tag: { en: "Project Gallery", vi: "Thư Viện Ảnh" },
      title: { en: "Project in Pictures", vi: "Công Trình Qua Hình Ảnh" },
      desc: {
        en: "A selection of completed work from this project.",
        vi: "Tuyển tập hình ảnh hoàn thiện từ công trình này.",
      },
      items: image
        ? [
            {
              title: { en: titleEn, vi: titleVi },
              desc: { en: descEn || catLabel.en, vi: descVi || catLabel.vi },
              image,
            },
          ]
        : [],
      material_metrics: [
        { label: { en: "Location", vi: "Vị trí" }, val: p.suburb || "Auckland", sub: { en: "NZ", vi: "NZ" } },
        { label: { en: "Year", vi: "Năm" }, val: year, sub: { en: "Handover", vi: "Bàn giao" } },
        { label: { en: "Trade", vi: "Hạng mục" }, val: catLabel.en, sub: { en: "Scope", vi: "Phạm vi" } },
        { label: { en: "Standard", vi: "Tiêu chuẩn" }, val: "NZ Code", sub: { en: "Verified", vi: "Kiểm định" } },
      ],
    },
    related_projects: {
      tag: { en: "More Work", vi: "Công Trình Khác" },
      title: { en: "Explore Similar Projects", vi: "Khám Phá Các Công Trình Tương Tự" },
      cta_all: { en: "View all projects", vi: "Xem tất cả công trình" },
      items: [],
    },
    consultation: {
      tag: { en: "Free Consultation", vi: "Tư Vấn Miễn Phí" },
      title: {
        en: "Planning a Similar Project?",
        vi: "Đang Lên Kế Hoạch Cho Công Trình Tương Tự?",
      },
      desc: {
        en: "Speak with Director Nguyen Son (LBP #BP128842) for a free, accurate on-site assessment and quote.",
        vi: "Trao đổi cùng Kỹ sư Nguyễn Sơn (LBP #BP128842) để được khảo sát hiện trạng và báo giá miễn phí, chính xác.",
      },
      cta_btn: { en: "Book a Site Visit", vi: "Đặt Lịch Khảo Sát" },
      trust_points: [
        { icon: "verified", text: { en: "LBP Certified", vi: "Chứng chỉ LBP" } },
        { icon: "schedule", text: { en: "Free quote", vi: "Báo giá miễn phí" } },
        { icon: "location_on", text: { en: "Auckland wide", vi: "Toàn Auckland" } },
      ],
    },
  };
}
