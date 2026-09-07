import { fetchData } from "../services/$service";

export const fetchProject = async () => {
    try {
        const res = await fetchData("/operation-customer/product", {}, "GET");
        return res;
    } catch (error) {
        console.error("Error fetching project:", error);
    }
};