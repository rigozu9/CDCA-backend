const jwt = require("jsonwebtoken")
const clothesRouter = require("express").Router()
const Clothing = require("../models/clothing")
const User = require("../models/user")

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }
  return null
}

clothesRouter.get("/", async (request, response) => {
  const clothes = await Clothing
    .find({})
    .populate("user", { username: 1, name: 1 })

  response.json(clothes)
})

clothesRouter.get("/:id", async (request, response) => {
  const clothing = await Clothing.findById(request.params.id)
  if (clothing) {
    response.json(clothing)
  } else {
    response.status(404).end()
  }
})

clothesRouter.post("/", async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }
  const user = await User.findById(decodedToken.id)

  const clothing = new Clothing({
    name: body.name,
    info: body.info,
    size: body.size,
    price: body.price,
    user: user._id
  })

  const savedClothing = await clothing.save()
  user.clothes = user.clothes.concat(savedClothing._id)
  await user.save()
  response.status(201).json(savedClothing)
})

clothesRouter.delete("/:id", async (request, response) => {
  await Clothing.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = clothesRouter