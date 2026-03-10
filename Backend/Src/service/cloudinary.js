const cloudinary = require('../Config/cloudinaryConfig')

const uploadToCloudinary = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            folder: "chat-users"
        })
        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    } catch (error) {
        console.error("Error while uploading to Cloudinary:", error);
        throw new Error("Cloudinary upload failed");
    }
}
module.exports=uploadToCloudinary