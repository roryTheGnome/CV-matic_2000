import { PUBLIC_ROUTES } from "@/config/routes"
import { TokenPayload } from "@/types/auth"

import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

export const protectAdmin = async (
  request: NextRequest,
  accessToken: string,
) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const { payload }: { payload: TokenPayload } = await jwtVerify(
      accessToken,
      secret,
    )

    if (payload.role === "Emploee") {
      return NextResponse.redirect(new URL("/users", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
  }
}
