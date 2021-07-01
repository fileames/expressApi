import app from "./app";

app
  .init()
  .then(() => {
    app.listen();
    console.log("Boot successful!");
  })
  .catch((err) => {
    console.log(`Error booting ${err}`);
    process.exit(2);
  });
