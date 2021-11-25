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

        let info = await ytdl.getInfo(id);
        let format = ytdl.chooseFormat(info.formats, { quality: '140' });
        console.log('Format found!', format);
        
        res.header("Content-Disposition", "attachment; filename=" + title + ".mp3")
        return ytdl(baseURL + id, { format: format}).pipe(res)

    } catch (err) {
        console.log(err)
    }
    
});

// 192.168.15.1:3000/?id=zDCxqciBDC8&title=gestos


app.listen(PORT)