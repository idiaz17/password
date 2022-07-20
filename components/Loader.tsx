import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

//LOCALS
import Loader from "../json/loading.json";

interface SpinnerProps {
  visible: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="h-full w-full bg-white justify-center items-center z-10">
      <Player
        className="active:invisible hover:animate-ping"
        autoplay
        loop
        src={Loader}
        style={{ width: 420, height: 420 }}
        speed={1}
      ></Player>
    </div>
  );
};

export default Spinner;
