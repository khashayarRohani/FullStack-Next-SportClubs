import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import "../ppst.css";

export default async function SingleClubPosts({ params }) {
  const categoryName = await db.query(
    `SELECT name FROM categories WHERE id = $1`,
    [params.clubId],
  );
  console.log(categoryName.rows[0].name);
  const data = await db.query(
    `SELECT posts.*, users.username ,users.profile_picture_url FROM posts JOIN users ON posts.user_id = users.id where posts.category_id =$1 ORDER By posts.id`,
    [params.clubId],
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

  const posts = data.rows;
  revalidatePath(`/clubsposts/${params.clubId}`);

  return (
    <div className="postDisplay">
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <div className="bg">
              <h4 className="h1">{categoryName.rows[0].name}</h4>
            </div>
            <div className="nft">
              <div className="main">
                <div className="image-wrapper">
                  <Image
                    className="tokenImage"
                    src={post.content_picture_url}
                    alt="NFT"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
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
                      <Link href={`/clubsposts/${post.category_id}/${post.id}`}>
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
  );
}
