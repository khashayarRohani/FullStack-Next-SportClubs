import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

import "./profile.css";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export default async function SingleProfile({ params, searchParams }) {
  const isAskDelete = searchParams.permisionAsk === "true";
  console.log(` in params : ${params.id}`);
  const idNumber = parseInt(params.id, 10);
  const res = await db.query(`SELECT * FROM users WHERE id = $1`, [idNumber]);
  const userProfile = res.rows[0];

  const postCount = await db.query(
    `SELECT COUNT(*) AS post_count
FROM posts
WHERE user_id = $1
`,
    [idNumber],
  );

  async function DeleteUser() {
    "use server";
    await db.query(`DELETE FROM users WHERE id=$1`, [idNumber]);
    revalidatePath("/");

    redirect("/");
  }
  console.log(postCount.rows[0].post_count);
  return (
    <div className="CContainer">
      <div className="cardd">
        <Image
          src={userProfile.profile_picture_url}
          alt="Person"
          className="card__images"
          width={300}
          height={200}
          sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={75}
          style={{ objectFit: "cover" }}
        />
        <p className="card__name">{userProfile.username}</p>
        <p className="card__name">{userProfile.bio}</p>
        <div className="grid-container">
          <div className="grid-child-posts">
            Posts: {postCount.rows[0].post_count}
          </div>

          <div className="grid-child-followers">
            <div className="grid-child-posts">
              <form action={`/editprofile/${userProfile.id}`}>
                <button>Edit Profle</button>
              </form>
            </div>
          </div>
        </div>
        <ul className="social-icons"></ul>
        <button className="btn draw-border">
          <Link href={`/createpost/${userProfile.username}`}>Create Posts</Link>
        </button>
        <button className="btn draw-border">
          <Link href={`/profile/${userProfile.id}?permisionAsk=true`}>
            Delete Account
          </Link>
        </button>
      </div>
      {isAskDelete && (
        <form className="deleteForm" action={DeleteUser}>
          <p>Are You sure?</p>
          <button>Yes</button>
          <Link href={`/profile/${userProfile.id}`}>No</Link>
        </form>
      )}
    </div>
  );
}
