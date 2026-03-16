import User from "../models/user.model.js";

export const checkSearchLimit = async (req, res, next) => {
	if (!req.user) {
		return next(); // If not logged in, we let the normal logic handle it
	}

	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: "User not found" });

		// Reset search count if it's a new day (simple version)
		const today = new Date().setHours(0, 0, 0, 0);
		const lastSearchDay = new Date(user.updatedAt).setHours(0, 0, 0, 0);

		if (today > lastSearchDay) {
			user.searchCount = 0;
		}

		if (user.plan === "free" && user.searchCount >= 10) {
			return res.status(403).json({
				error: "Daily search limit reached for Free plan. Please upgrade to Pro for unlimited searches.",
			});
		}

		user.searchCount += 1;
		await user.save();
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
