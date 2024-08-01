import { getAccessToken } from "@/services/auth-token.service";

export const protectedRoutes = [{path:'/i',role:['admin']}]

export function isRole() {
    const token = getAccessToken();
    
    if (!token) {
        // Handle the case where token is undefined or null
        return null;
    }
    
    const parts = token.toString().split('.');
    
    if (parts.length !== 3) {
        // Handle the case where the token does not have the expected structure
        return null;
    }
    
    try {
        const decodedPayload = atob(parts[1]);
        const parsedPayload = JSON.parse(decodedPayload);
        return parsedPayload.role;
    } catch (e) {
        // Handle errors that may occur during decoding or parsing
        console.error('Error decoding or parsing token payload:', e);
        return null;
    }
}
