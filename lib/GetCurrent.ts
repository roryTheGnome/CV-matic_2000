import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/types/JWTPayload";

export function getCurrentUserId(token: string): number | null {
    if (!token) return null;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.sub;
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}