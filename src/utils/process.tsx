let baseUrl: string;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    baseUrl = 'http://120.232.132.10:37109';
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = 'http://120.232.132.10:37109';
}

export { baseUrl };