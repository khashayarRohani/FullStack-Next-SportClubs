"use client";

import { useState } from "react";
export default function CheckUser() {
  const [isDisplay, setIsDisplay] = useState(false);
  async function handleUserCheckChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUsername({ ...username, [name]: value });
  }
  async function handleCheckSubmit(event) {
    event.preventDefault();

    setIsDisplay(true);
  }
  document.getElementById("display").value = isDisplay;
  return (
    <form className="registerFormm" onSubmit={handleCheckSubmit}>
      <label htmlFor="username">enter your username</label>
      <input
        name="username"
        placeholder="username(Case Sensitive)"
        title="Enter a UserName"
        onChange={handleUserCheckChange}
      />
      <button className="button">Check me</button>
    </form>
  );
}
