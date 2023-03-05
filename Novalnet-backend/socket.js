const io = require("socket.io")(server);

// Watch for changes to the activity.txt file and emit to clients
fs.watch("activity.txt", (eventType, filename) => {
  if (eventType === "change") {
    const lines = fs
      .readFileSync("activity.txt", "utf-8")
      .split("\n")
      .filter(Boolean);
    const lastLine = lines[lines.length - 1];
    console.log(lastLine);
    io.emit("activity", lastLine);
  }
});
