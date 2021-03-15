$(function () {

    // 设置开发环境请求地址
    let baseURL = 'http://api-breakingnews-web.itheima.net';

    //  JQ封装的 ajax请求超级过滤器 用于请求前后的参数校验与设置 
    $.ajaxPrefilter(function (option) {

        // 1.补全请求地址
        option.url = baseURL + option.url;

        // 2.给 含有 /my/ 的请求地址添加密钥
        if (option.url.indexOf('/my/') != -1) {
            // 配置密钥
            option.headers = {
                Authorization: localStorage.getItem('token') || ''
            }

            // 登录拦截
            option.complete = function (res) {

                let obj = res.responseJSON;
                // 
                if (obj.status == 1 && obj.message === '身份认证失败！') {
                    // 销毁本地储存密钥
                    localStorage.removeItem('token');
                    // 跳转到登录页面
                    location.href='/login.html';
                }
            }

        }
    })


})