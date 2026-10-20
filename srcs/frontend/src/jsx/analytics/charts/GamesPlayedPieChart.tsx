import { GamesSummary } from "../utils/analytics.types";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useTranslation } from "react-i18next";

interface GamesPlayedPieChartProps {
	data: GamesSummary;
	totalGames: number;
}

function GamesPlayedPieChart({data, totalGames,}: GamesPlayedPieChartProps){
	const { t } = useTranslation();
	const chartData = [
		{
			name: t("analytics.charts.won"),
			value: data.won,
		},
		{
			name: t("analytics.charts.lost"),
			value: data.lost,
		},
		{
			name: t("analytics.charts.drawn"),
			value: data.drawn,
		}
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
						<Cell fill="#b3abab
						"/>
					</Pie>
					<Tooltip/>
					<Legend/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}

export default GamesPlayedPieChart;