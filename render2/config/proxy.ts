export default {
    dev:{
        '/api/': {
            target: 'https://preview.pro.ant.design',
            changeOrigin: true,
            pathRewrite: { '^': '' },
        },
    },
    test:{
        '/api/': {
            target: 'https://preview.pro.ant.design',
            changeOrigin: true,
            pathRewrite: { '^': '' },
        },
    },
    pre:{

    }
}
