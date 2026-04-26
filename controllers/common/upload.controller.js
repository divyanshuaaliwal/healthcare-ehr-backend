exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.log("Upload File Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};