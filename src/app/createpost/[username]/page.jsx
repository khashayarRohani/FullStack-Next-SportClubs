import { db } from "@/lib/db";
import regStyle from "@/app/register/regStyle.module.css";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import UploadImage from "@/components/UploadImage";
export default async function PostForm({ params }) {
  const res = await db.query(`SELECT * FROM categories`);
  const categories = res.rows;

  async function handleAddPost(formData) {
    "use server";
    const res = await db.query(`SELECT * FROM users WHERE username =$1`, [
      params.username,
    ]);
    const user = res.rows[0];
    const userId = user.id;

    const title = formData.get("title");

    const content = formData.get("content");

    const categoryId = formData.get("category");
    const newImgUrl = formData.get("imageUrl");

    console.log(`cat is ${categoryId}`);
    const query = `
    INSERT INTO posts (user_id, category_id, title, content, content_picture_url, like_count)
    VALUES ($1, $2, $3, $4, $5, 0);
  `;

    const values = [userId, categoryId, title, content, newImgUrl];

    await db.query(query, values);
    revalidatePath(`/createposts/${params.username}`);
    redirect("/clubsposts");
  }

  return (
    <>
      <form className={regStyle.registerForm} action={handleAddPost}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          minLength={2}
          maxLength={10}
          name="username"
          placeholder="username"
          title="Enter Username"
          value={params.username}
          required
          disabled
        />

        <label htmlFor="title">Post Title:</label>
        <input name="title" placeholder="title" title="Enter title" required />

        <label htmlFor="content">Content:</label>
        <input
          name="content"
          placeholder="content"
          title="Enter content"
          required
        />

        <label htmlFor="category">Category:</label>
        <select name="category" defaultValue="">
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
