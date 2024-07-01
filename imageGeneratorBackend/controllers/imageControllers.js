const imageModel = require('../models/imageModel.js');

const generateImage = async (req, res) => {
    const body = req.body;
    const searchText = body.searchText;

    function getRandomLink(data) {
        const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
    
        const source = Math.random() < 0.5 ? 'urls' : 'links';
        const linkObject = randomItem[source];
    
        const linkKeys = Object.keys(linkObject);
        const randomKey = linkKeys[Math.floor(Math.random() * linkKeys.length)];
        console.log(linkObject[randomKey]);
        return linkObject[randomKey];
    }
    

    let imageUrl = "";
    try{
        const res = fetch(`https://unsplash.com/napi/search/photos?page=1&per_page=20&query=${searchText}&xp=search-hyperloop%3Aexperiment`, {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin"
            },
            "referrer": `https://unsplash.com/s/photos/${searchText}`,
            "referrerPolicy": "origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
          });
        const data  = await res.json();
        imageUrl = getRandomLink(data);
        console.log(data);

        await imageModel.create({
            searchText: searchText,
        });
    }
     
    catch(err){
        console.log(err);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while generating the image'
        });
    }

    res.json({
        status: 'success',
        data: {
            imageUrl: imageModel.imageUrl,
            createdAt: imageModel.createdAt,
        }
    })
}

module.exports = {
    generateImage
}