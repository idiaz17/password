import Image from "next/image";
import React from "react";

const Header: React.FC = ({}) => {
  return (
    <div className="sticky bg-[#00CCBB] w-full top-0">
      <Image src={"/logo.png"} width={200} height={90} />
    </div>
  );
};

export default Header;
