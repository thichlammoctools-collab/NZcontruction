import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const projectsFilePath = path.join(process.cwd(), "content", "projects.json");

export async function GET() {
  try {
    const data = fs.readFileSync(projectsFilePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newProject = await req.json();
    const data = fs.readFileSync(projectsFilePath, "utf8");
    const projects = JSON.parse(data);

    const projectWithId = {
      ...newProject,
      id: newProject.id || `project-${Date.now()}`,
      completed_year: newProject.completed_year || new Date().getFullYear().toString(),
    };

    projects.unshift(projectWithId);
    fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), "utf8");

    return NextResponse.json({ success: true, project: projectWithId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}
