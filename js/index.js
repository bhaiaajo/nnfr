window.onload = () =>{
    document.addEventListener("keypress", (e) =>{
        if(e.keyCode === 13){
            const searchTerm = document.getElementById("searchinput").value
    
            if(!searchTerm) return alert("Please enter a search term")
    
            window.open("/search?q="+ searchTerm)

            document.getElementById("searchinput").value = ""
        }
})

    document.getElementById("submitbutton").addEventListener("click", () =>{

        const searchTerm = document.getElementById("searchinput").value

        if(!searchTerm) return alert("Please enter a search term")

        window.open("/search?q="+ searchTerm)

        document.getElementById("searchinput").value = ""

    })

}
