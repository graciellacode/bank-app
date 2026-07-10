import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach access token ke setiap request
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Supaya tidak banyak request refresh dipanggil bersamaan (race condition)
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Kalau error 401 DAN belum pernah dicoba retry sebelumnya
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Kalau lagi ada proses refresh jalan, tunggu hasilnya dulu
                return new Promise((resolve) => {
                    refreshSubscribers.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    { refreshToken },
                );

                const { accessToken, refreshToken: newRefreshToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                isRefreshing = false;
                onRefreshed(accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                // Refresh token juga gagal/expired, user harus login ulang
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;