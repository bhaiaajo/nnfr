const express = require('express')

const fetch = require("node-fetch").default

const app = express()

const utils = require("./search")

const cinemeta = require("cinemeta.js")

app.use(express.json())

const fs = require("fs")

function name(namea){

    if(namea.length > 10){
        return namea.substring(0, 10) + ".."
    }else{
        return namea
    }

}

app.get("/robots.txt", (req,res) => res.sendFile(__dirname + "/robots.txt"))

app.use("/css", express.static(__dirname + "/css"))
app.use("/js", express.static(__dirname + "/js"))

app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/search", (req, res) =>{
    const file = fs.readFileSync("./public/search.html", "utf8")
    const searchTerm = req.query.q
    let code = ""
    res.setHeader('Content-Type', "text/html")
    if(!searchTerm) return res.send(file.replace("{result}", "No Result Found (Use imdb id instead)"))
    fetch("https://nnfr.onrender.com/api/search?q=" + searchTerm).then(g => g.json()).then(async g =>{
        if(!g) return res.send(file.replace("{result}", "No Result Found (Use imdb id instead)"))
        if(!g?.[0]) return res.send(file.replace("{result}", "No Result Found (Use imdb id instead)"))
        await g.forEach(x =>{
            code += `<a href="/play/${x.imdbID}"><div class="float-child"><img src="${x.Poster}" width="250", height="400"><br><span>${name(x.Title)}</span></div></a>`

        })
        setTimeout(() =>{
            res.send(file.replace(/{result}/g,code))
        }, 500)
})
})

app.get("/play/:id", async(req,res) =>{

    const type = req.query.type
    let code = ""
    let script = ""
    let url = "https://nnfr.onrender.com"
    const urlgen = await utils.getURL2(req.params.id)

    if(type == "manual"){
        script = `
        <script>
        window.onload = () =>{
            document.getElementById("movie").disabled = true
            document.getElementById("movie").onclick = ()=>{
                document.getElementById("iframe").src = "https://vidsrc.to/embed/movie/${req.params.id}"
                document.getElementById("movie").disabled = true
                document.getElementById("tv").disabled = false
            }
            document.getElementById("tv").onclick = ()=>{
                document.getElementById("iframe").src = "https://vidsrc.to/embed/tv/${req.params.id}"
                document.getElementById("movie").disabled = false
                document.getElementById("tv").disabled = true
            }
        }
        </script>`
        code = `
        <button id="movie" class="mbutton">Movie</button>
        <button id="tv" class="mbutton">TV</button>
        <br>
        <iframe id="iframe" frameborder="0" allowfullscreen src="https://vidsrc.to/embed/movie/${req.params.id}"></iframe>
        `
    }else{
        code = `
        <iframe allowfullscreen frameborder="0" src="${urlgen}"></iframe>
        `
        url = `https://nnfr.onrender.com/play/${req.params.id}`
    }
    import("vimdb").then(g => {
        const imdb  = new g.default()
    
        imdb.getShow(req.params.id).then(x =>{
    
    

    const read = fs.readFileSync("./public/watch.html", "utf-8").replace("{code}", code).replace("{id}", req.params.id).replace("{script}", script).replace(/{imglink}/g, x.image.big)
    .replace(/{age}/g, x.contentRating)
    .replace(/{rating}/g, x.aggregateRating.ratingValue + "⭐")
    .replace(/{genre}/g, x.genre.map(x => x).join(", "))
    .replace(/{year}/g, x.year)
    .replace(/{summary}/g, x.summary)
    .replace(/{url}/g, url)

    res.setHeader('Content-Type', 'text/html')

    res.send(read)
})
})

    

})

app.get("/api/search", async(req,res)=>{
    const name = req.query.q
    if(!name) res.send({error: "No Query Provided"})
    let arr = []
    await utils.get(name, async r =>{
        if(r.Response == "False"){
            const data = await cinemeta.search(name)
                await data.forEach(async x =>{
                const url = await utils.getURL2(x.imdb_id)
                if(!url) return;
                x.url = url
                x.Poster = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                x.Type = x.type
                x.imdbID = x.imdb_id
                x.Title = x.name
                await arr.push(x)
            })
        }else{
        await r.Search.forEach(async x =>{
            const url = await utils.getURL2(x.imdbID)
            if(!url) return;
            x.url = url
           arr.push(x) 
        })
    }
setTimeout(() =>{
        res.send(arr.reverse())
},2000)

    })
})


app.use((req,res) =>{
    res.sendFile(__dirname + "/public/404.html")
})

app.listen(8000, () =>{
    console.log("http://localhost:8000")
})
