$(function () {

    let form = layui.form;
    // 1.自定义 密码规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能和原密码一样'
            }
        },
        rePwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '确认密码必须和新密码一致'
            }
        }
    })


    // 2.表单提交 修改密码
    $('#form_pwd').on('submit', function (e) {
        e.preventDefault();
        // console.log(999);
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(333);
                layui.layer.msg('恭喜你，修改密码成功')

                $('#form_pwd')[0].reset();
            }
        })
       
    })

})