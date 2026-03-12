import app from "./server";

const port = 3001

app.listen(port, () => {
  console.log(`App is listening to on port ${port}`)
})
