const fetch = require("node-fetch").default

const url = "http://www.omdbapi.com/?apikey=2c6e7a77&s="

function get(name, r){


    fetch(url + encodeURI(name)).then(g => g.json()).then(g =>{

        r(g)

    })

}

function getURL(id, type, r){
    if(type === "series" || type== "TV Series"){
        fetch("https://vidsrc.to/embed/tv/" + id).then(g => {
            if(g.status==404) {
            
                fetch("https://vidsrc.me/embed/tv?imdb=" + id).then(g=>{

                if(g.status==200){
                r("https://vidsrc.me/embed/tv?imdb=" + id)
                }else{
                    r(false)
                }

                })

            }else{
                r("https://vidsrc.to/embed/tv/" + id)
            }
    }
    )
    }else{
        fetch("https://vidsrc.to/embed/movie/" + id).then(g => {
            if(g.status==404) {

            fetch("https://vidsrc.me/embed/movie?imdb=" + id).then(g =>{

            if(g.status == 200){

                r("https://vidsrc.me/embed/movie?imdb=" + id)

            }else{
                r(false)
            }

            })

            }else{
                r("https://vidsrc.to/embed/movie/" + id)
            }
    }
    )

    }

}

class getURLConst{

    async getMovie(id){

        const got = await fetch("https://vidsrc.to/embed/movie/" + id)  

        if(got.status === 200) return "https://vidsrc.to/embed/movie/" + id

        if(got.status === 404){

            const g= await fetch("https://vidsrc.me/embed/movie?imdb=" + id)

            if(g.status === 200) return "https://vidsrc.me/embed/movie?imdb=" + id
            if(g.status === 404) return false

        }

    }

    async getSeries(id){
        
        const got = await fetch("https://vidsrc.to/embed/tv/" + id)
        if(got.status === 200) return "https://vidsrc.to/embed/tv/" + id
        if(got.status === 404) {

            const g = await fetch("https://vidsrc.me/embed/tv?imdb=" + id)

            if(g.status === 200) return "https://vidsrc.me/embed/tv?imdb=" + id
            if(g.status === 404) return false

        }

    }

}

async function getURL2(id){

    const g = new getURLConst()

    const movie = await g.getMovie(id)
    const series = await g.getSeries(id)

    if(movie !== false) return movie
    if(series !== false) return series
    if(!movie && !series) return false

}

module.exports = {get, getURL, getURL2}
