import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message, locale } = await req.json();
    const text = (message || "").toLowerCase();

    const isVi = locale === "vi";
    let leadCaptured = false;

    // Check if message contains contact info (phone number or email)
    const hasPhone = /\b(02\d{7,9}|09\d{8}|\+64\d{8,10}|\d{8,11})\b/.test(text.replace(/[\s-]/g, ""));
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);

    let reply = "";

    if (hasPhone || hasEmail) {
      leadCaptured = true;
      reply = isVi
        ? "Dạ em đã ghi nhận thông tin liên hệ của Anh/Chị! Anh Nguyễn Sơn và đội ngũ kỹ thuật NS Building sẽ liên hệ lại trực tiếp qua số điện thoại này trong thời gian sớm nhất để hẹn lịch khảo sát hiện trạng và gửi báo giá chi tiết ạ."
        : "Thank you! I have recorded your contact details. Nguyen Son and our building team will be in touch shortly to discuss your project scope and schedule a site inspection.";
    } else if (text.includes("giá") || text.includes("chi phí") || text.includes("cost") || text.includes("quote") || text.includes("price") || text.includes("rate")) {
      reply = isVi
        ? "Chi phí sửa chữa nhà tại New Zealand phụ thuộc vào diện tích và vật liệu hoàn thiện (ví dụ: phòng tắm trọn gói từ 15k-30k NZD, làm sàn gỗ từ 80-150 NZD/m2). Anh/Chị có thể để lại Số Điện Thoại hoặc Suburb tại New Zealand để anh Sơn gọi tư vấn và lên dự toán chi tiết miễn phí nhé!"
        : "Renovation costs in NZ vary based on scope, council consent requirements, and material finishes (e.g. bathroom upgrades typically range from $15k–$35k NZD). Please share your phone number or Auckland suburb, and Nguyen Son will provide a free, accurate estimate.";
    } else if (text.includes("phòng tắm") || text.includes("toilet") || text.includes("bathroom") || text.includes("bath")) {
      reply = isVi
        ? "NS Building chuyên cải tạo phòng tắm cao cấp: thi công chống thấm chuẩn quy chuẩn New Zealand, ốp lát gạch đá tỉ mỉ, lắp bồn tắm đá và tủ lavabo nổi. Anh/Chị cho em xin số điện thoại hoặc địa chỉ công trình để anh Sơn liên hệ tư vấn nhé!"
        : "We specialize in luxury bathroom renovations: certified council-approved waterproofing, precision tiling, freestanding stone baths, and custom oak vanities. Would you like us to arrange a free site consultation? Please share your phone number.";
    } else if (text.includes("sàn") || text.includes("floor") || text.includes("flooring") || text.includes("timber")) {
      reply = isVi
        ? "Bên em có đầy đủ các giải pháp sàn: phục hồi sàn gỗ tự nhiên, lát sàn gỗ sồi kỹ thuật (engineered oak), gạch men và vinyl chống nước cao cấp. Anh/Chị đang dự định làm diện tích khoảng bao nhiêu mét vuông ạ?"
        : "We supply and install engineered oak herringbone, solid native timber restoration, acoustic vinyl planking, and stone tiles. What approximate square meterage are you looking to cover?";
    } else if (text.includes("tủ") || text.includes("bếp") || text.includes("cabinet") || text.includes("kitchen") || text.includes("joinery")) {
      reply = isVi
        ? "NS Building thiết kế và đóng tủ bếp, tủ áo âm tường theo yêu cầu chuẩn xác từng milimét với phụ kiện ray trượt cao cấp. Anh/Chị vui lòng để lại số điện thoại để bên em gửi mẫu thiết kế tham khảo nhé!"
        : "We design and craft bespoke architectural kitchen cabinetry and walk-in wardrobes with soft-close hardware and honed stone benchtops. Please leave your contact number so we can share our portfolio.";
    } else if (text.includes("địa chỉ") || text.includes("ở đâu") || text.includes("where") || text.includes("location") || text.includes("auckland")) {
      reply = isVi
        ? "NS Building hoạt động trên toàn bộ khu vực Auckland (North Shore, Central Auckland, Remuera, Epsom...) và các khu vực lân cận New Zealand. Hotline: 027 666 6510 & 021 153 1510."
        : "We operate across Greater Auckland (Remuera, Epsom, North Shore, Takapuna, Central) and surrounding New Zealand regions. Office: 027 666 6510 | Mobile: 021 153 1510.";
    } else {
      reply = isVi
        ? "Dạ vâng! Để được hỗ trợ nhanh nhất và nhận báo giá chính xác, Anh/Chị có thể để lại Số Điện Thoại hoặc gọi trực tiếp cho anh Nguyễn Sơn qua hotline 027 666 6510 nhé!"
        : "Thank you for reaching out! To get tailored advice and an accurate estimate, feel free to leave your contact number or call our team directly at 027 666 6510.";
    }

    return NextResponse.json({ reply, leadCaptured });
  } catch {
    return NextResponse.json({
      reply: "Thank you for contacting NS Building. Please call 027 666 6510 for direct assistance.",
      leadCaptured: false,
    });
  }
}
