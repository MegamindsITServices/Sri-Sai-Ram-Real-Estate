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
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Cloudinary Destroy Error:", error);
  }
};

module.exports = { uploadFile, deleteFromCloudinary };
