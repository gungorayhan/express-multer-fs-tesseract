const express = require("express")
const fs = require("fs")
const multer = require("multer")
const { createWorker } = require("tesseract.js")
// const Tesseract = require("tesseract.js")

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single("avatar")



app.get("/", (req, res) => {
    res.render("index")
})

app.post("/upload", async (req, res) => {
    const worker = await createWorker('eng');
    const rectangle = { left: 0, top: 0, width: 500, height: 250 };

    upload(req, res, err => {
       fs.readFile(`./uploads/${req.file.originalname}`,async(err,data)=>{
        if(err) return console.log(err)

        const ret = await worker.recognize(data,{ tessjs_create_pdf: "1"});
        console.log(ret.data.text);
        await worker.terminate();

        res.json({
            text:ret.data.text
           })
       })
    })
})
app.listen(8080, () => {
    console.log("Server is listenin on port 8080")
})