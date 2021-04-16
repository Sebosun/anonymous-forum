import React, { useState, useEffect } from "react";
import "./PostForm.css";
import { firebase } from "@firebase/app";

function PostForm(props) {
  // TODO text verification, atm you can post infinite amount of text and it looks shit, not to mention spammy
  // TODO Captcha verification i guess

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  // increases the psot number in meta collection
  function incrNo() {
    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);
    const postNoRef = db.collection("meta").doc("data");
    postNoRef.update({ postNo: increment });
  }

  //gets the postNo from the meta collection
  function getNo() {
    const db = firebase.firestore();
    const data = db.collection("meta").doc("data");
    const postNo = data.get().then((doc) => {
      if (doc.exists) {
        return doc.data().postNo;
      } else {
        return 0;
      }
    });

    return postNo;
  }

  async function addNewThread(name, text, title, imageName) {
    const db = firebase.firestore();
    const postNo = await getNo();
    console.log(props.thread);
    // based if its a thread or board choose appropriate collection
    if (props.thread === true) {
      const collection = db.collection("board");

      collection
        .add({
          user: name,
          text: text,
          title: title,
          // user: "Anyonymous",
          postNo: postNo,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          image: imageName,
        })
        .then(incrNo());
    } else {
      const collection = db
        .collection("board")
        .doc(props.id)
        .collection("posts");

      collection
        .add({
          user: name,
          text: text,
          title: title,
          // user: "Anyonymous",
          postNo: postNo,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          image: imageName,
        })
        .then(incrNo());
    }
  }

  // adds the image to the state
  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onPostSubmit = async (e) => {
    e.preventDefault();
    if (image === null) {
      addNewThread(name, text, title, "");
    } else {
      const file = image;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      fileRef.getDownloadURL().then((url) => {
        addNewThread(name, text, title, url);
      });
    }
  };

  return (
    <div className="Form">
      <form
        onSubmit={(e) => {
          onPostSubmit(e);
        }}
        className="addForm"
      >
        <input
          placeholder="name"
          value={name}
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          placeholder="title"
          value={title}
          type="text"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <textarea
          placeholder="comment"
          value={text}
          type="text"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />

        <input type="file" onChange={onFileChange} />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default PostForm;
