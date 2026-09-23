import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const postsFilePath = path.join(process.cwd(), "content", "posts.json");

export async function GET() {
  try {
    const data = fs.readFileSync(postsFilePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to read posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newPost = await req.json();
    const data = fs.readFileSync(postsFilePath, "utf8");
    const posts = JSON.parse(data);

    const postWithId = {
      ...newPost,
      id: newPost.id || `post-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      author: newPost.author || "Nguyen Son",
    };

    posts.unshift(postWithId);
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), "utf8");

    return NextResponse.json({ success: true, post: postWithId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
