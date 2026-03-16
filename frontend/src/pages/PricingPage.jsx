import { FaCheck } from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const PricingPage = () => {
	const { authUser, setAuthUser } = useAuthContext();

	const handleUpgrade = async (plan) => {
		if (!authUser) {
			toast.error("Please login to upgrade");
			return;
		}

		try {
			const res = await fetch("/api/payments/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ plan }),
			});
			const data = await res.json();
			if (data.success) {
				toast.success(`Successfully upgraded to ${plan}!`);
				setAuthUser({ ...authUser, plan });
			} else {
				toast.error(data.error || "Upgrade failed");
			}
		} catch (error) {
			toast.error("Payment integration failed");
		}
	};

	const tiers = [
		{
			name: "Free",
			price: "0",
			features: ["10 Searches/day", "Basic Profiles", "No Likes History"],
			plan: "free",
		},
		{
			name: "Pro",
			price: "9",
			features: ["Unlimited Searches", "Full Profiles", "Likes History", "Priority Support"],
			plan: "pro",
		},
		{
			name: "Enterprise",
			price: "49",
			features: ["API Access", "Custom Reports", "Dedicated Account Manager", "Team Management"],
			plan: "enterprise",
		},
	];

	return (
		<div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
			<div className='mx-auto max-w-screen-md text-center mb-8 lg:mb-12'>
				<h2 className='mb-4 text-4xl tracking-tight font-extrabold text-white'>Scale your GitHub Insights</h2>
				<p className='mb-5 font-light text-gray-400 sm:text-xl'>
					Choose the plan that fits your professional needs. Pay securely via Payoneer or Wise.
				</p>
			</div>
			<div className='space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0'>
				{tiers.map((tier) => (
					<div
						key={tier.name}
						className='flex flex-col p-6 mx-auto max-w-lg text-center bg-glass rounded-lg border border-gray-600 shadow text-white'
					>
						<h3 className='mb-4 text-2xl font-semibold'>{tier.name}</h3>
						<div className='flex justify-center items-baseline my-8'>
							<span className='mr-2 text-5xl font-extrabold'>${tier.price}</span>
							<span className='text-gray-400'>/month</span>
						</div>
						<ul role='list' className='mb-8 space-y-4 text-left'>
							{tier.features.map((feature) => (
								<li key={feature} className='flex items-center space-x-3'>
									<FaCheck className='flex-shrink-0 w-5 h-5 text-green-500' />
									<span>{feature}</span>
								</li>
							))}
						</ul>
						<button
							onClick={() => handleUpgrade(tier.plan)}
							disabled={authUser?.plan === tier.plan}
							className={`text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
								authUser?.plan === tier.plan ? "opacity-50 cursor-not-allowed" : "bg-blue-600"
							}`}
						>
							{authUser?.plan === tier.plan ? "Current Plan" : "Get started"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default PricingPage;
