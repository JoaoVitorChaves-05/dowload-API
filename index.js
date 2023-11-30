const express = require('express')
const ytdl = require('ytdl-core')
const fs = require('fs')
const { exec } = require('child_process')

const app = express()
const PORT = process.env.PORT || 80

const createFilename = () => {
    const higher_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const lower_chars = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const numbers = '1234567890'.split('')

    const filename = (() => {
        let filename_string = ''
        for (let i = 0; i < 16; i++) {
            let typeList = Math.floor(Math.random() * 3)
            if (typeList == 0) filename_string += higher_chars[Math.floor(Math.random() * 26)]
            if (typeList == 1) filename_string += lower_chars[Math.floor(Math.random() * 26)]
            if (typeList == 2) filename_string += numbers[Math.floor(Math.random() * 10)]
        }

        return filename_string
    })()

    return filename
}

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html')
})

app.get('/info', async (req, res) => {
    const {url} = req.query

    if (ytdl.validateURL(url)) {
        let info = await ytdl.getInfo(url);
        let formats = info.formats
        
        let mappedFormats = formats.map(format => {
            return {
                format: format.container, 
                hasAudio: format.hasAudio, 
                hasVideo: format.hasVideo,
                fps: format.fps,
                qualityLabel: format.qualityLabel,
                itag: format.itag
            }
        })

        console.log(mappedFormats)

        let filteredFormats = mappedFormats.filter(format => format.hasVideo)

        res.status(200).json([...filteredFormats, {
            format: 'mp3',
            hasAudio: true,
            itag: 140
        }])
    } else {
        res.status(200).json(false)
    }
})

app.get('/download', async (req, res) => {
    const {url, itag} = req.query

    if (ytdl.validateURL(url)) {

        const filename = createFilename()

        const download = ytdl(url, { filter: format => format.itag === itag })
        .pipe(fs.createWriteStream(`./public/downloads/${filename}.mp4`))

        download.on('close', () => {
            exec(`ffmpeg -i ./public/downloads/${filename}.mp4 ./public/downloads/${filename}.mp3`, (error, stdout, stderr) => {
                if (error) {
                  console.error(`error: ${error.message}`);
                  res.status(301).json('Error: ', error.message)
                  return;
                }
              
                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  res.status(301).json('Error: ', stderr)
                  return;
                }

                res.status(200).json('/public/downloads/${filename}.mp3')

                console.log(`stdout:\n${stdout}`);
            })
        })
    }
})

app.listen(PORT, () => {
    console.log('> Listening on port: ' + PORT)
})