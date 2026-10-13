import type { GamesOverTime } from "./analytics.types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, createHorizontalChart, ResponsiveContainer } from "recharts";

interface GamesOverTimeChartProps {
	data: GamesOverTime[];
}

function GamesOverTimeChart({
	data, }: GamesOverTimeChartProps )
{
	return (
		<div>
			<ResponsiveContainer
				width="100%"
				height={400}
			>
				<BarChart data={data}>
				<CartesianGrid/> 
				
				<XAxis dataKey="date"/>

				<YAxis />
				<Tooltip/>
				<Bar
					dataKey="won"
					stackId="games"
					name="Won"
					fill="#169b4d"
				/>
				<Bar
					dataKey="lost"
					stackId="games"
					name="Lost"
					fill="#c13323"				
				/>

			</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export default GamesOverTimeChart;