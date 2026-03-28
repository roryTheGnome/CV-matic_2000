import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/config/routes"
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

    if (payload.role !== "Admin") {
      return NextResponse.redirect(new URL(PRIVATE_ROUTES.USERS, request.url))
    }

    return null
  } catch (error) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url))
  }
}
