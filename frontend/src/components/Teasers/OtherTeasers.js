import React, { useState, useEffect } from "react";
import "./OtherTeasers.css";

function OtherTeasers() {
  const [teaser, setTeaser] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    const teaserid = window.location.href.split("/")[4];

    const getTeaser = async () => {
      await fetch(`http://localhost:8000/teaser/${teaserid}`, {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes3) => {
          setTeaser(finalRes3);
          setImages(finalRes3.images);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getTeaser();
  }, []);

  return (
    <div className="otherteasers">
    <div className="mainsection" style={{marginTop: '100px', width: "80%", marginLeft: 'auto', marginRight: 'auto'}}>
        <img className="teaserimage" src={teaser.coverimageurl} alt="" />
        <div className="gameInformation">
          <div>
            <h1 style={{ textTransform: "uppercase", fontWeight: "800" }}>
              {teaser.name}
            </h1>
          </div>

          <p className="short_desc">{teaser.description}</p>

          <div className="gameteaser2">
            <h3>Author: {teaser.creator}</h3>
            <h3>Price: ${teaser.price}</h3>
          </div>
          <div className="tagContainer_">
                <div className="category">
                  <p>{teaser.category}</p>
                </div>
                <div className="platform">
                  <p>{teaser.platform}</p>
                </div>
              </div>
        </div>
      </div>
      

      <h1
        style={{
          marginTop: "20px",
          fontWeight: "800",
          marginBottom: "20px",
          color: "white",
        }}
      >
        Description
      </h1>
      <div className="teaserdescription">
        <h3>{teaser.description}</h3>
      </div>
      <div className="trailervideo">
        <video width="100%" height="100%" controls>
          <source
            src={"http://localhost:8000/" + teaser.video}
            type="video/mp4"
          />
        </video>
      </div>

      <div style={{ marginTop: "50px" }} className="horizline"></div>

      <h1
        style={{
          marginTop: "20px",
          fontWeight: "800",
          marginBottom: "20px",
          color: "white",
        }}
      >
        Early In-Game pics
      </h1>
      <div className="earlypics">
        {images.map((each) => (
          <div className="eachpic">
            <img
              alt="gameplay-pics"
              className="pics"
              src={"http://localhost:8000/" + each}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OtherTeasers;
