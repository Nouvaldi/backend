const express = require('express');
const mysql = require('mysql');

try {
  const app = express();
  app.use(express.json());

  // TO RUN THE APP, OPEN TERMINAL AND TYPE node app.js
  // THE APP RUNS ON localhost:3000

  //   CONNECT TO DATABASE
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'magang'
  })
  connection.connect(function(err) {
    if (err) throw err;
    console.log("DB Connected!");
  });


  app.get('/', async (req, res) => {

    // GET ALL FROM DATA TABLE
    const getData = async () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM data', (err, rows, fields) => {
          if (err) throw reject();
          
          // DATA TYPE IN DATABASE IS SET TO DATETIME, THEREFORE
          // THESE FUNCTIONS ARE USED TO FORMAT DATETIME CORRECTLY
          for (const row of rows) {
            const date = new Date(row.transactionDate);
            row.transactionDate = date.toLocaleString('sv-SE', { hourCycle: 'h24' });
          }
          for (const row of rows) {
            const date = new Date(row.createOn);
            row.createOn = date.toLocaleString('sv-SE', { hourCycle: 'h24' });
          }
          resolve(rows); 
        });

      })
    }

    // GET ALL FROM STATUS TABLE
    const getStatus = async () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM status', (err, rows, fields) => {
          if (err) throw reject();
        
          resolve(rows);
        });
      })
    }

    const data = await getData();
    const status = await getStatus();

    res.send({ data, status });
  });

  app.listen(3000, () => {
    console.log(`This app is listening on port 3000`);
  });
} catch (error) {
  console.log(error);
}

