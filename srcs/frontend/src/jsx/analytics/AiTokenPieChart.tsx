import type { AiTokenUsage } from "./analytics.types";

import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

import { useTransition } from "react";
import { useTranslation } from "react-i18next";

interface AiTokenUsagePieChartProps {
    data: AiTokenUsage;
	totalTokens: number;
}

function AiTokenUsagePieChart({
    data,
	totalTokens
}: AiTokenUsagePieChartProps) {
	const { t } = useTranslation();
	// Change data in frontend vor Visualisation and Rechart purposes
	const chartData = [
		{
			name:  t("analytics.charts.input-tokens"), 
			value: data.inputTokens,
		},
		{
			name: t("analytics.charts.output-tokens"), 
			value: data.outputTokens,
		},
		{
			name: t("analytics.charts.thinking-tokens"), 
			value: data.thinkingTokens,
		}
	];

	return (
		<div>
			<p className="analytics-total">
        		{t("analytics.charts.total-tokens")}:{" "}
                {totalTokens.toLocaleString()}
    		</p>
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