import { ImageToURL } from "@/lib/imageToUrl";
import regStyle from "./regStyle.module.css";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import UploadImage from "@/components/UploadImage";

export default function Register() {
  async function handlAddUser(formData) {
    "use server";

    const username = formData.get("userName");
    const bio = formData.get("Bio");
    const imageUrl = formData.get("imageUrl");
    const res = await db.query(
      `INSERT INTO users (username, bio, profile_picture_url) VALUES ($1, $2, $3) RETURNING id`,
      [username, bio, imageUrl],
    );

    console.log(res.rows[0]);

    revalidatePath("/register");
    redirect(`/profile/${res.rows[0].id}`);
  }

  return (
    <>
      <h1>Register</h1>

      <form className={regStyle.registerForm} action={handlAddUser}>
        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          minLength={2}
          maxLength={10}
          name="userName"
          id="userName"
          placeholder="username"
          title="Enter Username"
          required
        />

        <label htmlFor="Bio">Bio:</label>
        <textarea
          name="Bio"
          id="Bio"
          placeholder="bio"
          title="Enter bio"
          required
        ></textarea>

        <label htmlFor="Pro">Profile Image:</label>
        <UploadImage id="Pro" />
        <input type="hidden" name="imageUrl" id="imageUrl" />

        <div className={regStyle.wrap}>
          <button className={regStyle.buttonn} type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
