import React from "react";
import { useNavigate } from "react-router-dom";

const BodyComponenet = ({
  id,
  heading,
  description,
  navigate_,
  callToAction,
  image,
  rev,
  color,
  isLoggedin,
}) => {
  const navigate = useNavigate();
  return (
    <section id={`${id}`} className="">
      <div
        className={`flex flex-col items-center justify-center md:flex-row md:justify-around ${
          rev && "md:flex-row-reverse"
        } ${color ? `bg-[#043873]` : "bg-white"} pt-6 lg:pt-10`}
      >
        <div className="flex flex-col justify-center items-center px-4">
          <h1
            className={`text-3xl pb-2 mb-4 font-bold ${
              rev ? "text-stone-200" : "text-black"
            }`}
          >
            {heading}
          </h1>
          <p
            className={`max-w-[500px] text-justify ${
              rev ? "text-stone-200" : "text-black"
            }`}
          >
            {description}
          </p>
          <div className="btns pt-4 max-w-full">
            <button
              onClick={() =>
                isLoggedin ? navigate(navigate_) : navigate("/login")
              }
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              {callToAction}
            </button>
          </div>
        </div>
        <div className="md:max-w-[60%]">
          <img src={image} alt="connect with others" />
        </div>
      </div>
    </section>
  );
};

export default BodyComponenet;
