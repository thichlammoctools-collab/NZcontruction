import React from "react";
import ServiceEditor from "@/components/admin/ServiceEditor";

export const dynamic = "force-dynamic";

export default function AdminNewServicePage() {
  return <ServiceEditor isNew={true} />;
}
