import React from "react";
import PostEditor from "@/components/admin/PostEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminPostDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PostEditor initialId={id} isNew={false} />;
}
