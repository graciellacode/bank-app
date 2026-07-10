import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import api from './api';

export async function registerBiometric(nickname?: string) {
    const optionsRes = await api.post('/webauthn/register/options');
    const attResp = await startRegistration({ optionsJSON: optionsRes.data });
    const verifyRes = await api.post('/webauthn/register/verify', {
        response: attResp,
        nickname,
    });
    return verifyRes.data;
}

export async function loginWithBiometric(email: string) {
    const optionsRes = await api.post('/webauthn/login/options', { email });
    const authResp = await startAuthentication({ optionsJSON: optionsRes.data });
    const verifyRes = await api.post('/webauthn/login/verify', {
        email,
        response: authResp,
    });
    return verifyRes.data;
}