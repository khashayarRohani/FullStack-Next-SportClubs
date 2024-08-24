import { db } from "@/lib/db";
import regStyle from "@/app/register/regStyle.module.css";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import UploadImage from "@/components/UploadImage";
export default async function EditPost({ params, searchParams }) {
  const res = await db.query(`SELECT * FROM categories`);
  const categories = res.rows;
  const resp = await db.query(`SELECT * FROM posts WHERE id =$1`, [params.id]);
  const post = resp.rows[0];
  const respo = await db.query(`SELECT * FROM users WHERE id =$1`, [
    post.user_id,
  ]);
  const error = searchParams.error === "true";
  const user = respo.rows[0];
  async function handleEditPost(formData) {
    "use server";

    const postId = post.id;
    const username = formData.get("username");

    const title = formData.get("title");

    const content = formData.get("content");

    const categoryId = formData.get("category");
    const newImgUrl = formData.get("imageUrl");

    console.log(`cat is ${categoryId}`);
    const query = `
    UPDATE Posts
SET
    user_id = $1,         
    category_id = $2,       
    title = $3,             
    content = $4,            
    content_picture_url = $5
            
WHERE id = $6; 
  `;

    const values = [
      post.user_id,
      categoryId,
      title,
      content,
      newImgUrl,
      postId,
    ];
    if (username == user.username) {
      await db.query(query, values);
      revalidatePath(`/createposts/${params.username}`);
      redirect("/clubsposts");
    } else {
      redirect(`/edit/${params.id}?error=true`);
    }
  }

  return (
    <>
      <form className={regStyle.registerForm} action={handleEditPost}>
        {error && (
          <p style={{ color: "red" }}>
            {" "}
            username does not match the content creator
          </p>
        )}
        <label>Enter your username</label>
        <input
          name="username"
          placeholder="username"
          title="Enter username"
          required
        />
        <label htmlFor="title">Post Title:</label>
        <input
          name="title"
          placeholder={post.title}
          title="Enter title"
          required
        />

        <label htmlFor="content">Content:</label>
        <input
          name="content"
          placeholder={post.content}
          title="Enter content"
          required
        />

        <label htmlFor="category">Category:</label>
        <select name="category">
          <option value="" disabled>
            Select a club
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="content_picture_url">Content Image:</label>
        <UploadImage />
        <input type="hidden" name="imageUrl" id="imageUrl" />

        <div className={regStyle.wrap}>
          <button className={regStyle.buttonn}>Submit</button>
        </div>
      </form>
    </>
  );
}
