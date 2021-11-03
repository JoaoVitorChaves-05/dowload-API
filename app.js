var express = require('express');
var app = express();

const ytdl = require('ytdl-core');

const PORT = process.env.PORT || 3000

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function(req, res) {
    try {
        const baseURL = "https://youtube.com/watch?v="
        const {id} = req.query
        const {title} = req.query

        const data = Date.now()
        res.header("Content-Disposition", "attachment; filename=" + title + ".mp3")
        return ytdl(baseURL + id).pipe(res)
    } catch (err) {
        console.log(err)
    }
    
});

app.listen(PORT)