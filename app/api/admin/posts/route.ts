import { NextResponse } from "next/server";
import path from "path";
import { revalidatePath } from "next/cache";
import { writeJsonAtomic, readJsonSafe } from "@/lib/json-store";

export const dynamic = "force-dynamic";

const postsFilePath = path.join(process.cwd(), "content", "posts.json");

async function readPosts(): Promise<any[]> {
  return await readJsonSafe<any[]>(postsFilePath, []);
}

async function writePosts(posts: any[]) {
  await writeJsonAtomic(postsFilePath, posts);
  try {
    revalidatePath("/[locale]", "page");
  } catch (e) {
    console.error("revalidatePath failed:", e);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const posts = await readPosts();

    if (id) {
      const post = posts.find((p) => p.id === id);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newPost = await req.json();
    const posts = await readPosts();

    const postWithId = {
      ...newPost,
      id: newPost.id || `post-${Date.now()}`,
      date: newPost.date || new Date().toISOString().split("T")[0],
      author: newPost.author || "Nguyen Son",
      content_en: newPost.content_en || "",
      content_vi: newPost.content_vi || "",
    };

    posts.unshift(postWithId);
    await writePosts(posts);

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

    const posts = await readPosts();
    const index = posts.findIndex((p) => p.id === updatedPost.id);

    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    posts[index] = {
      ...posts[index],
      ...updatedPost,
    };

    await writePosts(posts);
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

    const posts = await readPosts();
    const filtered = posts.filter((p) => p.id !== id);

    if (filtered.length === posts.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await writePosts(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
