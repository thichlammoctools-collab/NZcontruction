import { NextResponse } from "next/server";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const servicesDetailPath = path.join(process.cwd(), "content", "services_detail.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

async function readServicesDetail(): Promise<Record<string, any>> {
  return await readJsonSafe<Record<string, any>>(servicesDetailPath, {});
}

async function writeServicesDetail(data: Record<string, any>) {
  await writeJsonAtomic(servicesDetailPath, data);
}

function revalidateContent() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/services/[serviceId]", "page");
  } catch (e) {
    console.error("revalidatePath failed:", e);
  }
}

async function syncDictionaries(serviceId: string, serviceData: any, isDelete = false) {
  try {
    const viDict = await readJsonSafe<any>(dictViPath, null as any);
    if (viDict?.services?.items) {
      if (isDelete) {
        delete viDict.services.items[serviceId];
        if (serviceId === "equipment") delete viDict.services.items["hiring"];
      } else {
        viDict.services.items[serviceId] = {
          title: serviceData.title_vi || serviceData.title_en || "Dịch vụ",
          tag: serviceData.tag_vi || serviceData.tag || "Thi công",
          desc: serviceData.desc_vi || (serviceData.intro_vi ? serviceData.intro_vi.slice(0, 150) + "..." : ""),
          icon: serviceData.icon || "construction",
        };
      }

      if (serviceId === "renovations" && viDict.featured_flagships?.feature_01 && serviceData.hero_image) {
        viDict.featured_flagships.feature_01.image = serviceData.hero_image;
      } else if (serviceId === "bathrooms" && viDict.featured_flagships?.feature_02 && serviceData.hero_image) {
        viDict.featured_flagships.feature_02.image = serviceData.hero_image;
      }

      await writeJsonAtomic(dictViPath, viDict);
    }

    const enDict = await readJsonSafe<any>(dictEnPath, null as any);
    if (enDict?.services?.items) {
      if (isDelete) {
        delete enDict.services.items[serviceId];
        if (serviceId === "equipment") delete enDict.services.items["hiring"];
      } else {
        enDict.services.items[serviceId] = {
          title: serviceData.title_en || "Service",
          tag: serviceData.tag_en || serviceData.tag || "Construction",
          desc: serviceData.desc_en || (serviceData.intro_en ? serviceData.intro_en.slice(0, 150) + "..." : ""),
          icon: serviceData.icon || "construction",
        };
      }

      if (serviceId === "renovations" && enDict.featured_flagships?.feature_01 && serviceData.hero_image) {
        enDict.featured_flagships.feature_01.image = serviceData.hero_image;
      } else if (serviceId === "bathrooms" && enDict.featured_flagships?.feature_02 && serviceData.hero_image) {
        enDict.featured_flagships.feature_02.image = serviceData.hero_image;
      }

      await writeJsonAtomic(dictEnPath, enDict);
    }
  } catch (err) {
    console.error("Error syncing dictionaries for service:", err);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const services = await readServicesDetail();

    const viDict = await readJsonSafe<any>(dictViPath, {});
    const enDict = await readJsonSafe<any>(dictEnPath, {});

    if (id) {
      const item = services[id];
      if (!item) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }
      return NextResponse.json({
        id,
        ...item,
        tag_vi: item.tag_vi || viDict?.services?.items?.[id]?.tag || "",
        tag_en: item.tag_en || enDict?.services?.items?.[id]?.tag || "",
        desc_vi: item.desc_vi || viDict?.services?.items?.[id]?.desc || "",
        desc_en: item.desc_en || enDict?.services?.items?.[id]?.desc || "",
        icon: item.icon || viDict?.services?.items?.[id]?.icon || "construction",
      });
    }

    // Convert object to array for easier consumption in frontend table/list
    const list = Object.entries(services).map(([key, item]) => ({
      id: key,
      ...item,
      tag_vi: item.tag_vi || viDict?.services?.items?.[key]?.tag || "",
      tag_en: item.tag_en || enDict?.services?.items?.[key]?.tag || "",
      desc_vi: item.desc_vi || viDict?.services?.items?.[key]?.desc || "",
      desc_en: item.desc_en || enDict?.services?.items?.[key]?.desc || "",
      icon: item.icon || viDict?.services?.items?.[key]?.icon || "construction",
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

    const services = await readServicesDetail();

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
      tag_en: body.tag_en || "",
      tag_vi: body.tag_vi || "",
      desc_en: body.desc_en || "",
      desc_vi: body.desc_vi || "",
      icon: body.icon || "construction",
      intro_en: body.intro_en || "",
      intro_vi: body.intro_vi || "",
      features_en: Array.isArray(body.features_en) ? body.features_en : [],
      features_vi: Array.isArray(body.features_vi) ? body.features_vi : [],
      timeline_steps: Array.isArray(body.timeline_steps) ? body.timeline_steps : [],
      pricing: Array.isArray(body.pricing) ? body.pricing : [],
    };

    services[serviceId] = newService;
    await writeServicesDetail(services);
    await syncDictionaries(serviceId, newService);
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

    const services = await readServicesDetail();
    if (!services[serviceId]) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    services[serviceId] = {
      ...services[serviceId],
      title_en: body.title_en ?? services[serviceId].title_en,
      title_vi: body.title_vi ?? services[serviceId].title_vi,
      hero_image: body.hero_image ?? services[serviceId].hero_image,
      tag_en: body.tag_en ?? services[serviceId].tag_en,
      tag_vi: body.tag_vi ?? services[serviceId].tag_vi,
      desc_en: body.desc_en ?? services[serviceId].desc_en,
      desc_vi: body.desc_vi ?? services[serviceId].desc_vi,
      icon: body.icon ?? services[serviceId].icon,
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

    await writeServicesDetail(services);
    await syncDictionaries(serviceId, services[serviceId]);
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

    id = id.trim();

    const services = await readServicesDetail();
    if (services[id]) {
      delete services[id];
      await writeServicesDetail(services);
    }

    await syncDictionaries(id, {}, true);
    revalidateContent();

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
