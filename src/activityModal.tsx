import React, { useEffect, useState } from "react";

const ActivityList = (props:any) => {
  const [text, SetText] = useState("");
  const [fileContents, setFileContents] = useState('');


  useEffect(() => {
    // Connect to the websocket server
    const ws = new WebSocket('ws://localhost:4000');

    // Update the file contents when a message is received
    ws.onmessage = (event:any) => {
      console.log(event,"s");
      setFileContents(event.data);
    };

    // Clean up the websocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [fileContents]);


  const PostData = async () => {
    let data = {
      content: text,
    };
    fetch("http://localhost:8080/api/user/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

  };

  return (
    <div className="p-3">
      <input
        type="email"
        className="form-control"
        onChange={(e) => SetText(e.target.value)}
        id="exampleFormControlInput1"
        placeholder="Add text"
      />
      <button onClick={PostData} type="button" className="btn btn-primary mt-3">Add</button>
      <div>
        <p>{fileContents}</p>
      </div>
    </div>
  );
};

export default ActivityList;
