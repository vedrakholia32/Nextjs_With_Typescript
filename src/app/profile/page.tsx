"use client";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <hr className="w-full max-w-md mb-4" />
      <p className="text-lg mb-4">Welcome to your profile page</p>
      <h2>
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr className="w-full max-w-md mb-4" />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        Logout
      </button>

      <button
        onClick={getUserDetails}
        className="bg-green-500 mt-4 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        GetUser Details
      </button>
    </div>
  );
}
