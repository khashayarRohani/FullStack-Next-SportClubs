"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import style from "./style.module.css";
import { useState } from "react";
export default function Header() {
  const router = useRouter(); // Use the useRouter hook to perform redirections
  const [selectedValue, setSelectedValue] = useState("");
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue) {
      router.push(selectedValue); // Redirect to the selected path
    }
    setSelectedValue("");
  };

  return (
    <div className={style.header}>
      <h1>Sport Clubs</h1>
      <nav>
        <Link className="NavItem3Hide" href="/">
          Home
        </Link>
        <Link href="/register">Register</Link>
        <Link className="NavItem1Hide" href="/clubsposts">
          ClubsPosts
        </Link>
        <Link className="NavItem2Hide" href="/profile">
          Profile
        </Link>

        <select onChange={handleSelectChange} value={selectedValue}>
          <option value="" disabled hidden>
            Hidden Menu
          </option>
          <option className="SelectItem3Hide" value="/">
            Home
          </option>
          <option className="SelectItem1Hide" value="/clubsposts">
            ClubsPosts
          </option>
          <option className="SelectItem2Hide" value="/profile">
            Profile
          </option>
          <option value="/clubsposts/2">Football Club</option>
          <option value="/clubsposts/3">Basketball Club</option>
          <option value="/clubsposts/4">Baseball Club</option>
          <option value="/clubsposts/1">Boxing Club</option>
        </select>
      </nav>
    </div>
  );
}
