import { useEffect } from "react";
import Gif from "../images/GIF4.mp4";
import GIF from "../images/GIF3.gif";

function Home() {
  // useEffect(() => {
  //   // Apply background image to body
  //   document.body.style.backgroundImage =
  //     "url('https://i.ibb.co/3Yv5h9s/revisedbackground.png')"; // Replace 'path/to/your/image.jpg' with the path to your background image
  //   document.body.style.backgroundRepeat = "repeat"; // Make the background image repeat

  //   // Clean up when component unmounts
  //   return () => {
  //     document.body.style.backgroundImage = null;
  //     document.body.style.backgroundRepeat = null;
  //   };
  // }, []);

  return (
    <>
      <div
        id="home"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <img
          source
          src="https://i.ibb.co/W0ftHVL/transparenthomelogo.png"
          alt="logo"
          style={{ maxWidth: "100%", height: "70vh", maxHeight: "80vh" }}
        />
        {/* <video
          autoPlay
          loop
          muted
          style={{ maxWidth: "100%", height: "70vh", maxHeight: "80vh" }}
        >
          <source src={Gif} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        {/* <img
          src={GIF}
          alt="GIF"
          style={{ maxWidth: "100%", height: "70vh", maxHeight: "80vh" }}
        /> */}
      </div>
    </>
  );
}

export default Home;
