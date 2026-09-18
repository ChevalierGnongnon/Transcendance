import '../../scss/analytics.scss';

import { useEffect, useState } from "react";
import { getAnalytics } from "./analyticsApi";
import type { AnalyticsData } from "./analytics.types";
import AnalyticsCard from "./AnalyticsCard";
import LineChartSection from './LineChartSection';
import PieChartSection from "./PieChartSection";



function getDefaultDates() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);

    sevenDaysAgo.setDate(today.getDate() -7);
    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };
    return {
        from: formatDate(sevenDaysAgo),
        to: formatDate(today),
    };
}


function Analytics() {
    const today = new Date().toISOString().split("T")[0];
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const defaultDates = getDefaultDates();
    const [from, setFrom] = useState(defaultDates.from);
    const [to, setTo] = useState(defaultDates.to);
    const [activeFrom, setActiveFrom] = useState(defaultDates.from);
    const [activeTo, setActiveTo] = useState(defaultDates.to);

    useEffect(() => {
        async function loadAnalytics() {
            console.log("Loading analytics:", {
            activeFrom,
            activeTo,
        });
            try {
                setLoading(true);
                setError(null);

                const data = await getAnalytics(
                    activeFrom,
                    activeTo
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
    }, [activeFrom, activeTo]);

    if (loading) {
        return <p>Loading analytics...</p>;
    }

    if (!analytics) {
        return <p>No analytics available.</p>;
    }

    function handleApplyFilter() {
    console.log("Apply clicked");

    if (from > to) {
        console.log("error");
        setError("The start date cannot be after the end date.");
        return;
    }

    console.log("FROM:", from);
    console.log("TO:", to);

    setError(null);
    setActiveFrom(from);
    setActiveTo(to);
}

    function applyPreset(days: number) {
    const todayDate = new Date();

    const fromDate = new Date(todayDate);
    fromDate.setDate(todayDate.getDate() - days);

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const newFrom = formatDate(fromDate);
    const newTo = formatDate(todayDate);

    setFrom(newFrom);
    setTo(newTo);

    setActiveFrom(newFrom);
    setActiveTo(newTo);
    }


    return (
    <div className="analytics">
        <h1>Analytics Dashboard</h1>

        <p className="analytics-subtitle">
            Overview of your activity and AI usage.
        </p>

        <div className="analytics-filters">
            <label>
                <span className="analytics-filters-title">
                    From:
                </span>

                <input
                    type="date"
                    value={from}
                    max={today}
                    onChange={(event) => setFrom(event.target.value)}
                />
            </label>

            <label>
                <span className="analytics-filters-title">
                    To:
                </span>

                <input
                    type="date"
                    value={to}
                    max={today}
                    onChange={(event) => setTo(event.target.value)}
                />
            </label>
            <div className="analytics-presets">
                 <button onClick={() => applyPreset(7)}>
                    7 Days
                </button>
                <button onClick={() => applyPreset(14)}>
                    14 Days
                </button>
                <button onClick={() => applyPreset(30)}>
                    30 Days
                </button>
            </div>

            <button onClick={handleApplyFilter}>
                Apply
            </button>
        </div>

        {error && (
            <p className="analytics-error">
                {error}
            </p>
        )}

        <div className="analytics-cards">
            <AnalyticsCard
                title="Games Played"
                value={analytics.overview.gamesPlayed}
            />

            <AnalyticsCard
                title="Games Won"
                value={analytics.overview.gamesWon}
            />

            <AnalyticsCard
                title="Games Lost"
                value={analytics.overview.gamesLost}
            />

            <AnalyticsCard
                title="Win Rate"
                value={`${analytics.overview.winRate.toFixed(1)}%`}
            />

            <AnalyticsCard
                title="AI Requests"
                value={analytics.overview.aiRequests}
            />

            <AnalyticsCard
                title="Total Tokens"
                value={analytics.overview.totalTokens}
            />
        </div>
        <div className="analytics-chart-grid">

             <LineChartSection
                aiUsageData={analytics.aiUsageOverTime}
                gamesData={analytics.gamesOverTime}
            />

            <PieChartSection
                gamesSummary={analytics.gamesSummary}
                aiTokenUsage={{
                    inputTokens: analytics.overview.inputTokens,
                    outputTokens: analytics.overview.outputTokens,
                    thinkingTokens: analytics.overview.thinkingTokens,
                }}
            />

        </div>
    </div>
    );
}

export default Analytics;