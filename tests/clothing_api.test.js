const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Clothing = require("../models/clothing")

const initialClothes = [
	{
		name: "Numebrnine shirt",
	},
	{
		name: "Doublet hoodie",
	},
]

beforeEach(async () => {
	await Clothing.deleteMany({})
	let clothingObject = new Clothing(initialClothes[0])
	await clothingObject.save()
	clothingObject = new Clothing(initialClothes[1])
	await clothingObject.save()
})

test("all clothes are returned", async () => {
	const response = await api.get("/api/clothes")

	expect(response.body).toHaveLength(initialClothes.length)
})

afterAll(async () => {
	await mongoose.connection.close()
})

test("a specific clothing is within the returned notes", async () => {
	const response = await api.get("/api/clothes")

	const contents = response.body.map(r => r.name)

	expect(contents).toContain(
		"Doublet hoodie"
	)
})

test("there are 2 clothes", async () => {
	const response = await api.get("/api/clothes")

	expect(response.body).toHaveLength(2)
})

test("the first piece is a Numebrnine shirt", async () => {
	const response = await api.get("/api/clothes")

	expect(response.body[0].name).toBe("Numebrnine shirt")
})