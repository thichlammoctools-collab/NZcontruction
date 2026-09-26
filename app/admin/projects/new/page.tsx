import React from "react";
import ProjectEditor from "@/components/admin/ProjectEditor";

export const dynamic = "force-dynamic";

export default function AdminNewProjectPage() {
  return <ProjectEditor isNew={true} />;
}
