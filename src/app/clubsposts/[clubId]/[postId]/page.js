import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import "../../../clubsposts/ppst.css";
import "./comments.css";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function SinglePost({ params, searchParams }) {
  const showCommentForm = searchParams.showCommentForm === "true";
  const showForm = searchParams.showForm === "true";
  const userNotFound = searchParams.userNotFound === "true";
  let i = 0;
  const postId = params.postId;
  const data = await db.query(
    `SELECT 
    posts.id,
    posts.title,
    posts.content,
    posts.content_picture_url,
    posts.like_count,
    post_creator.username AS post_creator_username,
    post_creator.profile_picture_url AS post_creator_profile_picture_url,
    categories.name AS category_name, 
    categories.id AS category_id,
    ARRAY_AGG(CONCAT(commenters.username, ': ', comments.content)) AS comments
FROM 
    posts
JOIN 
    users AS post_creator ON posts.user_id = post_creator.id
LEFT JOIN 
    comments ON posts.id = comments.post_id
LEFT JOIN 
    users AS commenters ON comments.user_id = commenters.id
LEFT JOIN 
    categories ON posts.category_id = categories.id  
WHERE 
    posts.id = $1
GROUP BY 
    posts.id, 
    posts.title, 
    posts.content, 
    posts.content_picture_url, 
    posts.like_count, 
    post_creator.username, 
    post_creator.profile_picture_url,
    categories.name  ,categories.id
`,
    [postId],
  );
  const post = data.rows[0];
  async function handleLike(formData) {
    "use server";
    const postId = formData.get("postId");
    await db.query(
      "UPDATE posts SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count",
      [postId],
    );

    revalidatePath(`/clubsposts/${post.category_id}/${post.id}`);
  }
  async function handleDelete(formData) {
    "use server";
    const postId = formData.get("postId");
    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);

    revalidatePath("/clubsposts");
  }
  async function handleEdit(formData) {
    "use server";
    const postId = formData.get("postId");
    revalidatePath("/clubsposts");
    redirect(`/editpost/${postId}`);
  }
  async function handleCheckSubmit(formData) {
    "use server";
    const username = formData.get("username");
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length > 0) {
      // Redirect to display the comment form
      redirect(
        `/clubsposts/${params.categoryId}/${params.postId}?showCommentForm=true&userId=${user.rows[0].id}`,
      );
    } else {
      // Handle user not found case (you can redirect or show an error)
      console.log("not found");

      redirect(
        `/clubsposts/${params.categoryId}/${params.postId}?userNotFound=true`,
      );
    }
  }

  async function handleShowForm() {
    "use server";
    redirect(`/clubsposts/${params.categoryId}/${params.postId}?showForm=true`);
  }
  async function handleSubmit(formData) {
    "use server";
    const content = formData.get("content");
    const userId = formData.get("user_id");
    const postId = formData.get("post_id");

    await db.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)",
      [postId, userId, content],
    );

    // Redirect back to the post page without the forms
    redirect(`/clubsposts/${params.categoryId}/${params.postId}`);
  }

  return (
    <>
      <div>
        <div className="bg">
          <h1 className="h1">Detail</h1>
        </div>
        <div className="nft">
          <div className="main">
            <div className="image-wrapper">
              <Image
                className="tokenImage"
                src={post.content_picture_url} // Use post.content_picture_url
                alt="Post Content"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <h2>{post.title}</h2>
            <p className="description">{post.content}</p>
            <p className="description">category:{post.category_name}</p>
            <div className="tokenInfo">
              <div className="price">
                <ins>◘</ins>
                <p>likes: {post.like_count}</p> {/* Use post.like_count */}
              </div>

              <div className="durationn">
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
                <form action={handleEdit}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button className="but">Edit</button>
                </form>
              </div>
            </div>

            <hr />
            <div className="creator">
              <div className="wrapper">
                <Image
                  src={post.post_creator_profile_picture_url} // Use post.post_creator_profile_picture_url
                  alt="Creator"
                  width={200}
                  height={200}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="check">
                <p>
                  <ins>Post by</ins> {post.post_creator_username}{" "}
                  {/* Use post.post_creator_username */}
                </p>
                <div>
                  <Link href={`/clubsposts`}>
                    <button className="but">Return</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="list">
          <h1> Comments</h1>
          <ul>
            {post.comments.map((comment) => {
              return (
                <li key={i++}>
                  <p>{comment}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div>
        <div>
          {!showForm && !showCommentForm && (
            <form action={handleShowForm}>
              <button className="butto" type="submit">
                Add Comment
              </button>
            </form>
          )}
          {userNotFound && <p style={{ color: "red" }}>Register first</p>}
          {showForm && !showCommentForm && (
            <form className="commentForms" action={handleCheckSubmit}>
              <label htmlFor="username">Enter your username</label>
              <input
                name="username"
                placeholder="username (Case Sensitive)"
                title="Enter a UserName"
              />
              <button className="butto">Check me</button>
            </form>
          )}

          {showCommentForm && (
            <form className="commentForms" action={handleSubmit}>
              <label htmlFor="content">Leave a Comment</label>
              <textarea
                name="content"
                placeholder="Write your comments here"
                title="Leave comment"
              ></textarea>
              <input type="hidden" name="user_id" value={searchParams.userId} />
              <input type="hidden" name="post_id" value={params.postId} />
              <button className="butto">Submit comment</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
