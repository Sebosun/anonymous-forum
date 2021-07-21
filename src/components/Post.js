import "./Post.css";
import Image from "./UI/Image";

function Post(props) {
  return (
    <div className="Post">
      <div className="postContainer">
        <Image src={props.image} />
        <div className="posterInfo">
          <div id="user">Anonymous</div>
          <div>{props.title}</div>
          {props.time && (
            <div>
              {props.time.toDate().toDateString() +
                " " +
                props.time.toDate().toLocaleTimeString()}
            </div>
          )}
          <div className="postNo">No. {props.postNo}</div>
        </div>
        <p className="postText">{props.text}</p>
      </div>
    </div>
  );
}

export default Post;
