const clothesRouter = require("express").Router()
const Clothing = require("../models/clothing")

clothesRouter.get("/", (request, response) => {
	Clothing.find({})
		.then(clothes => {
			response.json(clothes)
		})
})

clothesRouter.get("/:id", (request, response, next) => {
	Clothing.findById(request.params.id)
		.then(clothing => {
			if (clothing) {
				response.json(clothing)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

clothesRouter.post("/", (request, response, next) => {
	const body = request.body

	const clothing = new Clothing({
		name: body.name,
	})

	clothing.save()
		.then(savedClothing => {
			response.json(savedClothing)
		})
		.catch(error => next(error))
})

clothesRouter.delete("/:id", (request, response, next) => {
	Clothing.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

module.exports = clothesRouter