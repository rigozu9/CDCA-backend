const Clothing = require("../models/clothing")

const initialClothes = [
	{
		name: "Numebrnine shirt",
	},
	{
		name: "Doublet hoodie",
	},
]

const nonExistingId = async () => {
	const clothing = new Clothing({ name: "willremovethissoon" })
	await clothing.save()
	await clothing.remove()

	return clothing._id.toString()
}

const clothesInDb = async () => {
	const clothes = await Clothing.find({})
	return clothes.map(clothing => clothing.toJSON())
}

module.exports = {
	initialClothes, nonExistingId, clothesInDb
}