import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/config/routes'
import { jwtVerify, JWTVerifyResult, ResolvedKey } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { TextEncoder as NodeTextEncoder } from 'util'
import { protectAdmin } from '../protectAdmin'

global.TextEncoder = NodeTextEncoder as typeof global.TextEncoder

jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextRequest: class {
    constructor(public url: string) {}
  },
  NextResponse: {
    redirect: jest.fn().mockImplementation((url: URL | string) => {
      const finalUrl = typeof url === 'string' ? new URL(url) : url
      return {
        href: finalUrl.href,
        status: 307,
      }
    }),
  },
}))

describe('protectAdmin', () => {
  const mockBase = 'http://localhost:3000'
  const mockUrl = `${mockBase}${PRIVATE_ROUTES.USERS}`
  const mockRequest = new NextRequest(mockUrl) as unknown as NextRequest
  const mockAccessToken = 'mock-token'
  const jwtSecret = 'test-secret'

  const mockedJwtVerify = jwtVerify as jest.MockedFunction<typeof jwtVerify>
  const mockedRedirect = NextResponse.redirect as jest.MockedFunction<
    typeof NextResponse.redirect
  >

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = jwtSecret
  })

  it('should return null when the user has an Admin role', async () => {
    const mockResult: JWTVerifyResult & ResolvedKey = {
      payload: { role: 'Admin' },
      protectedHeader: { alg: 'HS256' },
      key: new Uint8Array(),
    }

    mockedJwtVerify.mockResolvedValue(mockResult)

    const result = await protectAdmin(mockRequest, mockAccessToken)

    expect(result).toBeNull()
    expect(mockedJwtVerify).toHaveBeenCalledWith(
      mockAccessToken,
      new TextEncoder().encode(jwtSecret),
    )
  })

  it('should redirect to users route when the user is not an Admin', async () => {
    const mockResult: JWTVerifyResult & ResolvedKey = {
      payload: { role: 'User' },
      protectedHeader: { alg: 'HS256' },
      key: new Uint8Array(),
    }

    mockedJwtVerify.mockResolvedValue(mockResult)

    await protectAdmin(mockRequest, mockAccessToken)

    const expectedUrl = new URL(PRIVATE_ROUTES.USERS, mockBase).toString()

    expect(mockedRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expectedUrl,
      }),
    )
  })

  it('should redirect to login route when jwt verification fails', async () => {
    mockedJwtVerify.mockRejectedValue(new Error('Invalid token'))

    await protectAdmin(mockRequest, mockAccessToken)

    const expectedUrl = new URL(PUBLIC_ROUTES.LOGIN, mockBase).toString()

    expect(mockedRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expectedUrl,
      }),
    )
  })

  it('should redirect to login route when JWT_SECRET is missing', async () => {
    delete process.env.JWT_SECRET

    await protectAdmin(mockRequest, mockAccessToken)

    const expectedUrl = new URL(PUBLIC_ROUTES.LOGIN, mockBase).toString()

    expect(mockedRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expectedUrl,
      }),
    )
  })
})
