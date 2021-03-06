const express = require('express');
const path = require('path');

const app = express();

const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true} ));

app.listen(port, () => {
  console.log(`Server start on port: ${port}`);
})