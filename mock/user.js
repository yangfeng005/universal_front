const tokens = {
    admin: {
        token: 'admin-token'
    },
    editor: {
        token: 'editor-token'
    }
}

const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

export default [
    // user login
    {
        url: '/user/login',
        type: 'post',
        response: config => {
            const { username } = config.body
            const token = tokens[username]

            // mock error
            if (!token) {
                return {
                    code: 60204,
                    message: '用户名或密码不正确'
                }
            }

            return {
                code: 0,
                data: token
            }
        }
    },

    // get user info
    {
        url: '/user/info\.*',
        type: 'get',
        response: config => {
            const { token } = config.query
            const info = users[token]

            // mock error
            if (!info) {
                return {
                    code: 50008,
                    message: 'Login failed, unable to get user details.'
                }
            }

            return {
                code: 0,
                data: info
            }
        }
    },

    // user logout
    {
        url: '/user/logout',
        type: 'post',
        response: _ => {
            return {
                code: 0,
                data: '退出成功'
            }
        }
    },

    // user update one
    {
        url: '/user/update/one',
        type: 'post',
        response: _ => {
            return {
                "code": 0,
                "data": true,
                "message": "string"
            }
        }
    },

    // user page list
    {
        url: '/user/page/list\.*',
        type: 'get',
        response: _ => {
            return {
                "code": 0,
                "data": [
                  {
                    "birthDate": "2020-02-26T07:24:52.799Z",
                    "comment": "string",
                    "deleteFlag": true,
                    "email": "string",
                    "enable": true,
                    "fullName": "string",
                    "gender": 0,
                    "headImgUrl": "string",
                    "idCardNo": "string",
                    "logs": [
                      {}
                    ],
                    "nextLoginChangePassword": true,
                    "nickName": "string",
                    "password": "string",
                    "phone": "string",
                    "remark": "string",
                    "sort": 0,
                    "super": true,
                    "username": "string"
                  }, {
                    "birthDate": "2020-02-26T07:24:52.799Z",
                    "comment": "string",
                    "deleteFlag": true,
                    "email": "string",
                    "enable": true,
                    "fullName": "string",
                    "gender": 0,
                    "headImgUrl": "string",
                    "idCardNo": "string",
                    "logs": [
                      {}
                    ],
                    "nextLoginChangePassword": true,
                    "nickName": "string",
                    "password": "string",
                    "phone": "string",
                    "remark": "string",
                    "sort": 0,
                    "super": true,
                    "username": "string"
                  }
                ],
                "message": "string"
              }
        }
    },

    // app page list
    {
        url: '/app/page/list\.*',
        type: 'get',
        response: _ => {
            return {
                "code": 0,
                "data": [
                  {
                    "appId": "appId",
                    "appName": "appName",
                    "deleteFlag": true,
                    "enable": true,
                    "logs": [
                      {}
                    ],
                    "remark": "string",
                    "sort": 0
                  }
                ],
                "message": "string"
              }
        }
    },

    // app total
    {
        url: '/app/total',
        type: 'get',
        response: _ => {
            return {
                "code": 0,
                "data": 1,
                "message": "string"
            }
        }
    },

    // role page list
    {
        url: '/role/page/list\.*',
        type: 'get',
        response: _ => {
            return {
                "code": 0,
                "data": [
                  {
                    "deleteFlag": true,
                    "enable": true,
                    "logs": [
                      {}
                    ],
                    "navs": [
                      {
                        "apis": [
                          {
                            "apiName": "string",
                            "category": "string",
                            "deleteFlag": true,
                            "enable": true,
                            "logs": [
                              {}
                            ],
                            "remark": "string",
                            "sort": 0,
                            "uri": "string"
                          }
                        ],
                        "deleteFlag": true,
                        "enable": true,
                        "logs": [
                          {}
                        ],
                        "remark": "string",
                        "sort": 0,
                        "uri": "string"
                      }
                    ],
                    "remark": "string",
                    "sort": 0
                  }
                ],
                "message": "string"
              }
        }
    }
]
