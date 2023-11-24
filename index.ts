import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;


const app = require('./serveapp');

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});