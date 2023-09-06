const productsController = require("../../controllers/productsController");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../mock-data/new-product.json");
const fs = require("fs");
const path = require("path");

const imageBuffer = fs.readFileSync(
  path.join(
    __dirname,
    "../../public/uploads/photo_64d2542e4a9cf6579d576703.jpg"
  )
);

productModel.create = jest.fn();

describe("productsController.createProduct", () => {
  it("should have a createProduct function", () => {
    expect(typeof productsController.createProduct).toBe("function");
  });
  it("should call productModel.create", async () => {
    let req, res, next;

    req = httpMocks.createRequest({
      method: "POST",
      url: "http://localhost:8080/api/v1/products/",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: newProduct,
      files: {
        picture: {
          name: "picture.jpg",
          data: imageBuffer,
          mimetype: "image/jpeg", // Modifiez le type MIME en fonction du format de votre image
          size: imageBuffer.length,
        },
      },
    });
    res = httpMocks.createResponse();
    next = null;
    await productsController.createProduct(req, res, next);
    expect(productModel.create).toBeCalledWith(newProduct);
  });
});
