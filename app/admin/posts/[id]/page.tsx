import React from "react";
import PostEditor from "@/components/admin/PostEditor";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default function AdminPostDetailPage({ params }: PageProps) {
  const { id } = params;
  return <PostEditor initialId={id} isNew={false} />;
}
