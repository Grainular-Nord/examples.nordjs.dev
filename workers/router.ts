type Environment = {
    ASSETS: {
        fetch: (request: Request) => Promise<Response>;
    };
};

const isHnrNavigation = (request: Request) => {
    return request.method === 'GET' && request.headers.get('accept')?.includes('text/html');
};

export default {
    async fetch(request: Request, environment: Environment) {
        const asset = await environment.ASSETS.fetch(request);
        const { pathname } = new URL(request.url);

        if (asset.status !== 404 || !pathname.startsWith('/hnr/') || !isHnrNavigation(request)) {
            return asset;
        }

        return environment.ASSETS.fetch(new Request(new URL('/hnr/index.html', request.url), request));
    },
};
