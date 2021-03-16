$(function () {


    initArtHtml()
    // 1.模板引擎生成页面结构
    let layer = layui.layer

    function initArtHtml() {

        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }

                let htmlStr = template('tem-art-cate', { list: res.data })

                $('tbody').html(htmlStr)
            }
        })
    }


    // 2.点击弹出对话框
    let indexAdd = null;
    $('#btnAdd').on('click', function () {

        indexAdd = layer.open({
            type: 1,
            title: '添加文字类别',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })


    // 3.添加文章分类表单提交功能

    $('body').on('submit', '#form-add', function (e) {

        e.preventDefault();

        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 表单重置 (清空表单内容)
                $('#form-add')[0].reset()
                // 重新渲染文章分类列表
                initArtHtml();
                // 关闭弹出层
                layer.close(indexAdd)

                layer.msg('恭喜你，添加成功')
            }
        })

    })



    // 4.点击编辑按钮  编辑功能
    let indexEdit = null;
    $('tbody').on('click', '.btn-adit', function () {
        // 4.1弹出对话框
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        // 4.2 发送 ajax 渲染表单
        // 获取自定义属性中的Id值
        let Id = $(this).attr('data-id');
        // 导出 layui 的 form 方法
        let form = layui.form;

        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // form 赋值功能 
                form.val('form-edit', res.data)
            }
        })

    })


    // 5.修改文章分类---表单提交功能

    $('body').on('submit', '#form-edit', function (e) {

        e.preventDefault();

        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 表单重置 (清空表单内容)
                $('#form-edit')[0].reset()
                // 重新渲染文章分类列表
                initArtHtml();
                // 关闭弹出层
                layer.close(indexEdit)

                layer.msg('恭喜你，修改成功')

            }
        })
        
    })
    
    
    
    // let form = layui.form;
    // 6.删除文章分类
    
    $('tbody').on('click', '.btn-delete', function () {
        
        let Id = $(this).attr('data-id');
        // 弹出询问框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    
                    layer.msg('恭喜你删除成功');

                    initArtHtml();

                }
            })

            layer.close(index);
        });
    })



})