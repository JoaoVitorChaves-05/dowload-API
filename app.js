var express = require('express');
var app = express();

const ytdl = require('ytdl-core');

const PORT = process.env.PORT || 3000

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function(req, res) {
    try {
        const {url} = req.query

        const data = Date.now()
        res.header("Content-Disposition", "attachment; filename=" + "music.mp3")
        return ytdl(url).pipe(res)
    } catch (err) {
        console.log(err)
    }
    
});

app.listen(PORT)