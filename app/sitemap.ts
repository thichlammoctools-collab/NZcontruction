import { MetadataRoute } from "next";
import path from "path";
import { readJsonSafe } from "@/lib/json-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nsbuilding.co.nz";
  const locales = ["en", "vi"];

  const serviceIds = [
    "renovations",
    "bathrooms",
    "cabinets",
    "flooring",
    "doors",
    "painting",
    "hiring",
    "maintenance",
  ];

  // Read projects + posts dynamically so new admin-created entries appear.
  const projectsData = await readJsonSafe<any[]>(
    path.join(process.cwd(), "content", "projects.json"),
    []
  );
  const projects = projectsData.map((p) => p.id);

  const postsData = await readJsonSafe<any[]>(
    path.join(process.cwd(), "content", "posts.json"),
    []
  );
  const posts = postsData.map((p) => p.id);

  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });

    serviceIds.forEach((id) => {
      routes.push({
        url: `${baseUrl}/${locale}/services/${id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });

    projects.forEach((id) => {
      routes.push({
        url: `${baseUrl}/${locale}/projects/${id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    routes.push({
      url: `${baseUrl}/${locale}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });

    posts.forEach((id) => {
      routes.push({
        url: `${baseUrl}/${locale}/posts/${id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    });
  });

  return routes;
}
