const Cloudinary=require('cloudinary').v2

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports= Cloudinary; 