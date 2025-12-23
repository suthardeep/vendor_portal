import React, { useEffect, useState } from "react";
import { EditProfile } from "./components/EditProfile";
import { ChangePassword } from "./components/ChangePassword";
import { Button } from "@/components/base/Button";
import { Separator } from "@/components/base/Separator";
import { ProfileSearchParam } from "@/routes/_app/profile/route";
import { useNavigate } from "@tanstack/react-router";

// Mock API hooks - replace with actual implementations
const useGetProfile = () => ({
  data: {
    data: {
      phone: "9033002010",
      email: "mann@gmail.com",
      fullName: "Mann Jasmatia",
      phoneVerified: true,
      emailVerified: true,
      createdAt: "2025-12-10T06:25:18.214Z",
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      size: 1500,
      productsSold: 21280,
      rating: 4.5,
    },
  },
  isLoading: false,
  isError: false,
});

// Profile.tsx
const Profile = ({ step }: ProfileSearchParam) => {
  const { data: profileData, isLoading } = useGetProfile();
  const navigate = useNavigate();

  useEffect(() => {});

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  const profile = profileData?.data;

  if (step === "edit") return <EditProfile onBack={() => navigate({ to: ".", search: { step: "view" }})} profile={profile} />;
  if (step === "password") return <ChangePassword onBack={() => navigate({ to: ".", search: { step: "view" }})} />;

  return (
    <div className="bg-base-1 rounded-2xl pb-4">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold text-base-content">My Profile</h1>
      </div>

      <Separator />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 m-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full flex justify-end">
            <Button variant="outline" onClick={() =>  navigate({ to: ".", search: { step: "edit" }})} className="w-20" size="sm">
              Edit
            </Button>
          </div>
          <img
            src={profile?.profilePic || "https://via.placeholder.com/200"}
            alt={profile?.fullName}
            className="w-32 h-32 rounded-lg object-cover  mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile?.fullName}</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-600">
            <span className="flex items-center gap-1">+91 {profile?.phone}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">{profile?.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-lg font-bold text-gray-900 mb-1">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "-"}
            </p>
            <p className="text-sm text-gray-600">Joined Since</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-lg font-bold text-gray-900 mb-1">
              {profile?.size ? `${profile.size} Sq. ft.` : "0 Sq. ft."}
            </p>
            <p className="text-sm text-gray-600">Size</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-lg font-bold text-gray-900 mb-1">
              {profile?.productsSold?.toLocaleString() || "0"}
            </p>
            <p className="text-sm text-gray-600">Total Products Sold</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1">
              {profile?.rating || "0"}
            </p>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
