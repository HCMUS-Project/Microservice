/* eslint-disable */

export const protobufPackage = 'myservice';

export interface User {
    Id: string;
    email: string;
    password: string;
    isDeleted: boolean;
    isActive: boolean;
    userId: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    V: number;
}

export interface ShortToken {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date | undefined;
    refreshTokenExpiresAt: Date | undefined;
}

export interface FullyToken {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredAt: Date | undefined;
    refreshTokenExpiredAt: Date | undefined;
    userId: string;
    deviceId: string;
    id: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    V: number;
}

export interface SignInRequest {
    email: string;
    password: string;
    device: string;
}

export interface SignInResponse {
    statusCode: number;
    message: string;
    user: User | undefined;
    shortToken: ShortToken | undefined;
    fullyToken: FullyToken | undefined;
}

export interface SignUpRequest {
    email: string;
    password: string;
    device: string;
}

export interface SignUpResponse {
    statusCode: number;
    message: string;
    user: User | undefined;
    shortToken: ShortToken | undefined;
    fullyToken: FullyToken | undefined;
}

export interface SignOutRequest {
    token: string;
}

export interface SignOutResponse {
    statusCode: number;
    message: string;
    token: FullyToken | undefined;
}

export interface RefreshTokensRequest {
    refreshToken: string;
}

export interface RefreshTokensResponse {
    statusCode: number;
    message: string;
    shortToken: ShortToken | undefined;
}

export interface AuthService {
    signIn(request: SignInRequest): Promise<SignInResponse>;
    signUp(request: SignUpRequest): Promise<SignUpResponse>;
    signOut(request: SignOutRequest): Promise<SignOutResponse>;
    refreshTokens(request: RefreshTokensRequest): Promise<RefreshTokensResponse>;
}
