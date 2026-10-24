const Problem = require("../models/Problem");
const DailyProgress = require("../models/DailyProgress");

const getProblems = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(5000, Math.max(1, Number(req.query.limit) || 1000));

    const filter = { user: req.user._id };

    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Problem.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const createProblem = async (req, res, next) => {
  try {
    const isSolved = req.body.status === "solved";
    const problem = await Problem.create({
      ...req.body,
      user: req.user._id,
      solvedAt: isSolved ? new Date() : null,
    });

    if (isSolved) {
      const todayStr = new Date().toISOString().split("T")[0];
      await DailyProgress.findOneAndUpdate(
        { user: req.user._id, date: todayStr },
        {
          $inc: { problemsSolved: 1 },
          $setOnInsert: {
            user: req.user._id,
            date: todayStr,
            minutesSpent: 15,
          },
        },
        { upsert: true, new: true },
      );
    }

    res.status(201).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.user;

    const existing = await Problem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (updates.status === "solved" && existing.status !== "solved") {
      updates.solvedAt = new Date();
      const todayStr = new Date().toISOString().split("T")[0];
      await DailyProgress.findOneAndUpdate(
        { user: req.user._id, date: todayStr },
        {
          $inc: { problemsSolved: 1 },
          $setOnInsert: {
            user: req.user._id,
            date: todayStr,
            minutesSpent: 15,
          },
        },
        { upsert: true, new: true },
      );
    } else if (
      updates.status &&
      updates.status !== "solved" &&
      existing.status === "solved"
    ) {
      updates.solvedAt = null;
      const todayStr = new Date().toISOString().split("T")[0];
      await DailyProgress.findOneAndUpdate(
        { user: req.user._id, date: todayStr, problemsSolved: { $gt: 0 } },
        { $inc: { problemsSolved: -1 } },
      );
    }

    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true },
    );

    res.json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  createProblem,
  getProblemById,
  updateProblem,
  deleteProblem,
};
