$(function () {
    let form = layui.form;
    let layer = layui.layer;

    // 0.初始化文章编辑内容
    // 获取绑定在 a标签 href 上的ID值

    // alert(Id);

    function initForm(params) {
        let Id = location.search.split('=')[1];

        $.ajax({
            type: 'get',
            url: '/my/article/' + Id,
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }

                form.val('form-pub', res.data)
                tinyMCE.activeEditor.setContent(res.data.content);

                if (!res.data.cover_img) {
                    return layer.msg('用户未上传图片')
                }
                let baseURL = 'http://api-breakingnews-web.itheima.net';
                let newImgURL = baseURL + res.data.cover_img;

                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域

            }
        })

    }

    //1. 渲染 筛选区 文章分类 
    initCate()
    // 1.1封装 渲染 筛选区 文章分类
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);

                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 4.2调用模板引擎 temlpate()
                let htmlStr = template('tpl-cate', { list: res.data })

                //4.3 渲染进页面结构中
                $('[name=cate_id]').html(htmlStr)

                // 进一步渲染 特殊表单结构 单选框 复选框 下拉列表等需要使用layui.form.renden()方法再次渲染页面
                form.render();
                initForm();
            }
        })
    }


    // 2.初始化富文本编辑器
    initEditor()


    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)


    // 4.点击选择封面触发文件上传
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    //5.当文件上传改变时 裁剪区域路径修改
    $('#coverFile').on('change', function (e) {

        var file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return layer.msg('您可以选择一张图片,作为文章封面')
        }

        var newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 6.获取状态参数
    let state = '已发布'

    // $('#btnSave1').on('click', function () {
    //     state = '已发布'
    // })

    $('#btnSave2').on('click', function () {
        state = '草稿'
    })


    // 7.表单提交

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        // 7.1获取表单页面已有参数
        let fd = new FormData(this)

        // console.log(...fd);
        //7.2添加文章状态 参数
        fd.append('state', state);


        // 7.3获取到的图片转成文件格式
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)

                // console.log(...fd);
                publishArticle(fd)

            });
    })


    // 8.发表文章 发送 ajax请求函数封装
    function publishArticle(fd) {

        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }

                layer.msg('恭喜你,修改文章成功!')

                setTimeout(() => {
                    window.parent.document.querySelector('#art-list').click()

                }, 1000);
            }
        })
    }


})