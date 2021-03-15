$(function () {


    let form = layui.form;
    //1.自定义昵称规则校验
    form.verify({
        nickname: function (value) {


            if (value.length < 1 || value.length > 6) {
                return '用户昵称长度必须为1-6位'
            }
        }
    })


    // 2.表单用户信息渲染
    
    initUserInfo();
    let layer = layui.layer;
    // 封装用户信息渲染
    function initUserInfo() {
        $.ajax({
           method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);

                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // console.log(555);
                form.val('formUserInfo', res.data)
            }
        })
    }

   

    // $()
    $('#btnReset').on('click',function (e) {
       
        e.preventDefault();

        initUserInfo();
    })

    $('#btnSubmit').on('click',function (e) {
        e.preventDefault();

        $.ajax({
            type:'post',
            url:'/my/userinfo',
            data:$('.layui-form').serialize(),
            success: function (res) {
                console.log(res);

                window.parent.getuserIfo();
                console.log();
        }
         })
    })
})