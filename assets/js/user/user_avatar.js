$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    $('#fileUp').on('click', function () {

        console.log(1);
        $('input').click()
    })


    // 2.点击更改头像
    $('#file').on('change', function (e) {
        // 1.获取用户选择的文件
        let file = e.target.files[0]
        if (file == undefined) {
            return layui.layer.msg('请选择图片')

        }
        // 生成该文件的临时路径
        let imgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 3.点击确定更改头像
    $('#btnUperload').on('click', function () {
        // 将图片转为 base64 格式
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }

                layer.msg('恭喜你头像更改成功');
                // 渲染头像
                window.parent.getuserIfo();
            }
        })
    })
})


