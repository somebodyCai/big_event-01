$(function () {


    // 需求1：点击 a 标签跳转登录注册页面
    $('.login_a').on('click', function () {
        // console.log(1);
        $('.login_box').hide();
        $('.reg_box').show();
    })

    $('.reg_a').on('click', function () {
        // console.log(1);

        $('.login_box').show();

        $('.reg_box').hide();
    })


    //需求2：登录密码校验 自定义表单校验

    let form = layui.form;

    form.verify({
        // 限定密码数为6-12位不含空格的字符串
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //确认密码校验
        repwd: function (value) {
            // 获取第一次输入的密码
            let pwd = $('.reg_box input[name="password"]').val();
            // value 为该密码框获取的用户输入确认密码的值
            // 判断二者是否一致
            if (pwd != value) {
                return '两次输入放入密码不一致，请重新输入!'
            }
        }
    })


    // 需求3：点击注册提交 ajax 请求 响应注册是否成功
    // 获取 layui.layer方法 用于弹出层设计
    let layer = layui.layer

    $('.reg_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg_box input[name="username"]').val(),
                password: $('.reg_box input[name="password"]').val(),
            },
            success: function (res) {
                console.log(res);
                // 注册失败提示
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 弹出成功提示
                layer.msg(res.message, { icon: 6 })

                // 页面跳转 跳转到登录页面(触发点击事件)
                $('.reg_a').click();

                // 清空用户输入内容 reset 方法为原生js方法 索引值[0]转换成 DOM对象
                $('.reg_form')[0].reset();


            }
        })
    })



    $('.login_form').on('click', function (e) {

        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $('.login_form').serialize(),
            success: function (res) {
                console.log(res);
                // 登录失败提示
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }

                // 登录成功提示
                layer.msg(res.message, { icon: 6 })

                // 跳转到首页
                location.href='/index.html';

                // 保存登录请求头
                localStorage.setItem('token',res.token);
            }
        })
    })




})