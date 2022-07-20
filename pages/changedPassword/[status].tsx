import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Header from "../../components/Header";

function StatusChange() {
  const route = useRouter();
  console.log(route);

  if (route.query.status === "updated")
    return (
      <>
        <Header />
        <div className="h-full flex flex-col items-center justify-center overflow-y-hidden  mt-20 ">
          <Image
            src={"/icon.jpg"}
            width={300}
            height={200}
            className="object-contain"
          />
          <h1 className="text-2xl">Password Updated!</h1>
          <div className="mt-4 text-center">
            <h2 className="text-md">
              Your password has been changed successfully.
            </h2>
            <h2 className="text-md">Use your new password to log in.</h2>
          </div>
        </div>
      </>
    );
}

export default StatusChange;
