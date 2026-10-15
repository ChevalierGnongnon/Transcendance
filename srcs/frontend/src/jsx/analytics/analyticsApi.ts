export const getAnalytics = async (from: string, to: string) => {
    const params = new URLSearchParams({
        from,
        to,
    });

    const response = await fetch(
        `/api/analytics?${params.toString()}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        throw new Error("Failed to fetch analytics");
    }

    return response.json();
};