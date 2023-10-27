const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)
const Clothing = require("../models/clothing")

describe("when there is initially some clothes saved", () => {
  beforeEach(async () => {
    await Clothing.deleteMany({})
    await Clothing.insertMany(helper.initialClothes)
  })

  test("clothes are returned as json", async () => {
    await api
      .get("/api/clothes")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all clothes are returned", async () => {
    const response = await api.get("/api/clothes")

    expect(response.body).toHaveLength(helper.initialClothes.length)
  })

  test("a specific clothing is within the returned clothes", async () => {
    const response = await api.get("/api/clothes")

    const contents = response.body.map(r => r.name)

    expect(contents).toContain(
      "Doublet hoodie"
    )
  })
  describe("viewing a specific clothign", () => {
    test("a specific clothing can be viewed", async () => {
      const clothesAtStart = await helper.clothesInDb()

      const clothingToView = clothesAtStart[0]


      const resultClothing = await api
        .get(`/api/clothes/${clothingToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(resultClothing.body).toEqual(clothingToView)
    })
    describe("addition of a new clothign", () => {
      test("a valid clothing can be added ", async () => {
        const newClothing = {
          name: "dortmund shirt",
        }

        await api
          .post("/api/clothes")
          .send(newClothing)
          .expect(201)
          .expect("Content-Type", /application\/json/)


        const clothesAtEnd = await helper.clothesInDb()
        expect(clothesAtEnd).toHaveLength(helper.initialClothes.length + 1)

        const contents = clothesAtEnd.map(n => n.name)
        expect(contents).toContain(
          "dortmund shirt"
        )
      })

      test("fails with status code 400 if data invalid", async () => {
        const newClothing = {

        }

        await api
          .post("/api/clothes")
          .send(newClothing)
          .expect(400)

        const clothesAtEnd = await helper.clothesInDb()

        expect(clothesAtEnd).toHaveLength(helper.initialClothes.length)
      })

      describe("deletion of a note", () => {
        test("a clothing can be deleted", async () => {
          const clothesAtStart = await helper.clothesInDb()
          const clothingToDelete = clothesAtStart[0]


          await api
            .delete(`/api/clothes/${clothingToDelete.id}`)
            .expect(204)

          const clothesAtEnd = await helper.clothesInDb()

          expect(clothesAtEnd).toHaveLength(
            helper.initialClothes.length - 1
          )

          const contents = clothesAtEnd.map(r => r.name)

          expect(contents).not.toContain(clothingToDelete.name)
        })
      })
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})