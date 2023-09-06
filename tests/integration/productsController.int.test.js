const request = require("supertest");
const app = require("../../server");
const newProduct = require("../mock-data/new-product.json");
const path = require("path");
const fs = require("fs");
// const imageBuffer = fs.readFileSync(
//   path.join(__dirname, "../mock-data/picture-test.jpg")
// );

const endpointURL = "/api/v1/products";

// const base64Image = imageBuffer.toString("base64");

const JSON = {
  title: "Mock unit test",
  description: "Ces croquettes pour chat sont les meilleures du marché",
  price: 6.9,
  weight: 1,
  category: "food",
  // picture: base64Image,
};

describe(endpointURL, () => {
  it("POST " + endpointURL, async () => {
    const response = await request(app).post(endpointURL).send(JSON);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(JSON.title);
  });
});
