const {
  analyzeAndSaveProfile,
  getProfileByUsername,
  getAllProfiles,
  deleteProfile,
} = require('../services/profileService');

async function analyzeProfile(req, res, next) {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Username is required and must be a string',
      });
    }

    if (username.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Username cannot be empty',
      });
    }

    const profile = await analyzeAndSaveProfile(username.trim());

    res.status(200).json({
      status: 'success',
      message: 'Profile analyzed and saved successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        status: 'error',
        message: 'Username is required',
      });
    }

    const profile = await getProfileByUsername(username);

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: `Profile for user "${username}" not found. Please analyze the profile first.`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

async function listProfiles(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const result = await getAllProfiles(limit, offset);

    res.status(200).json({
      status: 'success',
      count: result.profiles.length,
      total: result.total,
      page,
      limit,
      data: result.profiles,
    });
  } catch (error) {
    next(error);
  }
}

async function removeProfile(req, res, next) {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        status: 'error',
        message: 'Username is required',
      });
    }

    const profile = await getProfileByUsername(username);

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: `Profile for user "${username}" not found`,
      });
    }

    await deleteProfile(username);

    res.status(200).json({
      status: 'success',
      message: `Profile for user "${username}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  analyzeProfile,
  getProfile,
  listProfiles,
  removeProfile,
};
