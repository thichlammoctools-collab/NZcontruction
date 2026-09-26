import React from "react";
import ServiceEditor from "@/components/admin/ServiceEditor";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default function AdminServiceDetailPage({ params }: PageProps) {
  const { id } = params;
  return <ServiceEditor initialId={id} isNew={false} />;
}
