const Revision = require("../models/Revision");

const getRevisions = async (userId) => {
  return Revision.find({ user: userId }).sort({ scheduledAt: 1 }).lean();
};

const createRevision = async (userId, data) => {
  return Revision.create({
    user: userId,
    problem: data.problem || null,
    title: data.title,
    notes: data.notes || "",
    scheduledAt: data.scheduledAt,
    status: "pending",
  });
};

const updateRevision = async (userId, revisionId, data) => {
  const updates = {};

  for (const field of ["title", "notes", "scheduledAt", "status", "problem"]) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  if (updates.status === "completed") {
    updates.completedAt = new Date();
  } else if (updates.status === "pending") {
    updates.completedAt = null;
  }

  return Revision.findOneAndUpdate({ _id: revisionId, user: userId }, updates, {
    new: true,
    runValidators: true,
  });
};

const deleteRevision = async (userId, revisionId) => {
  return Revision.findOneAndDelete({
    _id: revisionId,
    user: userId,
  });
};

module.exports = {
  getRevisions,
  createRevision,
  updateRevision,
  deleteRevision,
};
