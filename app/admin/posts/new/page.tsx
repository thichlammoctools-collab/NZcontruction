import React from "react";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default function AdminNewPostPage() {
  return <PostEditor isNew={true} />;
}
