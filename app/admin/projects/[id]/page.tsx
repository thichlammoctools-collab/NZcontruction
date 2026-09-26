import React from "react";
import ProjectEditor from "@/components/admin/ProjectEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectEditor initialId={id} isNew={false} />;
}
