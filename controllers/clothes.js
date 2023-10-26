const clothesRouter = require("express").Router()
const Clothing = require("../models/clothing")

clothesRouter.get("/", async (request, response) => {
	const clothes = await Clothing.find({})
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

	const clothing = new Clothing({
		name: body.name,
	})

	const savedClothing = await clothing.save()
	response.status(201).json(savedClothing)
})

clothesRouter.delete("/:id", async (request, response) => {
	await Clothing.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

module.exports = clothesRouter