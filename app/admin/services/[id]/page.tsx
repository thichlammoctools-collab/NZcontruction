import React from "react";
import ServiceEditor from "@/components/admin/ServiceEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ServiceEditor initialId={id} isNew={false} />;
}
