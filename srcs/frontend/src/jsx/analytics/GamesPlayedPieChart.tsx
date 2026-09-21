
import { GamesSummary } from "./analytics.types";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface GamesPlayedPieChartProps {
	data: GamesSummary;
	totalGames: number;
}

function GamesPlayedPieChart({data, totalGames,}: GamesPlayedPieChartProps){
	const chartData = [
		{
			name: "Won",
			value: data.won,
		},
		{
			name: "Lost",
			value: data.lost,
		},
	];

	return(
		<div>
			<p className="analytics-total">
        		Total Games: {totalGames}
    		</p>
			<ResponsiveContainer
				width= "100%"
				height={400}
			>
				<PieChart>
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						outerRadius={140}
					>
						<Cell fill="#169b4d" />
                        <Cell fill="#c13323" />
					</Pie>
					<Tooltip/>
					<Legend/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}

export default GamesPlayedPieChart;
