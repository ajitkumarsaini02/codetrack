const Friendship = require("../models/Friendship");

const getFriends = async (req, res, next) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: "accepted",
    }).populate("requester recipient", "name username avatar");

    res.json({ success: true, data: friendships });
  } catch (error) {
    next(error);
  }
};

const sendRequest = async (req, res, next) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId || recipientId === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Valid recipientId is required",
      });
    }

    const existing = await Friendship.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Friendship request already exists",
      });
    }

    const friendship = await Friendship.create({
      requester: req.user._id,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: friendship,
    });
  } catch (error) {
    next(error);
  }
};

const respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected",
      });
    }

    const friendship = await Friendship.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
        status: "pending",
      },
      { status },
      { new: true, runValidators: true },
    );

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Pending request not found",
      });
    }

    res.json({ success: true, data: friendship });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFriends, sendRequest, respondToRequest };
