import { NextResponse } from "next/server";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const settingsFilePath = path.join(process.cwd(), "content", "site_settings.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

async function readJsonFile(filePath: string, fallback: any = {}) {
  return await readJsonSafe(filePath, fallback);
}

async function writeJsonFile(filePath: string, data: any) {
  await writeJsonAtomic(filePath, data);
}

export async function GET() {
  try {
    const siteSettings = await readJsonFile(settingsFilePath, {});
    const viDict = await readJsonFile(dictViPath, {});
    const enDict = await readJsonFile(dictEnPath, {});

    return NextResponse.json({
      siteSettings,
      hero: {
        vi: viDict.hero || {},
        en: enDict.hero || {},
      },
      contact: {
        phone: siteSettings.phone || viDict.nav?.phone || "027 666 6510",
        mobile: siteSettings.mobile || viDict.nav?.mobile || "021 153 1510",
        whatsapp: siteSettings.whatsapp || "64211531510",
        facebook: siteSettings.facebook || "https://www.facebook.com/nsbuildingnz",
        facebookMessenger: siteSettings.facebookMessenger || "https://m.me/nsbuildingnz",
        email: siteSettings.email || viDict.nav?.email || "contact@nsbuilding.co.nz",
        location_vi: viDict.nav?.location || "Auckland & Toàn New Zealand",
        location_en: enDict.nav?.location || "Auckland & Across New Zealand",
        brandName: siteSettings.brandName || "NS Building Ltd",
        director: siteSettings.director || "Nguyễn Sơn",
        lbpLicense: siteSettings.lbpLicense || "BP128842",
      },
      before_after: {
        vi: viDict.before_after || {},
        en: enDict.before_after || {},
      },
      toggles: siteSettings.toggles || {
        showBeforeAfter: true,
        showReviews: true,
        showQuoteForm: true,
        showChatWidget: true,
        showWhatsappBtn: true,
        showFacebookBtn: true,
        showPricingSection: true,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load interface settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { siteSettings, hero, contact, before_after, toggles } = body;

    // 1. Update site_settings.json
    const currentSettings = await readJsonFile(settingsFilePath, {});
    const updatedSettings = {
      ...currentSettings,
      ...(siteSettings || {}),
      phone: contact?.phone ?? currentSettings.phone,
      mobile: contact?.mobile ?? currentSettings.mobile,
      whatsapp: contact?.whatsapp ?? currentSettings.whatsapp,
      facebook: contact?.facebook ?? currentSettings.facebook,
      facebookMessenger: contact?.facebookMessenger ?? currentSettings.facebookMessenger,
      email: contact?.email ?? currentSettings.email,
      brandName: contact?.brandName ?? currentSettings.brandName,
      director: contact?.director ?? currentSettings.director,
      lbpLicense: contact?.lbpLicense ?? currentSettings.lbpLicense,
      heroBackgroundImage: hero?.backgroundImage ?? currentSettings.heroBackgroundImage,
      toggles: {
        ...(currentSettings.toggles || {}),
        ...(toggles || {}),
      },
    };
    await writeJsonFile(settingsFilePath, updatedSettings);

    // 2. Update vi.json
    const viDict = await readJsonFile(dictViPath, {});
    if (viDict.nav && contact) {
      if (contact.phone) viDict.nav.phone = contact.phone;
      if (contact.mobile) viDict.nav.mobile = contact.mobile;
      if (contact.email) viDict.nav.email = contact.email;
      if (contact.location_vi) viDict.nav.location = contact.location_vi;
    }
    if (viDict.quick_contact && contact) {
      if (contact.phone) viDict.quick_contact.phone = contact.phone;
      if (contact.mobile) viDict.quick_contact.mobile = contact.mobile;
      if (contact.email) viDict.quick_contact.email = contact.email;
    }
    if (viDict.hero && hero?.vi) {
      viDict.hero = {
        ...viDict.hero,
        ...hero.vi,
      };
    }
    if (viDict.before_after && before_after?.vi) {
      viDict.before_after = {
        ...viDict.before_after,
        ...before_after.vi,
      };
    }
    await writeJsonFile(dictViPath, viDict);

    // 3. Update en.json
    const enDict = await readJsonFile(dictEnPath, {});
    if (enDict.nav && contact) {
      if (contact.phone) enDict.nav.phone = contact.phone;
      if (contact.mobile) enDict.nav.mobile = contact.mobile;
      if (contact.email) enDict.nav.email = contact.email;
      if (contact.location_en) enDict.nav.location = contact.location_en;
    }
    if (enDict.quick_contact && contact) {
      if (contact.phone) enDict.quick_contact.phone = contact.phone;
      if (contact.mobile) enDict.quick_contact.mobile = contact.mobile;
      if (contact.email) enDict.quick_contact.email = contact.email;
    }
    if (enDict.hero && hero?.en) {
      enDict.hero = {
        ...enDict.hero,
        ...hero.en,
      };
    }
    if (enDict.before_after && before_after?.en) {
      enDict.before_after = {
        ...enDict.before_after,
        ...before_after.en,
      };
    }
    await writeJsonFile(dictEnPath, enDict);

    try {
      revalidatePath("/[locale]", "page");
    } catch (e) {
      console.error("revalidatePath failed:", e);
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save interface settings" }, { status: 500 });
  }
}
