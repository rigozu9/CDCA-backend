const mongoose = require("mongoose")

const clothingSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	}
})

clothingSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Clothing", clothingSchema)