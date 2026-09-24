import { NextResponse } from "next/server";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const servicesDetailPath = path.join(process.cwd(), "content", "services_detail.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

function readServicesDetail(): Record<string, any> {
  return readJsonSafe<Record<string, any>>(servicesDetailPath, {});
}

function writeServicesDetail(data: Record<string, any>) {
  writeJsonAtomic(servicesDetailPath, data);
}

function revalidateContent() {
  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/services/[serviceId]", "page");
  } catch (e) {
    console.error("revalidatePath failed:", e);
  }
}

function syncDictionaries(serviceId: string, serviceData: any, isDelete = false) {
  try {
    const viDict = readJsonSafe<any>(dictViPath, null as any);
    if (viDict?.services?.items) {
      if (isDelete) {
        delete viDict.services.items[serviceId];
      } else {
        viDict.services.items[serviceId] = {
          title: serviceData.title_vi || serviceData.title_en || "Dịch vụ",
          tag: serviceData.tag_vi || serviceData.tag || "Thi công",
          desc: serviceData.intro_vi ? serviceData.intro_vi.slice(0, 150) + "..." : "",
          icon: serviceData.icon || "construction",
        };
      }
      writeJsonAtomic(dictViPath, viDict);
    }

    const enDict = readJsonSafe<any>(dictEnPath, null as any);
    if (enDict?.services?.items) {
      if (isDelete) {
        delete enDict.services.items[serviceId];
      } else {
        enDict.services.items[serviceId] = {
          title: serviceData.title_en || "Service",
          tag: serviceData.tag_en || serviceData.tag || "Construction",
          desc: serviceData.intro_en ? serviceData.intro_en.slice(0, 150) + "..." : "",
          icon: serviceData.icon || "construction",
        };
      }
      writeJsonAtomic(dictEnPath, enDict);
    }
  } catch (err) {
    console.error("Error syncing dictionaries for service:", err);
  }
}

export async function GET() {
  try {
    const services = readServicesDetail();
    // Convert object to array for easier consumption in frontend table/list
    const list = Object.entries(services).map(([id, item]) => ({
      id,
      ...item,
    }));
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let serviceId = body.id;

    if (!serviceId) {
      serviceId = (body.title_en || "service")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const services = readServicesDetail();

    if (services[serviceId]) {
      return NextResponse.json(
        { error: "Dịch vụ với mã ID này đã tồn tại" },
        { status: 400 }
      );
    }

    const newService = {
      title_en: body.title_en || "",
      title_vi: body.title_vi || "",
      hero_image: body.hero_image || "",
      intro_en: body.intro_en || "",
      intro_vi: body.intro_vi || "",
      features_en: Array.isArray(body.features_en) ? body.features_en : [],
      features_vi: Array.isArray(body.features_vi) ? body.features_vi : [],
      timeline_steps: Array.isArray(body.timeline_steps) ? body.timeline_steps : [],
      pricing: Array.isArray(body.pricing) ? body.pricing : [],
    };

    services[serviceId] = newService;
    writeServicesDetail(services);
    syncDictionaries(serviceId, { ...newService, tag_vi: body.tag_vi, tag_en: body.tag_en, icon: body.icon });
    revalidateContent();

    return NextResponse.json({
      success: true,
      service: { id: serviceId, ...newService },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const serviceId = body.id;

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const services = readServicesDetail();
    if (!services[serviceId]) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    services[serviceId] = {
      ...services[serviceId],
      title_en: body.title_en ?? services[serviceId].title_en,
      title_vi: body.title_vi ?? services[serviceId].title_vi,
      hero_image: body.hero_image ?? services[serviceId].hero_image,
      intro_en: body.intro_en ?? services[serviceId].intro_en,
      intro_vi: body.intro_vi ?? services[serviceId].intro_vi,
      features_en: Array.isArray(body.features_en)
        ? body.features_en
        : services[serviceId].features_en,
      features_vi: Array.isArray(body.features_vi)
        ? body.features_vi
        : services[serviceId].features_vi,
      timeline_steps: Array.isArray(body.timeline_steps)
        ? body.timeline_steps
        : services[serviceId].timeline_steps,
      pricing: Array.isArray(body.pricing)
        ? body.pricing
        : services[serviceId].pricing,
    };

    writeServicesDetail(services);
    syncDictionaries(serviceId, {
      ...services[serviceId],
      tag_vi: body.tag_vi,
      tag_en: body.tag_en,
      icon: body.icon,
    });
    revalidateContent();

    return NextResponse.json({
      success: true,
      service: { id: serviceId, ...services[serviceId] },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch (e) {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const services = readServicesDetail();
    if (!services[id]) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    delete services[id];
    writeServicesDetail(services);
    syncDictionaries(id, {}, true);
    revalidateContent();

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
