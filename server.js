const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
require('dotenv').config()
const { nanoid } = require('nanoid')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(__dirname + '/views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index', { link: '' })
})

app.post('/makeShortUrl', async (req, res) => {
  const { url } = req.body
  const { dbo } = req.app.locals
  let shortUrl = nanoid(6)

  let obj = {
    fullUrl: url,
    shortUrl,
  }
  let link = `${req.protocol}://${req.get('host')}/${shortUrl}`

  try {
    await dbo.collection('links').insertOne(obj)
    res.json({ link })
  } catch (error) {
    console.error(error)
  }
})

app.get('/:shortUrl', async (req, res) => {
  const { dbo } = req.app.locals
  let { shortUrl } = req.params
  try {
    let link = await dbo.collection('links').findOne({ shortUrl })
    if (!link) return res.send('Not found')
    res.redirect(link.fullUrl)
  } catch (error) {
    console.error(error)
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  MongoClient.connect(
    process.env.DB_URL,
    { useUnifiedTopology: true },
    (err, db) => {
      if (err) throw err

      app.locals.dbo = db.db('url-shrinker')
      console.log('db connected')
    }
  )
})
