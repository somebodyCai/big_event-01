$(function () {

    // 设置开发环境请求地址
    let baseURL = 'http://api-breakingnews-web.itheima.net';

    //  JQ封装的 ajax请求超级过滤器 用于请求前后的参数校验与设置 
    $.ajaxPrefilter(function (option) {

        // 补全请求地址
        option.url = baseURL + option.url;
    })


})