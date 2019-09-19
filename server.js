const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const {split, Syntax} = require("sentence-splitter");

app.set('view engine', 'hbs')

app.get('/', (req, res) => res.send('Hello World!'))

var originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
];
var corsOptions = {
    origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials:true
}
//here is the magic
app.use(cors(corsOptions));


app.get('/chapter/:chapterId', function (req, res) {
    sql = "SELECT * FROM Chapter WHERE ChapterID = " + req.params.chapterId;

    con.query(sql, function(err, result) {

        annosql = "SELECT * FROM Annotate WHERE ChapterID = " + req.params.chapterId;
        con.query(annosql, function(err, annores) {
            let y = result[0].Text
            var sentence = y;
            console.log("hello")
            var sentence = y.replace(/((\r\n){2})/gm, "1234NEW PARAGRAPH1234");
            var pars = sentence.split("1234NEW PARAGRAPH1234");
            let sentences = []
            for(var i = 0; i < pars.length; i++){
                let prosp = pars[i].replace(/(\r\n)/gm, " ");
                let splitted = split(prosp);
                let parsent = [];
                for(var j = 0; j < splitted.length; j++){
                    if(splitted[j].type == 'Sentence'){
                        parsent.push(splitted[j].raw);
                    }
                }
                sentences.push(parsent);
            }
            console.log(sentences);
            // console.log(typeof(sentence))
    
    
            var context = {"text" : sentences, "title": result[0].ChapterName, "annotations": annores};
            res.render("chapt", context);   

        })
    })
})  

app.get('/chapterA/:chapterId', function (req, res) {
    sql = "SELECT * FROM Chapter WHERE ChapterID = " + req.params.chapterId;

    con.query(sql, function(err, result) {

        annosql = "SELECT * FROM Annotate WHERE ChapterID = " + req.params.chapterId;
        con.query(annosql, function(err, annores) {
            let y = result[0].Text
            var sentence = y;
            console.log("hello")
            var sentence = y.replace(/((\r\n){2})/gm, "1234NEW PARAGRAPH1234");
            var pars = sentence.split("1234NEW PARAGRAPH1234");
            let sentences = []
            var index = 1;
            for(var i = 0; i < pars.length; i++){
                let prosp = pars[i].replace(/(\r\n)/gm, " ");
                let splitted = split(prosp);
                let parsent = [];
                for(var j = 0; j < splitted.length; j++){
                    if(splitted[j].type == 'Sentence'){
                        parsent.push({"id": index, "text" : splitted[j].raw});
                        index += 1;
                    }
                }
                sentences.push(parsent);
            }
            console.log(sentences);
            // console.log(typeof(sentence))
    
    
            // var context = {"text" : sentences, "title": result[0].ChapterName, "annotations": annores};
            var context = {"text" : sentences, "title": result[0].ChapterName};
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
            res.end(JSON.stringify(context));   

        })
    })
})  

app.get('/annotateA/:chapterId', function (req, res) {
    annosql = "SELECT * FROM Annotate WHERE ChapterID = " + req.params.chapterId;
    con.query(annosql, function(err, annores) {
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        res.end(JSON.stringify(annores));   
    })
})  

app.get('/book/:bookId', function (req, res) {
    sql = "SELECT * FROM Book WHERE BookID = " + req.params.bookId;

    con.query(sql, function(err, result) {
        chapsql = "SELECT * FROM Chapter WHERE BookID = " + req.params.bookId;
        con.query(chapsql, function(err,result) {
            test = [];
            for(var i = 0; i < result.length; i++){
                res.render('chapt', { title: 'Hey', message: 'Hello there!' })
            }
            res.send(test)
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "punwai",
    password: "drag1235",
    database: "annotate"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    sql = "SELECT * FROM Book";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
});
