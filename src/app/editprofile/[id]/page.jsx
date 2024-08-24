import UploadImage from "@/components/UploadImage";
import { db } from "@/lib/db";
import regStyle from "@/app/register/regStyle.module.css";
export default async function EditProfile({ params }) {
  const userId = params.id;

  const res = await db.query(`SELECT * FROM users WHERE id=$1`, [userId]);

  const userInfo = res.rows[0];

  async function handlEditBio(formData) {
    "use server";
    const newBio = formData.get("Bio");
    await db.query(
      `UPDATE users
           SET 
             bio = $1
           WHERE id = $2;`,
      [newBio, userId],
    );
  }

  async function handlEditImg(formData) {
    "use server";
    const newImage = formData.get("imageUrl");
    await db.query(
      `UPDATE users
           SET 
             profile_picture_url = $1
           WHERE id = $2;`,
      [newImage, userId],
    );
  }
  return (
    <>
      <form
        className={regStyle.registerForm}
        action={handlEditBio}
        style={{ height: "300px" }}
      >
        <h1>Editing Bio...</h1>
        <label htmlFor="Bio">Bio:</label>
        <textarea
          name="Bio"
          placeholder={userInfo.bio}
          title="Enter bio"
          required
        ></textarea>

        <div className={regStyle.wrap}>
          <button className={regStyle.buttonn} type="submit">
            Submit
          </button>
        </div>
      </form>
      <form
        className={regStyle.registerForm}
        action={handlEditImg}
        style={{ width: "300px", height: "100px" }}
      >
        <h1>Editing Image...</h1>
        <label htmlFor="Profile_picture_url">Profile Image:</label>
        <UploadImage />
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
