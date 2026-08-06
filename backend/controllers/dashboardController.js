const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getStats = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const completedAlgorithms = typeof user.completedModules === 'number'
      ? user.completedModules
      : (Array.isArray(user.progress?.algorithms)
          ? user.progress.algorithms.filter((a) => a.completed).length
          : 0);

    const totalPoints = typeof user.points === 'number' && user.points > 0
      ? user.points
      : completedAlgorithms * 150;

    const totalPracticeTime = user.progress?.totalPracticeTime || (completedAlgorithms * 25);
    const averageScore = user.progress?.averageScore || (completedAlgorithms > 0 ? 85 : 0);
    const streak = typeof user.streak === 'number' ? user.streak : 1;

    // Calculate real rank compared to all MongoDB users
    const totalUsers = await User.countDocuments();
    const higherRankedUsers = await User.countDocuments({ points: { $gt: totalPoints } });
    const rank = higherRankedUsers + 1;

    res.json({
      totalPoints,
      completedAlgorithms,
      totalPracticeTime,
      averageScore,
      rank,
      streak,
      totalUsers,
    });
  } catch (err) {
    console.error('[DASHBOARD STATS ERROR]', err);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(20);
    res.json(activities);
  } catch (err) {
    console.error('[DASHBOARD ACTIVITY ERROR]', err);
    res.status(500).json({ message: 'Server error fetching recent activity' });
  }
};
