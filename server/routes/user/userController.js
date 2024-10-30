import User from "../../models/User.js";

export const getAllUsers = async (req, res) => {
  const { role, username, page = 1, limit = 10, sortCriterion } = req.query;

  // Build query object based on optional filters
  const query = {};
  if (role) query.role = role;
  if (username) query.username = { $regex: username, $options: "i" }; // Case-insensitive search

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortObj = { username: 1 }; // Default sorting by username

    if (sortCriterion === "mostPolls") {
      // Sort by pollsCreated array length
      const users = await User.aggregate([
        { $match: query }, // Apply filters
        {
          $addFields: {
            pollsCount: { $size: "$pollsCreated" }, // Add field with array length
          },
        },
        { $sort: { pollsCount: -1 } }, // Sort by polls count (descending)
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $project: {
            username: 1,
            email: 1,
            role: 1,
            accessStatus: 1,
            removedPollCount: 1,
            pollsCreated: 1,
          },
        },
      ]);

      const totalUsers = await User.countDocuments(query);
      return res.status(200).json({
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: parseInt(page),
      });
    } else if (sortCriterion === "mostRemovedPollCount") {
      // Sort by removedPollCount (descending)
      sortObj = { removedPollCount: -1 };
    }

    // Execute query with default or removedPollCount sorting, skip, and limit
    const users = await User.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select("username email role pollsCreated accessStatus removedPollCount");

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

export const getUserInfo = async (req, res) => {
  const { username } = req.params;

  try {
    //console.log(req.user);
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const alterAccess = async (req, res) => {
  const { accessStatus, userId } = req.body;
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const user = await User.findById(userId);

    if (user.accessStatus !== accessStatus) {
      res
        .status(400)
        .json({ message: "Error while matching access Status of the user" });
    }

    user.accessStatus = !accessStatus;
    await user.save();

    res.status(200).json({ message: "Access status changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
