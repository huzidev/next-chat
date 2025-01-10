"use client";

import Spinner from "@/components/general/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const isMyProfile = id === 'me';
  const userId = localStorage.getItem('user');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentId = localStorage.getItem("user");
  console.log("SW params", params);

  useEffect(() => {
    if (!id) return;
    async function fetchUser() {
      try {
        const docRef = doc(db, "users", isMyProfile ? userId : id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
        setLoading(false);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <Spinner />
  }

  if (!user && !loading) {
    return (
      <div className="p-6 h-full mx-auto max-w-[1200]">
        <Alert variant="destructive">
          <AlertTitle>User Not Found</AlertTitle>
          <AlertDescription>
            The user you are trying to chat with does not exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const route = isMyProfile ? `/user/edit-profile` : `/chat/${id}`;

  return (
    <div className="p-6 mx-auto max-w-[1200]">
      <Button variant="outline" onClick={() => router.back()}>
        <ChevronLeft />
        Back
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {isMyProfile ? "Yours Profile" : `${user.username}'s ` + "Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isMyProfile && (
            <p>
              <strong>Username:</strong> {user.username}
            </p>
          )}
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => router.push(route)}
            className={`text-white ${
              isMyProfile
                ? "bg-green-500  hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } `}
          >
            {isMyProfile ? "Edit Profile" : "Send Message"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
