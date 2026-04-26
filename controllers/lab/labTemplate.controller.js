const LabTemplate = require("../../models/labTemplate.model");

/* CREATE TEMPLATE */
exports.createLabTemplate = async (req, res) => {
  try {
    const template = await LabTemplate.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lab template created successfully",
      template,
    });
  } catch (error) {
    console.log("Create Lab Template Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create lab template",
      error: error.message,
    });
  }
};

/* GET ALL TEMPLATES */
exports.getAllLabTemplates = async (req, res) => {
  try {
    const templates = await LabTemplate.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    console.log("Get Lab Templates Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lab templates",
      error: error.message,
    });
  }
};

/* UPDATE TEMPLATE */
exports.updateLabTemplate = async (req, res) => {
  try {
    const template = await LabTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Lab template updated successfully",
      template,
    });
  } catch (error) {
    console.log("Update Lab Template Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lab template",
      error: error.message,
    });
  }
};

exports.deleteLabTemplate = async (req, res) => {
  try {
    const template = await LabTemplate.findByIdAndDelete(req.params.id)

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Template deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete template",
      error: error.message
    })
  }
}