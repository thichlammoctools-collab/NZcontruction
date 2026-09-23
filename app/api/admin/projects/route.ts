import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const projectsFilePath = path.join(process.cwd(), "content", "projects.json");

function readProjects(): any[] {
  try {
    const data = fs.readFileSync(projectsFilePath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeProjects(projects: any[]) {
  fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), "utf8");
}

export async function GET() {
  try {
    const projects = readProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newProject = await req.json();
    const projects = readProjects();

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
    writeProjects(projects);

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

    const projects = readProjects();
    const index = projects.findIndex((p) => p.id === updatedProject.id);

    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      ...updatedProject,
    };

    writeProjects(projects);
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

    const projects = readProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    writeProjects(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
