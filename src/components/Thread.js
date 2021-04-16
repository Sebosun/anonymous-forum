import React, { useState, useEffect } from "react";
import "./Thread.css";
import Post from "./Post.js";
import { firebase } from "@firebase/app";
import PostForm from "./PostForm";

function Thread(props) {
  const [postsCol, setPostsCol] = useState([]);
  const [replyVisible, setReplyVisible] = useState(false);

  function getPostsFromThread() {
    const db = firebase.firestore();
    const posts = db
      .collection("board")
      .doc(props.id)
      .collection("posts")
      .orderBy("postNo", "asc");

    posts.onSnapshot((serverUpdate) => {
      const firebasePosts = serverUpdate.docs.map((_doc) => {
        let data = _doc.data();
        data.id = _doc.id;
        return data;
      });
      setPostsCol(firebasePosts);
    });
  }

  // onLoad get posts for a given Thread
  useEffect(() => {
    getPostsFromThread();
    console.log("Posts", postsCol);
  }, []);

  return (
    <div className="Thread">
      <div className="threadContainer">
        {replyVisible ? (
          <PostForm thread={false} id={props.id} />
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              setReplyVisible(!replyVisible);
            }}
            style={{ width: "200px" }}
          >
            Reply to thread
          </button>
        )}

        <div className="threadInfo">
          <img src={props.image} style={{ width: "20vh" }} />
          <div>{props.name}</div>
          <div id="user">{props.user ? props.user : "Anyonymous"}</div>
          <div>{props.title}</div>
          {/* workaround for a bug with toDate.toString crashing the app when new thread is added */}
          {props.time ? <div>{props.time.toDate().toString()}}</div> : null}
          <div>No. {props.postNo}</div>
        </div>
        <div id="postText">{props.text}</div>
      </div>

      {postsCol.map((post, index) => {
        return (
          <Post
            postNo={post.postNo}
            title={post.title}
            time={post.created}
            text={post.text}
            id={post.id}
            key={index}
          />
        );
      })}
    </div>
  );
}

export default Thread;
