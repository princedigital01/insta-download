const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to validate Instagram URL
function isValidInstagramUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/(p|reel|tv)/;
    return regex.test(url);
}

// Function to extract video details and URL from Instagram page
async function getInstagramVideoDetails(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // Extract video URL
        const videoUrl = $('meta[property="og:video"]').attr('content') ||
            $('meta[property="og:video:secure_url"]').attr('content');

        // Extract video details (like counts, comments, etc.)
        const likes = $('meta[name="description"]').attr('content').match(/(\d+)\s+Likes/);
        const comments = $('meta[name="description"]').attr('content').match(/(\d+)\s+Comments/);

        if (!videoUrl) {
            throw new Error('Unable to find video URL. Ensure the post is public and contains a video.');
        }

        return {
            videoUrl,
            likes: likes ? likes[1] : 'Unknown',
            comments: comments ? comments[1] : 'Unknown'
        };
    } catch (error) {
        console.error('Error fetching video details:', error.message);
        throw new Error('Failed to fetch video details. The URL may be invalid, private, or Instagram may have blocked the request.');
    }
}

// Serve the landing page HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle requests to fetch video details
app.get('/details', async (req, res) => {
    const { url } = req.query
    //console.log(req);

    // Validate URL
    if (!url || !isValidInstagramUrl(url)) {
        return res.status(400).json({ error: 'Please provide a valid Instagram post URL (e.g., https://www.instagram.com/p/...)' });
    }

    try {
        const videoDetails = await getInstagramVideoDetails(url);

        // Render the details page with the fetched data
        res.send(`
            <html>
            <head>
                <title>Video Details</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; }
                    .details { margin-top: 20px; text-align: center; }
                    .download-button { margin-top: 20px; padding: 10px 20px; font-size: 16px; background-color: #0485ff; color: white; border: none; border-radius: 4px; cursor: pointer; }
                    .download-button:hover { background-color: #005bb5; }
                </style>
            </head>
            <body>
                <div class="details">
                    <h1>Video Details</h1>
                    <p>Likes: ${videoDetails.likes}</p>
                    <p>Comments: ${videoDetails.comments}</p>
                    <button class="download-button" onclick="window.location.href='/download?url=${encodeURIComponent(url)}'">Download Video</button>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to handle video download requests
app.get('/download', async (req, res) => {
    const { url } = req.query;

    // Validate URL
    if (!url || !isValidInstagramUrl(url)) {
        return res.status(400).json({ error: 'Please provide a valid Instagram post URL (e.g., https://www.instagram.com/p/...)' });
    }

    try {
        const videoDetails = await getInstagramVideoDetails(url);

        // Send the video file directly to the client
        res.setHeader('Content-Disposition', 'attachment; filename=instagram-video.mp4');
        res.redirect(videoDetails.videoUrl); // Redirects directly to the video URL for download
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
