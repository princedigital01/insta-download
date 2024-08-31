const express = require('express');
const app = express();
const path = require("path");   
const PORT = 3000
const { ndown } = require("nayan-media-downloader")

// Function to validate Instagram URL
function isValidInstagramUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/(p|reel|tv)/;
    return regex.test(url);
}

app.use(express.static(path.join(__dirname, '')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/details', async (req, res) => {
    let url = req.query.url.replace(/\s+/g, '');
    let URL = await ndown(url);
    let msg = "download now⬇️";
    try {
        //console.log(URL)
        if(!URL.status || !url || !isValidInstagramUrl(url)){
            URL = {"data":
                [
                    {
                        "url": "",
                        "thumbnail": "error.jpeg"
                    }
                ]
            }
            msg="sorry but there is a server error please check your url😪 ";
        }

        res.send(`
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Instagram Video</title>
            <link rel="shortcut icon" href="icon.webp" type="image/webp">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Arial', sans-serif;
                }

                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #1a1a2e;
                    color: #ffffff;
                }

                .details-container {
                    text-align: center;
                    max-width: 500px;
                    animation: fadeIn 1.5s ease-in-out;
                }

                .video-details {
                    background-color: #222;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    animation: slideUp 1s ease-out;
                }

                .video-details p {
                    margin: 10px 0;
                }

                .download-button {
                    padding: 12px 24px;
                    background-color: #0485ff;
                    color: white;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 1.2em;
                    transition: background-color 0.3s ease;
                }
                .a {
                    background:yellow;
                    padding: 12px 24px;
                    color: black;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 1.2em;
                    transition: background-color 0.3s ease;
                    }
                .a:hover{background:black;color: white;}

                .download-button:hover {
                    background-color: #005bb5;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(50px); }
                    to { transform: translateY(0); }
                }
            </style>
        </head>
        <body>
            <div class="details-container">
                <div class="video-details">
                    <h2>${msg}</h2>
                    <img alt="download" height="300" class="image" src="${URL.data[0].thumbnail}"/><br/>
                    <a class="download-button" href="${URL.data[0].url}">Download Video</a>

                </div>
                <a  class="a" href="/">donload other videos</a>
            </div>

            <script>
                function downloadVideo() {
                    // Implement your download functionality here
                    alert('Downloading video...');
                }
            </script>
        </body>
        </html>
        `);
    } catch (error) {
        console.log(error )
        URL = {"data":
            [
                {
                    "url": "",
                    "thumbnail": "error.jpeg"
                }
            ]
        }
        msg="sorry but there is a server error please try again later 😓";
        res.send(`
            <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Download Instagram Video</title>
        <link rel="shortcut icon" href="icon.webp" type="image/webp">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Arial', sans-serif;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #1a1a2e;
                color: #ffffff;
            }

            .details-container {
                text-align: center;
                max-width: 500px;
                animation: fadeIn 1.5s ease-in-out;
            }

            .video-details {
                background-color: #222;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                animation: slideUp 1s ease-out;
            }

            .video-details p {
                margin: 10px 0;
            }

            .download-button {
                padding: 12px 24px;
                background-color: #0485ff;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 5px;
                font-size: 1.2em;
                transition: background-color 0.3s ease;
            }
            .a {
                background:yellow;
                padding: 12px 24px;
                color: black;
                border: none;
                cursor: pointer;
                border-radius: 5px;
                font-size: 1.2em;
                transition: background-color 0.3s ease;
                }
            .a:hover{background:black;color: white;}

            .download-button:hover {
                background-color: #005bb5;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from { transform: translateY(50px); }
                to { transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="details-container">
            <div class="video-details">
                <h2>${msg}</h2>
                <img alt="download" height="300" class="image" src="${URL.data[0].thumbnail}"/><br/>
                <a class="download-button" href="${URL.data[0].url}">Download Video</a>

            </div>
            <a  class="a" href="/">donload other videos</a>
        </div>

        <script>
            function downloadVideo() {
                // Implement your download functionality here
                alert('Downloading video...');
            }
        </script>
    </body>
    </html>
    `);
    }
});

function gen_id() {
    let min = 100;
    let max = 10000;
        return Math.floor(Math.random() * (max - min) + min);
    
}


app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/error.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



