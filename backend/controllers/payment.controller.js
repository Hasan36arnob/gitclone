import User from "../models/user.model.js";

export const checkout = async (req, res) => {
	try {
		const { plan } = req.body;
		const userId = req.user._id;

		if (!["pro", "enterprise"].includes(plan)) {
			return res.status(400).json({ success: false, error: "Invalid plan" });
		}

		// In a real business, you would redirect to Payoneer/Wise Checkout here
		// For this demo, we'll simulate a successful payment
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, error: "User not found" });
		}

		user.plan = plan;
		// Set expiry to 30 days from now
		user.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
		await user.save();

		res.status(200).json({ success: true, message: `Upgraded to ${plan} successfully` });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
