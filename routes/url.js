const express = require('express');
const router = express.Router();
const validUrlChecker = require('valid-url');
const shortidGenerator = require('shortid');
const config = require('config');

const Url = require('../models/Url');

// @route       POST /api/url/shorten
// @desc        Create short URL
router.post('/shorten', async (req,res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    //check base url
    if(!validUrlChecker.isUri(baseUrl)){
        return res.status(401).json('Invalid base url');
    }

    //create short url code
    const urlShortCode = shortidGenerator.generate();

    //check long url validity
    if(validUrlChecker.isUri(longUrl)){
        try {
            let url = await Url.findOne({ longUrl: longUrl});

            if (url){
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlShortCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlShortCode,
                    dateCreated: new Date()
                });

                await url.save(); // this works because we defined url as coming from the db using findOne

                res.json(url);
            }
        } catch (error) {
            console.error(err);
            res.status(500).json('Server error!');
            
        }
    } else {
        res.status(401).json('invalid long url');
    }




})

module.exports = router;