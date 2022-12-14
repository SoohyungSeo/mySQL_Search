const express = require("express");
const app = express();
const { Posts } = require("./models")
const mysql2 = require("mysql2");
require("dotenv").config();

// mySQL 연결
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MYDATABASE,
});
db.connect();

//dbQueryAsync 라는 변수로 query문이 실행되는 함수
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

// 게시물 등록 API
app.post("/posts", async(req, res) => {
    const {title, content, location, spotName, sports, comforts, price} = req.body;
    await Posts.create({title, content, location, spotName, sports, comforts, price})
    res.status(200).json({message:"생성완료"})
})

// 게시물 조회 API
app.get("/posts/:keywords", async(req, res)=>{
    // keywords를 params로 받음
    const { keywords } = req.params
    // 띄어쓰기가 들어간 keywords 들을 띄워쓰기로 나눔
    let AllKeywords = keywords.split(' ')
    // 최대 2번의 띄워쓰기로 3개의 키워드로 검색하게 만듬. 3개의 변수로 각각 할당해줌.
    let [keyword, keyword2, keyword3] = AllKeywords
   
    // 모든 컬럼을 돌면서 그 keyword 가 들어가 있는지 검색.
        // keyword가 1개 입력됐을때
    if (AllKeywords.length === 1){
        const sql = `SELECT * FROM Posts where title like '%${keyword}%' OR content like '%${keyword}%' OR location like '%${keyword}%' OR spotName like '%${keyword}%' OR sports like '%${keyword}%' OR comforts like '%${keyword}%'`
        const data = await dbQueryAsync(sql)
        res.status(200).json({result : data})
        //키워드가 2개 입력됐을 때
    } else if (AllKeywords.length === 2){
        const sql2 = `SELECT * FROM Posts where (title like '%${keyword}%' OR content like '%${keyword}%' OR location like '%${keyword}%' OR spotName like '%${keyword}%' OR sports like '%${keyword}%' OR comforts like '%${keyword}%') AND (title like '%${keyword2}%' OR content like '%${keyword2}%' OR location like '%${keyword2}%' OR spotName like '%${keyword2}%' OR sports like '%${keyword2}%' OR comforts like '%${keyword2}%')`
        const data2 = await dbQueryAsync(sql2)
        res.status(200).json({result : data2})
        //키워드가 3개 입력됐을 때
    } else if (AllKeywords.length === 3){
        const sql3 = `SELECT * FROM Posts where (title like '%${keyword}%' OR content like '%${keyword}%' OR location like '%${keyword}%' OR spotName like '%${keyword}%' OR sports like '%${keyword}%' OR comforts like '%${keyword}%') AND (title like '%${keyword2}%' OR content like '%${keyword2}%' OR location like '%${keyword2}%' OR spotName like '%${keyword2}%' OR sports like '%${keyword2}%' OR comforts like '%${keyword2}%') AND (title like '%${keyword3}%' OR content like '%${keyword3}%' OR location like '%${keyword3}%' OR spotName like '%${keyword3}%' OR sports like '%${keyword3}%' OR comforts like '%${keyword3}%')`
        const data3 = await dbQueryAsync(sql3)
        res.status(200).json({result : data3})
    }
})

app.listen(3000, () => {
    console.log("3000번 포트로 열렸습니다");
  });