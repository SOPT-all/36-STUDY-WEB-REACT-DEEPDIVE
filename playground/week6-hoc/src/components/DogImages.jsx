import React from "react";
import withHover from "../hoc/withHover";
import withLoader from "../hoc/withLoader";

function DogImages(props) {
  return (
    <div {...props}>
      {props.hovering && <h1 id="hover">Hovering!</h1>}
      <div id="list">
        {props.data.message.map((dog, index) => (
          <img src={dog} alt="Dog" key={index} />
        ))}
      </div>
    </div>
  );
}

export default withHover(
  withLoader(DogImages, "https://dog.ceo/api/breed/labrador/images/random/6")
);