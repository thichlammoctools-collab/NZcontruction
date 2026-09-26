import React from "react";
import ProjectEditor from "@/components/admin/ProjectEditor";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default function AdminProjectDetailPage({ params }: PageProps) {
  const { id } = params;
  return <ProjectEditor initialId={id} isNew={false} />;
}
