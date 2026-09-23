import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const servicesDetailPath = path.join(process.cwd(), "content", "services_detail.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

function readServicesDetail(): Record<string, any> {
  try {
    const data = fs.readFileSync(servicesDetailPath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function writeServicesDetail(data: Record<string, any>) {
  fs.writeFileSync(servicesDetailPath, JSON.stringify(data, null, 2), "utf8");
}

function syncDictionaries(serviceId: string, serviceData: any, isDelete = false) {
  try {
    if (fs.existsSync(dictViPath)) {
      const viDict = JSON.parse(fs.readFileSync(dictViPath, "utf8"));
      if (viDict.services && viDict.services.items) {
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
        fs.writeFileSync(dictViPath, JSON.stringify(viDict, null, 2), "utf8");
      }
    }

    if (fs.existsSync(dictEnPath)) {
      const enDict = JSON.parse(fs.readFileSync(dictEnPath, "utf8"));
      if (enDict.services && enDict.services.items) {
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
        fs.writeFileSync(dictEnPath, JSON.stringify(enDict, null, 2), "utf8");
      }
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

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
