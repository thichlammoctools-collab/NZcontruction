import { NextResponse } from "next/server";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const projectsFilePath = path.join(process.cwd(), "content", "projects.json");
const dictViPath = path.join(process.cwd(), "content", "dictionaries", "vi.json");
const dictEnPath = path.join(process.cwd(), "content", "dictionaries", "en.json");

function getCategoryLabel(category: string, locale: "vi" | "en"): string {
  const map: Record<string, { vi: string; en: string }> = {
    renovations: { vi: "Cải Tạo Nhà", en: "Renovation" },
    bathrooms: { vi: "Phòng Tắm", en: "Bathroom" },
    cabinets: { vi: "Tủ Bếp & Đồ Gỗ", en: "Joinery" },
    flooring: { vi: "Sàn Nhà", en: "Flooring" },
    doors: { vi: "Cửa & Mộc", en: "Doors" },
    painting: { vi: "Sơn Bả", en: "Painting" },
    hiring: { vi: "Cho Thuê Thiết Bị", en: "Equipment Hire" },
    maintenance: { vi: "Bảo Trì Nhà Cửa", en: "Maintenance" },
  };
  return map[category]?.[locale] || (locale === "vi" ? "Công Trình" : "Project");
}

async function syncProjectsToDictionaries(projects: any[]) {
  try {
    const viDict = await readJsonSafe<any>(dictViPath, null as any);
    if (viDict?.portfolio) {
      viDict.portfolio.items = projects.map((p) => ({
        id: p.id,
        category: p.category || "renovations",
        category_label: getCategoryLabel(p.category, "vi"),
        location: p.suburb || "Auckland",
        year: p.completed_year ? `Hoàn thành ${p.completed_year}` : "Hoàn thành 2026",
        title: p.title_vi || p.title_en || "Dự Án NS Building",
        desc: p.description_vi || p.description_en || "",
        image: p.after_image || p.image || p.before_image || "",
      }));
      await writeJsonAtomic(dictViPath, viDict);
    }

    const enDict = await readJsonSafe<any>(dictEnPath, null as any);
    if (enDict?.portfolio) {
      enDict.portfolio.items = projects.map((p) => ({
        id: p.id,
        category: p.category || "renovations",
        category_label: getCategoryLabel(p.category, "en"),
        location: p.suburb || "Auckland",
        year: p.completed_year ? `Completed ${p.completed_year}` : "Completed 2026",
        title: p.title_en || p.title_vi || "NS Building Project",
        desc: p.description_en || p.description_vi || "",
        image: p.after_image || p.image || p.before_image || "",
      }));
      await writeJsonAtomic(dictEnPath, enDict);
    }
  } catch (err) {
    console.error("Error syncing projects to dictionaries:", err);
  }
}

async function readProjects(): Promise<any[]> {
  return await readJsonSafe<any[]>(projectsFilePath, []);
}

async function writeProjects(projects: any[]) {
  await writeJsonAtomic(projectsFilePath, projects);
  await syncProjectsToDictionaries(projects);
  revalidatePublicPages();
}

function revalidatePublicPages() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "page");
  } catch (e) {
    console.error("revalidatePath failed:", e);
  }
}

export const revalidate = 0;

export async function GET() {
  try {
    const projects = await readProjects();
    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newProject = await req.json();
    const projects = await readProjects();

    const slug = newProject.id
      ? newProject.id
      : (newProject.title_en || "project")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

    const projectWithId = {
      ...newProject,
      id: slug || `project-${Date.now()}`,
      completed_year: newProject.completed_year || new Date().getFullYear().toString(),
    };

    projects.unshift(projectWithId);
    await writeProjects(projects);

    return NextResponse.json({ success: true, project: projectWithId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const updatedProject = await req.json();
    if (!updatedProject.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projects = await readProjects();
    const index = projects.findIndex((p) => p.id === updatedProject.id);

    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      ...updatedProject,
    };

    await writeProjects(projects);
    return NextResponse.json({ success: true, project: projects[index] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projects = await readProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await writeProjects(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
