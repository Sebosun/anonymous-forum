import React, { useState, useEffect } from "react";
import "./App.css";
import Thread from "./components/Thread";
import Header from "./components/Header";
import { firebase } from "@firebase/app";

function App() {
  const [postNumeration, setPostNumeration] = useState(1);
  const [threadPosts, setThreadPosts] = useState([
    {
      postNo: postNumeration,
      title: "First post",
      time: new Date(),
      text: "Hello World",
      posts: {},
    },
  ]);

  let genPost = {
    postNo: postNumeration,
    title: "First post",
    time: new Date(),
    text: "Hello World",
  };

  function addNewThread(thread) {
    let emptyThread = [...threadPosts];
    emptyThread.push(thread);
    setThreadPosts(emptyThread);
  }

  // increases firestore count
  function incrPostNo() {
    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);
    const postNoRef = db.collection("meta").doc("data");
    postNoRef.update({ postNo: increment });
  }

    // test for getting stuff from thread posts, will setup collections within threads themselves
  // function getCurPostNo(){
  //     const db = firebase.firestore();
  //     db.collection("test").onSnapshot((serverUpdate) => {
  //         const mainPosts = serverUpdate.docs.map((_doc) =>{
  //             const data = _doc.data();
  //             console.log(data);
  //         }
  //         )
  //     })
  // }


    //gets the postNo from the meta collection
  function getCurPostNo() {
    const db = firebase.firestore();
    const data = db.collection("meta").doc("data");

    data.get().then((doc) => {
      if (doc.exists) {
        console.log("Doc data", doc.data());
      } else {
        console.log("PostNo not found");
      }
    });
  }

  function updatePostNumber() {
    setPostNumeration(postNumeration + 1);
  }

  useEffect(() => {
    updatePostNumber();
  }, [threadPosts]);

  return (
    <div className="App">
      <Header />
      <div className="Threads">
        {threadPosts.map((thread, index) => {
          return (
            <Thread
              index={index}
              postNo={thread.postNo}
              title={thread.title}
              time={thread.time.toString()}
              text={thread.text}
            />
          );
        })}
      </div>
      <button onClick={() => addNewThread(genPost)}>Add dupa</button>
      <button onClick={() => getCurPostNo()}>Firestore add!</button>
    </div>
  );
}
export default App;
