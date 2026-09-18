import '../../scss/analytics.scss'

interface AnalyticsCardProps {
	title: string;
	value: string | number;	
}

// React component to create a card
function AnalyicsCard({title, value}: AnalyticsCardProps){
	return (
		<div className="analytics-card">
			<h2 className="analytics-card-title">
				{title}
			</h2>
			<p className="analytics">
				{value}
				</p>
		</div>
	)
}

export default AnalyicsCard;