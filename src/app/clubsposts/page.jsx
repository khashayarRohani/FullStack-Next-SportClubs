import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

import "./ppst.css";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Posts({ searchParams }) {
  const res = await db.query(
    `SELECT posts.*, users.username ,users.profile_picture_url FROM posts JOIN users ON posts.user_id = users.id ORDER By posts.id`,
  );

  async function handleLike(formData) {
    "use server";
    const postId = formData.get("postId");
    await db.query(
      "UPDATE posts SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count",
      [postId],
    );

    revalidatePath("/clubsposts");
  }
  async function handleDelete(formData) {
    "use server";
    const postId = formData.get("postId");
    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);

    revalidatePath("/clubsposts");
  }

  const posts = res.rows;

  if (searchParams.format == "desc") {
    posts.reverse();
  }
  revalidatePath("/clubsposts");

  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        action="/clubsposts"
      >
        <div className="select">
          <select className="selectt" defaultValue="" name="format" id="format">
            <option disabled hidden value="">
              Order By
            </option>
            <option value="asc">Old to New</option>
            <option value="desc">New to Old</option>
          </select>
        </div>
        <button className="sortBut" type="submit">
          Submit Sort
        </button>
      </form>
      <div className="postDisplay">
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <div className="bg">
                <h1 className="h1">Posts</h1>
              </div>
              <div className="nft">
                <div className="main">
                  <div className="image-wrapper">
                    <Image
                      className="tokenImage"
                      src={post.content_picture_url}
                      alt="NFT"
                      // width={400}
                      // height={200}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "fill" }}
                      loading="lazy"
                    />
                  </div>

                  <h2>{post.title}</h2>
                  <p className="description">{post.content}</p>
                  <div className="tokenInfo">
                    <div className="price">
                      <ins>◘</ins>
                      <p>likes: {post.like_count}</p>
                    </div>
                    <div className="duration">
                      <form action={handleLike}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button className="but" type="submit">
                          Like
                        </button>
                      </form>
                      <form action={handleDelete}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button className="but">Delete</button>
                      </form>
                    </div>
                  </div>
                  <hr />
                  <div className="creator">
                    <div className="wrapper">
                      <Image
                        src={post.profile_picture_url}
                        alt="Creator"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="check">
                      <p>
                        <ins>Post by</ins> {post.username}
                      </p>
                      <div>
                        {" "}
                        <Link
                          href={`/clubsposts/${post.category_id}/${post.id}`}
                        >
                          <button className="but">Details</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
