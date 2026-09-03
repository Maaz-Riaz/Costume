const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadToImageKit = async (file, folder = 'costume-store') => {
  try {
    const result = await imagekit.upload({
      file: file.buffer, // From multer memory storage
      fileName: file.originalname,
      folder: `/${folder}`
    });

    return {
      success: true,
      url: result.url,
      fileId: result.fileId
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { imagekit, uploadToImageKit, deleteFromImageKit };
