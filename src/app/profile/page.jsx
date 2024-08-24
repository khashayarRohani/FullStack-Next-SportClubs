import { db } from "@/lib/db";
import "./profileForm.css";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Profile({ searchParams }) {
  const isError = searchParams.error === "true";

  async function handleProfileSubmit(formData) {
    "use server";
    const username = formData.get("username");
    console.log(username);
    const res = await db.query(`SELECT id FROM users WHERE username = $1`, [
      username,
    ]);
    if (res.rows.length > 0) {
      console.log(res.rows[0].id);
      revalidatePath("/profile");
      redirect(`/profile/${res.rows[0].id}`);
    } else {
      redirect(`/profile?error=true`);
    }
  }

  return (
    <>
      {isError && (
        <p style={{ color: "red" }}>User Not Found Try Again Or Register</p>
      )}
      <form className="registerForm" action={handleProfileSubmit}>
        <label htmlFor="username">enter your username</label>
        <input
          name="username"
          placeholder="username(Case Sensitive)"
          title="Enter a UserName"
        />
        <button type="submit" className="button">
          Check me
        </button>
      </form>
    </>
  );
}
