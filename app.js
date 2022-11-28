const express = require("express");
const app = express();
const { Posts } = require("./models")
const mysql2 = require("mysql2");

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MYDATABASE,
});
db.connect();

dbQueryAsync = async (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  };

app.use(express.json())  

app.post("/posts", async(req, res) => {
    const {title, content, location, spotName, sports, comforts, price} = req.body;
    await Posts.create({title, content, location, spotName, sports, comforts, price})
    res.status(200).json({message:"생성완료"})
})

app.get("/posts/:keywords", async(req, res)=>{
    const { keywords } = req.params
    let AllKeywords = keywords.split(' ')
    let [keyword, keyword2, keyword3] = AllKeywords
   
    if (AllKeywords.length === 1){
        const sql = `SELECT * FROM Posts where title like '%${keyword}%' OR content like '%${keyword}%' OR location like '%${keyword}%' OR spotName like '%${keyword}%' OR sports like '%${keyword}%' OR comforts like '%${keyword}%'`
        const data = await dbQueryAsync(sql)
        res.status(200).json({result : data})
    } else if (AllKeywords.length === 2){
        const sql2 = `SELECT * FROM Posts where (title like '%${keyword}%' OR content like '%${keyword}%' OR location like '%${keyword}%' OR spotName like '%${keyword}%' OR sports like '%${keyword}%' OR comforts like '%${keyword}%') AND (title like '%${keyword2}%' OR content like '%${keyword2}%' OR location like '%${keyword2}%' OR spotName like '%${keyword2}%' OR sports like '%${keyword2}%' OR comforts like '%${keyword2}%')`
        const data2 = await dbQueryAsync(sql2)
        res.status(200).json({result : data2})
    } else if (AllKeywords.length === 3){
        const sql3 = `SELECT * FROM Posts where (title like '%${keyword}%' OR content like '%${keyword}%' OR location like '%${keyword}%' OR spotName like '%${keyword}%' OR sports like '%${keyword}%' OR comforts like '%${keyword}%') AND (title like '%${keyword2}%' OR content like '%${keyword2}%' OR location like '%${keyword2}%' OR spotName like '%${keyword2}%' OR sports like '%${keyword2}%' OR comforts like '%${keyword2}%') AND (title like '%${keyword3}%' OR content like '%${keyword3}%' OR location like '%${keyword3}%' OR spotName like '%${keyword3}%' OR sports like '%${keyword3}%' OR comforts like '%${keyword3}%')`
        const data3 = await dbQueryAsync(sql3)
        res.status(200).json({result : data3})
    }
})

app.listen(3000, () => {
    console.log("3000번 포트로 열렸습니다");
  });