import http from "node:http";

const req = http.get("http://127.0.0.1:3000/api/health", (res) => {
    process.exit(res.statusCode >= 200 && res.statusCode < 300 ? 0 : 1);
});

req.on("error", () => {
    process.exit(1);
});

req.setTimeout(3000, () => {
    req.destroy();
    process.exit(1);
});
