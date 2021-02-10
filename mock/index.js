import Mock from 'mockjs';

import user from './user';

const mocks = [
    ...user
]
export function mockXHR() {

    function param2Obj(url) {
        const search = url.split('?')[1]
        if (!search) {
            return {}
        }
        return JSON.parse(
            '{"' +
            decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
                .replace(/\+/g, ' ') +
            '"}'
        )
    }

    function XHR2ExpressReqWrap(respond) {
        return function(options) {
            let result = null
            if (respond instanceof Function) {
                const { body, type, url } = options
                // https://expressjs.com/en/4x/api.html#req
                result = respond({
                    method: type,
                    body: JSON.parse(body),
                    query: param2Obj(url)
                })
            } else {
                result = respond
            }
            return Mock.mock(result)
        }
    }

    for (const i of mocks) {
        Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response));
    }
}

