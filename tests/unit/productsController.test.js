const productsController = require("../../controllers/productsController");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../mock-data/new-product.json");
const fs = require("fs");
const path = require("path");

// const img = fs.readFile(
//   "./public/uploads/photo_64d2542e4a9cf6579d576703.jpg",
//   (err) => {
//     console.log(err);
//   }
// );

// const picture = new Blob([img], { type: "image/jpeg" });

productModel.create = jest.fn();

// const formData = new FormData();
// formData.append("title", "test");
// formData.append("description", "test");
// formData.append("price", 1);
// formData.append("weight", 2);
// formData.append("category", "toys");
// formData.append("picture", picture, "picture.jpg");

// const jpegImage = fs.readFileSync(
//   path.resolve(
//     "../../public/uploads/photo_64d2542e4a9cf6579d576703.jpg",
//     "./mock_img.jpeg"
//   )
// );
// test("expects to find the dimensions of an jpg image", () => {
//   getIMGDimensions("jpg", jpegImage).then((result) => {
//     expect(result).toStrictEqual({ imgH: 400, imgW: 400 });
//   });
// });

describe("productsController.createProduct", () => {
  it("should have a createProduct function", () => {
    expect(typeof productsController.createProduct).toBe("function");
  });
  it("should call productModel.create", () => {
    let req, rest, next;
    const imageBuffer = fs.readFileSync(
      path.join(
        __dirname,
        "../../public/uploads/photo_64d2542e4a9cf6579d576703.jpg"
      )
    );
    console.log(newProduct);
    req = httpMocks.createRequest({
      method: "post",
      url: "http://localhost:8080/api/v1/products/",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // files: {
      //   picture: "photo_64df5b891bca6f61d40cad3e.jpg",
      // },
      data: newProduct,
      files: {
        picture: {
          data: imageBuffer,
          mimetype: "image/jpeg", // Modifiez le type MIME en fonction du format de votre image
          size: imageBuffer.length,
        },
      },
    });
    res = httpMocks.createResponse();
    next = null;
    req.body = newProduct;
    productsController.createProduct(req, rest, next);
    expect(productModel.create).toBeCalledWith(newProduct);
  });
});
