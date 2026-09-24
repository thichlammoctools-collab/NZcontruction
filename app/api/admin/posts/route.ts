import { NextResponse } from "next/server";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const postsFilePath = path.join(process.cwd(), "content", "posts.json");

function readPosts(): any[] {
  return readJsonSafe<any[]>(postsFilePath, []);
}

function writePosts(posts: any[]) {
  writeJsonAtomic(postsFilePath, posts);
  try {
    revalidatePath("/[locale]", "page");
  } catch (e) {
    console.error("revalidatePath failed:", e);
  }
}

export async function GET() {
  try {
    const posts = readPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newPost = await req.json();
    const posts = readPosts();

    const postWithId = {
      ...newPost,
      id: newPost.id || `post-${Date.now()}`,
      date: newPost.date || new Date().toISOString().split("T")[0],
      author: newPost.author || "Nguyen Son",
    };

    posts.unshift(postWithId);
    writePosts(posts);

    return NextResponse.json({ success: true, post: postWithId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const updatedPost = await req.json();
    if (!updatedPost.id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const posts = readPosts();
    const index = posts.findIndex((p) => p.id === updatedPost.id);

    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    posts[index] = {
      ...posts[index],
      ...updatedPost,
    };

    writePosts(posts);
    return NextResponse.json({ success: true, post: posts[index] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch (e) {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const posts = readPosts();
    const filtered = posts.filter((p) => p.id !== id);

    if (filtered.length === posts.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    writePosts(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
