"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UploadImage() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    const fileName = `${Date.now()}-${image.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, image);
    if (error) {
      console.error("Upload error:", error);
      alert("Error uploading image: " + error.message);
      return;
    }
    console.log(data);
    console.log(image);

    console.log("Image uploaded:", data);
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/images/${data.path}`;

    // Update the hidden input field in the form with the uploaded image URL
    document.getElementById("imageUrl").value = imageUrl;
  };

  return (
    <div>
      <input id="Pro" type="file" onChange={handleImageChange} />
      <button type="button" onClick={handleImageUpload}>
        Upload
      </button>
    </div>
  );
}
// https://rleldvhtsecyflcdbrck.supabase.co/storage/v1/object/public/images/bpx.webp?t=2024-08-23T15%3A03%3A50.405Z

// https://rleldvhtsecyflcdbrck.supabase.co/storage/v1/object/public/images/Awesome-Basketball-Wallpaper_resized.jpg?t=2024-08-23T15%3A13%3A11.779Z
