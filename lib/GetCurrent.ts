import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/types/JWTPayload";

export function getCurrentUser(token: string): JwtPayload | null {
    if (!token) return null;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded;
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}