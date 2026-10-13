import { query } from "express-validator";

export const analyticsValidator = [
    query("from")
        .isISO8601()
        .withMessage("INVALID_FROM_DATE"),

    query("to")
        .isISO8601()
        .withMessage("INVALID_TO_DATE")
        .custom((to, { req }) => {
            const from = req.query?.from;

            if (typeof from !== "string") {
                return true;
            }

            const fromDate = new Date(from);
            const toDate = new Date(to);

            if (fromDate > toDate) {
                throw new Error("INVALID_DATE_RANGE");
            }

            return true;
        }),
];