import type { AiUsageOverTime } from "./analytics.types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AiUsageChartsProps{
	data: AiUsageOverTime[];
}

function AiUsageChart({data}: AiUsageChartsProps){
	return (
        <div>
            {/* <h2>AI Usage Over Time</h2> */}
			<ResponsiveContainer
				width= "100%"
				height={400}
			>
            <LineChart
                width={800}
                height={400}
                data={data}
            >
                <CartesianGrid />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="totalTokens"
                />
            </LineChart>
			</ResponsiveContainer>
        </div>
    );
}

export default AiUsageChart;