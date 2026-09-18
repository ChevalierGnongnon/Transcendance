import type { AiTokenUsage } from "./analytics.types";

import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface AiTokenUsagePieChartProps {
    data: AiTokenUsage;
}

function AiTokenUsagePieChart({
    data,
}: AiTokenUsagePieChartProps) {

	// Change data in frontend vor Visualisation and Rechart purposes
	const chartData = [
		{
			name: "Input Tokens", 
			value: data.inputTokens,
		},
		{
			name: "Output Tokens", 
			value: data.outputTokens,
		},
		{
			name: "Thinking Tokens", 
			value: data.outputTokens,
		}
	];

	return (
		<div>
			<ResponsiveContainer
				width="100%"
				height={400}	
			>
				<PieChart>
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						outerRadius={140}
					>
						<Cell fill="#3498db" />
                        <Cell fill="#9b59b6" />
                        <Cell fill="#f39c12" />
					</Pie>
					<Tooltip/>
					<Legend/>
				</PieChart>	
			</ResponsiveContainer>
		
		</div>
	);
}

export default AiTokenUsagePieChart;