import { useEffect, useState } from "react";
import "../styles/slideshow.css";

const images = [
  "/assets/img1.jpeg",
  "/assets/img2.jpeg",
  "/assets/img3.jpeg",
  "/assets/img4.jpeg",
  "/assets/img5.jpg",
];

function Slideshow() {

  const [index,setIndex]=useState(0);

  useEffect(()=>{

    const timer=setInterval(()=>{

      setIndex((prev)=>(prev+1)%images.length);

    },3000);

    return()=>clearInterval(timer);

  },[]);

  return(

    <div className="phone-frame">

      <div className="camera"></div>

      <div className="slideshow">

        {images.map((img,i)=>(

          <img
            key={i}
            src={img}
            className={`slide ${i===index?"active":""}`}
          />

        ))}

      </div>

    </div>

  );

}

export default Slideshow;