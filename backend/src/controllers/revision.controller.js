const Revision = require("../models/Revision");

const getRevisions = async (req, res, next) => {
  try {
    const revisions = await Revision.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: revisions });
  } catch (error) {
    next(error);
  }
};

const createRevision = async (req, res, next) => {
  try {
    const revision = await Revision.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: revision,
    });
  } catch (error) {
    next(error);
  }
};

const updateRevision = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.user;

    const revision = await Revision.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true },
    );

    if (!revision) {
      return res.status(404).json({
        success: false,
        message: "Revision not found",
      });
    }

    res.json({ success: true, data: revision });
  } catch (error) {
    next(error);
  }
};

const deleteRevision = async (req, res, next) => {
  try {
    const revision = await Revision.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!revision) {
      return res.status(404).json({
        success: false,
        message: "Revision not found",
      });
    }

    res.json({
      success: true,
      message: "Revision deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRevisions,
  createRevision,
  updateRevision,
  deleteRevision,
};
