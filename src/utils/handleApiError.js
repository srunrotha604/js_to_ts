import { toast } from "react-toastify";

export const handleApiError = (error, actionName = "process") => {
    const status = error?.response?.status;

    const statusMeaning = {
        400: "Some information is incorrect.",
        401: "Your session has expired. Please log in again.",
        403: "You don’t have permission to perform this action.",
        404: "We couldn’t find the record you’re looking for.",
        409: "This record already exists or conflicts with existing data.",
        500: "Something went wrong on the server. Please try again later.",
        503: "The service is temporarily unavailable. Please try again shortly.",
    };

    const message = statusMeaning[status] || "An unexpected error occurred.";
    toast.error(`${actionName}. ${message}`);
};
