const { sheets } = require("../data/sheetsData");
const Problem = require("../models/Problem");
const DailyProgress = require("../models/DailyProgress");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");

// Helper to optionally resolve user from token if provided without forcing 401
const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return await User.findById(decoded.id).select("_id");
  } catch {
    return null;
  }
};

const getSheets = async (req, res, next) => {
  try {
    const user = await getOptionalUser(req);

    // If user is authenticated, query all solved problems for this user
    let userSolvedTitlesByPlatform = new Map();
    if (user) {
      const solvedProblems = await Problem.find({
        user: user._id,
        status: "solved",
      }).select("title platform");

      for (const p of solvedProblems) {
        let plat = (p.platform || "leetcode").toLowerCase().trim();
        if (plat === "geeksforgeeks") plat = "gfg";
        if (!userSolvedTitlesByPlatform.has(plat)) {
          userSolvedTitlesByPlatform.set(plat, new Set());
        }
        userSolvedTitlesByPlatform.get(plat).add(p.title.toLowerCase().trim());
      }
    }

    const summaries = sheets.map((sheet) => {
      let plat = (sheet.platform || "").toLowerCase().trim();
      if (plat === "geeksforgeeks") plat = "gfg";
      const solvedTitles = userSolvedTitlesByPlatform.get(plat) || new Set();

      let totalProblems = 0;
      let solvedCount = 0;

      sheet.phases.forEach((phase) => {
        phase.topics.forEach((topic) => {
          totalProblems += topic.problems.length;
          if (user) {
            topic.problems.forEach((prob) => {
              if (solvedTitles.has(prob.title.toLowerCase().trim())) {
                solvedCount++;
              }
            });
          }
        });
      });

      return {
        id: sheet.id,
        name: sheet.name,
        tagline: sheet.tagline,
        platform: sheet.platform,
        iconColor: sheet.iconColor,
        accentColor: sheet.accentColor,
        description: sheet.description,
        totalProblems,
        phaseCount: sheet.phases.length,
        solvedCount,
        progressPercentage:
          totalProblems > 0
            ? Math.round((solvedCount / totalProblems) * 100)
            : 0,
      };
    });

    res.json({ success: true, data: summaries });
  } catch (error) {
    next(error);
  }
};

const getSheetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sheet = sheets.find((s) => s.id === id.toLowerCase());

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: `Sheet "${id}" not found. Available sheets: ${sheets.map((s) => s.id).join(", ")}`,
      });
    }

    const user = await getOptionalUser(req);

    const cleanPlatform = sheet.platform.toLowerCase().trim();
    const platformFilter =
      cleanPlatform === "gfg"
        ? { $in: ["gfg", "geeksforgeeks"] }
        : new RegExp(`^${cleanPlatform}$`, "i");

    // Build user solved lookup by title lowercase
    const userStatusMap = new Map();
    if (user) {
      const userProblems = await Problem.find({
        user: user._id,
        platform: platformFilter,
      }).select("title status _id problemUrl");

      for (const p of userProblems) {
        userStatusMap.set(p.title.toLowerCase().trim(), {
          status: p.status,
          id: p._id,
        });
      }
    }

    let overallTotal = 0;
    let overallSolved = 0;

    const enrichedPhases = sheet.phases.map((phase) => {
      let phaseTotal = 0;
      let phaseSolved = 0;

      const enrichedTopics = phase.topics.map((topic) => {
        let topicSolved = 0;

        const enrichedProblems = topic.problems.map((prob) => {
          const userEntry = userStatusMap.get(prob.title.toLowerCase().trim());
          const status = userEntry ? userEntry.status : "todo";
          const isSolved = status === "solved";

          if (isSolved) topicSolved++;

          return {
            ...prob,
            status,
            isSolved,
            mongoId: userEntry ? userEntry.id : null,
          };
        });

        phaseTotal += topic.problems.length;
        phaseSolved += topicSolved;

        return {
          ...topic,
          problems: enrichedProblems,
          totalCount: topic.problems.length,
          solvedCount: topicSolved,
          percentage:
            topic.problems.length > 0
              ? Math.round((topicSolved / topic.problems.length) * 100)
              : 0,
        };
      });

      overallTotal += phaseTotal;
      overallSolved += phaseSolved;

      return {
        ...phase,
        topics: enrichedTopics,
        totalCount: phaseTotal,
        solvedCount: phaseSolved,
        percentage:
          phaseTotal > 0 ? Math.round((phaseSolved / phaseTotal) * 100) : 0,
      };
    });

    res.json({
      success: true,
      data: {
        ...sheet,
        phases: enrichedPhases,
        totalProblems: overallTotal,
        solvedProblems: overallSolved,
        percentage:
          overallTotal > 0
            ? Math.round((overallSolved / overallTotal) * 100)
            : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

const trackSheetProblem = async (req, res, next) => {
  try {
    const { title, platform, difficulty, topic, problemUrl, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Problem title is required",
      });
    }

    const nextStatus = status ? status.toLowerCase() : "solved";
    const cleanPlatform = platform ? platform.toLowerCase().trim() : "leetcode";
    const normPlatform = cleanPlatform === "geeksforgeeks" ? "gfg" : cleanPlatform;

    let cleanDifficulty = difficulty || "Medium";
    if (
      typeof cleanDifficulty === "string" &&
      cleanDifficulty.startsWith("★")
    ) {
      const ratingNum = parseInt(cleanDifficulty.replace("★", "").trim(), 10);
      if (!isNaN(ratingNum)) {
        if (ratingNum < 1200) cleanDifficulty = "Easy";
        else if (ratingNum < 1800) cleanDifficulty = "Medium";
        else cleanDifficulty = "Hard";
      }
    }

    const trimmedTitle = title.trim();
    const escapedTitle = trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const titleRegex = new RegExp(`^${escapedTitle}$`, "i");

    const platformFilter =
      normPlatform === "gfg"
        ? { $in: ["gfg", "geeksforgeeks"] }
        : new RegExp(`^${normPlatform}$`, "i");

    const existingProblem = await Problem.findOne({
      user: req.user._id,
      title: titleRegex,
      platform: platformFilter,
    });

    const wasAlreadySolved = existingProblem?.status === "solved";
    const isNowSolved = nextStatus === "solved";

    let problem;
    if (existingProblem) {
      existingProblem.status = nextStatus;
      if (isNowSolved && !wasAlreadySolved) {
        existingProblem.solvedAt = new Date();
      } else if (!isNowSolved && wasAlreadySolved) {
        existingProblem.solvedAt = null;
      }
      if (difficulty) existingProblem.difficulty = cleanDifficulty;
      if (topic && (!existingProblem.topics || existingProblem.topics.length === 0)) {
        existingProblem.topics = [topic];
      }
      if (problemUrl && !existingProblem.problemUrl) {
        existingProblem.problemUrl = problemUrl;
      }
      problem = await existingProblem.save();
    } else {
      problem = await Problem.create({
        user: req.user._id,
        title: trimmedTitle,
        platform: normPlatform,
        difficulty: cleanDifficulty,
        topics: topic ? [topic] : [],
        problemUrl: problemUrl || "",
        status: nextStatus,
        solvedAt: isNowSolved ? new Date() : null,
      });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (isNowSolved && !wasAlreadySolved) {
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
    } else if (!isNowSolved && wasAlreadySolved) {
      await DailyProgress.findOneAndUpdate(
        { user: req.user._id, date: todayStr, problemsSolved: { $gt: 0 } },
        { $inc: { problemsSolved: -1 } },
      );
    }

    res.json({
      success: true,
      message: `Problem marked as ${nextStatus}`,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

const importAllSheetProblems = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const existing = await Problem.find({ user: userId }).select(
      "title platform",
    );
    const existingSet = new Set(
      existing.map((e) => `${e.platform}:${e.title.toLowerCase().trim()}`),
    );

    const toInsert = [];
    for (const sheet of sheets) {
      for (const phase of sheet.phases) {
        for (const topic of phase.topics) {
          for (const prob of topic.problems) {
            const key = `${sheet.platform}:${prob.title.toLowerCase().trim()}`;
            if (!existingSet.has(key)) {
              existingSet.add(key);
              toInsert.push({
                user: userId,
                title: prob.title.trim(),
                platform: sheet.platform,
                problemUrl: prob.url || "",
                difficulty: prob.difficulty || "Easy",
                status: "todo",
                topics: [topic.topicName || topic.title || "General"],
              });
            }
          }
        }
      }
    }

    let insertedCount = 0;
    if (toInsert.length > 0) {
      const result = await Problem.insertMany(toInsert, { ordered: false });
      insertedCount = result.length;
    }

    const totalNow = await Problem.countDocuments({ user: userId });

    res.json({
      success: true,
      message: `Successfully imported ${insertedCount} questions to your database!`,
      data: {
        imported: insertedCount,
        totalProblems: totalNow,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSheets,
  getSheetById,
  trackSheetProblem,
  importAllSheetProblems,
};
