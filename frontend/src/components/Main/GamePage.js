import React, { useEffect, useState } from "react";
import "./GamePage.css";
import Alert from "@material-ui/lab/Alert";
import Markdown from "markdown-to-jsx";
import { Link } from "react-router-dom";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

function GamePage() {
  const [info, setInfo] = useState({});
  const [price, setPrice] = useState("");
  const [liked, setLiked] = useState(0);
  const [sdesc, setsDesc] = useState("");
  const [ldesc, setlDesc] = useState("");
  const [inputcomment, setinputcomment] = useState("");
  const [disliked, setDisliked] = useState(0);
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [me, setMe] = useState({});
  const [gameid, setGameid] = useState("");
  const [downloads, setDownloads] = useState(0);
  const [severity, setSeverity] = useState("error");
  const [fav, setFav] = useState([]);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [comments, setComments] = useState([]);
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    const gameid_ = window.location.href.split("/")[4];

    const fetchGame = async () => {
      await fetch(`http://localhost:8000/game/${gameid_}/view`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((finalRes) => {
          ////console.log(finalRes._id);
          setInfo(finalRes);
          setGameid(finalRes._id);
          setPrice(finalRes.price);
          setLiked(finalRes.likes);
          setsDesc(finalRes.description);
          setlDesc(finalRes.longdescription);
          setDisliked(finalRes.dislikes);
          setDownloads(finalRes.downloads);
        })
        .catch((err) => {
          //console.log(err);
        });
    };

    const fetchComments = async () => {
      await fetch(`http://localhost:8000/game/${gameid_}/comments`, {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes) => {
          //console.log(finalRes);
          setComments(finalRes);
        })
        .catch((err) => {
          //console.log(err);
        });
    };

    const my = async () => {
      await fetch("http://localhost:8000/api/user/me", {
        method: "GET",
        headers: {
          "Access-Token": "Bearer " + localStorage.getItem("Access-Token"),
        },
      })
        .then((res) => res.json())
        .then((finalRes2) => {
          console.log(finalRes2);
          setPurchasedGames(finalRes2.purchasedGames);
          setFav(finalRes2.favouriteGames);
          setMe(finalRes2);
          ////console.log(fav);
        })
        .catch((err) => {
          //console.log(err);
        });
    };
    fetchGame();
    my();
    fetchComments();
  }, [temp]);

  const likeHandler = async (id) => {
    const token = localStorage.getItem("Access-Token");
    await fetch(`http://localhost:8000/${id}/like`, {
      method: "GET",
      headers: {
        "Access-Token": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((finalRes) => {
        //////console.log(finalRes);
        setTemp(Date.now());
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const dislikeHandler = async (id) => {
    const token = localStorage.getItem("Access-Token");
    await fetch(`http://localhost:8000/${id}/dislike`, {
      method: "GET",
      headers: {
        "Access-Token": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((finalRes) => {
        //console.log(finalRes);
        setTemp(Date.now());
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const favHandler = async (id) => {
    ////console.log(me.favouriteGames);
    setSeverity("success");
    setFav(true);
    const token = localStorage.getItem("Access-Token");
    await fetch(`http://localhost:8000/${id}/makefavourite`, {
      method: "GET",
      headers: {
        "Access-Token": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((finalRes) => {
        //console.log(finalRes);
        setOpen(true);
        setResponse(finalRes);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const downloadHandler = async (id) => {
    window.open(`http://localhost:8000/download/${id}`);
  };

  const purchaseHandler = async (info) => {
    //console.log("purchased");
    //console.log(me);
    const token = localStorage.getItem("Access-Token");
    await fetch(`http://localhost:8000/purchase/game/${info._id}`, {
      method: "GET",
      headers: {
        "Access-Token": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((finalRes) => {
        console.log(finalRes);
        window.open(finalRes.link, "_blank");
        //console.log(finalRes.json());
        //setOpen(true);
        //setResponse(finalRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unfavHandler = async (id) => {
    setSeverity("error");
    setFav(false);
    const token = localStorage.getItem("Access-Token");
    await fetch(`http://localhost:8000/${id}/removefavourite`, {
      method: "GET",
      headers: {
        "Access-Token": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((finalRes) => {
        //console.log(finalRes);
        setOpen(true);
        setResponse(finalRes);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const FavButtonSelect = (props) => {
    const favourites = props.favourites;
    //console.log("fav" + props.favourites);
    const gameid = props.gameid;
    //console.log(typeof gameid);

    if (favourites.includes(gameid)) {
      return (
        <FavoriteIcon
          onClick={() => {
            unfavHandler(gameid);
          }}
          className="downloadIcon"
          style={{ cursor: "pointer" }}
        ></FavoriteIcon>
      );
    } else {
      return (
        <FavoriteBorderIcon
          className="downloadIcon"
          onClick={() => {
            favHandler(gameid);
          }}
          style={{ cursor: "pointer" }}
        ></FavoriteBorderIcon>
      );
    }
  };

  const submitComment = async (id, comment) => {
    //console.log(1111111);
    const token = localStorage.getItem("Access-Token");
    await fetch(`http://localhost:8000/game/${id}/makecomment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": "Bearer " + token,
      },
      body: JSON.stringify({
        comment: comment,
      }),
    })
      .then((res) => res.json())
      .then((finalRes) => {
        console.log(finalRes);
        setTemp(Date.now());
        setOpen(true);
        setResponse(finalRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ButtonSelect = (props) => {
    const price = props.price;
    const gameid = props.gameid;
    const purchasedGames = props.purchasedGames;
    console.log(purchasedGames);
    ////console.log(price);
    ////console.log(gameid);
    ////console.log(purchasedGames);

    if (price !== "Free" && !purchasedGames.includes(gameid)) {
      return (
        <button
          className="downloadbtn"
          onClick={() => {
            purchaseHandler(info);
          }}
        >
          Purchase
        </button>
      );
    } else if (purchasedGames.includes(gameid)) {
      return (
        <button
          className="downloadbtn"
          onClick={() => {
            downloadHandler(info.gameFile);
          }}
        >
          Download
        </button>
      );
    }

    if (price === "Free") {
      return (
        <button
          className="downloadbtn"
          onClick={() => {
            downloadHandler(info.gameFile);
          }}
        >
          Download
        </button>
      );
    }
  };

  const deleteMessage = async (cid) => {
    console.log(gameid);
    const token = localStorage.getItem("Access-Token");
    await fetch(`http://localhost:8000/game/${gameid}/removecomment/${cid}`, {
      method: "GET",
      headers: {
        "Access-Token": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((finalRes) => {
        console.log(finalRes);
        setTemp(Date.now());
        setOpen(true);
        setResponse(finalRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="gamepage">
      <Collapse
        style={{ position: "fixed", zIndex: "-1", top: "0", width: "100%" }}
        in={open}
      >
        <Alert
          severity={severity}
          action={
            <CloseIcon
              fontSize="small"
              onClick={() => {
                setOpen(false);
              }}
            ></CloseIcon>
          }
        >
          {response}
        </Alert>
      </Collapse>
      <div className="mainsection">
        <img className="infoimage" src={info.imageURL} alt="" />
        <div className="gameInformation">
          <div>
            <h1 style={{ textTransform: "uppercase", fontWeight: "800" }}>
              {info.name}
            </h1>
          </div>
          <ButtonSelect
            gameid={info._id}
            price={price}
            purchasedGames={purchasedGames}
          />
          <p className="short_desc">{sdesc}</p>

          <div className="gameinfo2">
            <h3>Author: {info.creator}</h3>
            <h3>Price: ${info.price}</h3>
            <div className="buttongroup">
              <div>
                <GetAppIcon className="downloadIcon"></GetAppIcon>
                <p>{downloads}</p>
                <ThumbUpAltIcon
                  onClick={() => {
                    likeHandler(info._id);
                  }}
                  className="downloadIcon"
                ></ThumbUpAltIcon>
                <p>{liked}</p>
                <ThumbDownAltIcon
                  onClick={() => {
                    dislikeHandler(info._id);
                  }}
                  className="downloadIcon"
                ></ThumbDownAltIcon>
                <p>{disliked}</p>
                <FavButtonSelect key={fav} gameid={info._id} favourites={fav} />
              </div>
              <div className="tagContainer_">
                <div className="category">
                  <p>{info.category}</p>
                </div>
                <div className="platform">
                  <p>{info.platform}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hline"></div>

      <div className="gamedescription">
        <p>
          <Markdown>{ldesc}</Markdown>
        </p>
      </div>

      <div className="hline"></div>

      <div className="commentsContainer">
        <div className="commentInput">
          <input
            placeholder="Comment..."
            onChange={(e) => setinputcomment(e.target.value)}
            value={inputcomment}
          ></input>
          <button
            onClick={(e) => {
              submitComment(info._id, inputcomment);
            }}
          >
            Post
          </button>
        </div>
        <div className="showComments">
          {comments.length === 0 ? (
            <h1 style={{ padding: "10px" }}>No Comments</h1>
          ) : null}
          {comments.map((each) => (
            <div key={each._id} className="comment">
              <div className="header_">
                <Link
                  style={{ textDecoration: "none" }}
                  to={"/profile/" + each.commentBy}
                >
                  <h3 className="comment_user">@{each.commentBy}</h3>
                </Link>
                <div className="comment_delete">
                  {me.comments.includes(each._id) ? (
                    <DeleteIcon onClick={() => deleteMessage(each._id)} />
                  ) : null}
                </div>
              </div>
              <p className="ocomment">{each.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
