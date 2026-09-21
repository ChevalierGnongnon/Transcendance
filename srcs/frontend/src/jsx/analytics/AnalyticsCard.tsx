import '../../scss/analytics.scss'

interface AnalyticsCardProps {
	title: string;
	value: string | number;	
}

// React component to create a card
function AnalyicsCard({title, value}: AnalyticsCardProps){
	return (
		<div className="card h-100 shadow-sm">
    		<div className="card-body">
        		<h2 className="card-title fs-6 fw-normal text-secondary mb-2">
            		{title}
        		</h2>
        		<p className="card-text fs-4 fw-bold mb-0">
            		{value}
        		</p>
    		</div>
		</div>
	)
}

export default AnalyicsCard;