const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadFile = (buffer, folder = "srisai-projects") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image", 
        timeout: 60000, //  60 seconds
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { uploadFile };
