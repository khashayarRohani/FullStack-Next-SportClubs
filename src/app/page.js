import Image from "next/image";
import { db } from "@/lib/db";
import UploadImage from "@/components/UploadImage";
import "@/app/home.css";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* <section>
        <p>This web consist of 4 sport clubs </p>
        <p>users by registratin in web can have a dashboard and create posts</p>
        <p>In dashboard you can edit or delete your account</p>
        <p>
          users can interact with content creators by commenting and Liking the
          contents
        </p>
        <p> for leaving a comment you should first register</p>

        <p>
          you can delete or edit each post as well but before that you have to
          check your username, if it matches you can edit it
        </p>
        <p>Delete and Like buttons are open to everyone</p>
        <p>you can see posts of each club individually as well</p>
        <p>
          you can see all the post in a page and choose the order to see them
        </p>
      </section> */}

      <fieldset className="HomeDiv">
        <legend style={{ fontSize: "30px" }}>Sport Club</legend>
        <h5 className="legendPadding" style={{ marginTop: "5%" }}>
          <p>This web consist of 4 sport clubs </p>
          <p>
            users by registratin in web can have a dashboard and create posts
          </p>
          <p>In dashboard you can edit or delete your account</p>
          <p>
            users can interact with content creators by commenting and Liking
            the contents
          </p>
          <p> for leaving a comment you should first register</p>

          <p>
            you can delete or edit each post as well but before that you have to
            check your username, if it matches you can edit it
          </p>
          <p>Delete and Like buttons are open to everyone</p>
          <p>you can see posts of each club individually as well</p>
          <p>
            you can see all the post in a page and choose the order to see them
          </p>
        </h5>
        <h3>Created by NEXT.js</h3>
        <h1 className="legendPadding">Developer: Khashayar</h1>
        <Link
          href="/register"
          className="legendPadding"
          style={{
            border: "1px solid wheat",
            borderRadius: "6px",
            padding: "3%",
            color: "wheat",
          }}
        >
          Register
        </Link>
      </fieldset>
    </div>
  );
}
