$(function () {
    // 渲染头像
    getuserIfo()


    // 点击退出登录
    let layer =layui.layer;
    $('#btnlogout').on('click',function(){

        layer.confirm('是否确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            // 移除本地密钥
            localStorage.removeItem('token');
            // 跳转到登陆页面
            location.href='/login.html'
            // 关闭弹出层
            layer.close(index);
          });

    })
})


function getuserIfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        data: {},
        // 请求密钥配置
        // headers: { Authorization: localStorage.getItem('token') },
        success: function (res) {
            console.log(res);
            console.log(1);
            if (res.status != 0) {
                // 弹出获取失败信息
                return layui.layer.msg(res.message, { icon: 5 })
            }
            // 渲染头像
            randerAvatar(res.data)
        }
    })
}


// 封装渲染头像函数

function randerAvatar(user) {

    let name = user.nickname || user.username;

    $('#welcome').html('欢迎' + name)

    if (!user.user_pic) {
        $('.text-avatar').show().html(user.username[0].toUpperCase());
        $('.userifo img').hide();
    }else {
        $('.userifo img').show().attr('src',user.user_pic);
        $('.text-avatar').hide()
    }
}

