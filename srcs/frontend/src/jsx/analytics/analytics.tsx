import { useEffect, useState } from "react";
import { getAnalytics } from "./analyticsApi";
import type { AnalyticsData } from "./analytics.types";

function Analytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadAnalytics() {
            try {
                setLoading(true);
                setError(null);

                const data = await getAnalytics(
                    "2026-09-01",
                    "2026-09-14"
                );

                setAnalytics(data);
            } catch (error) {
                console.error(error);
                setError("Could not load analytics.");
            } finally {
                setLoading(false);
            }
        }

        loadAnalytics();
    }, []);

    if (loading) {
        return <p>Loading analytics...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Analytics</h1>

            <pre>
                {JSON.stringify(analytics, null, 2)}
            </pre>
        </div>
    );
}

export default Analytics;