import { env } from 'process';

export const jwtConstants = {
    secret: env.SECRET_EXP_TOKEN,
    secret_refresh: env.SECRET_EXP_TOKEN_REFRESH,
};
