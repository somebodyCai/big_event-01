$(function () {

    //3. 定义时间过滤器 art-template 
    template.defaults.imports.dataFormat = function (dtStr) {

        let dt = new Date(dtStr)

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())


        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }


    // 3.1个位数补零函数封装
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    let layer = layui.layer

    // 2.1定义 获取文章列表 请求参数
    let p = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }

    // 1.渲染文章列表表格
    initTable();

    // 2.封装 渲染文章列表表格
    function initTable() {
        // 2.2发送请求
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }

                let htmlStr = template('tpl-table', { list: res.data })
                //2.3 渲染结构
                $('tbody').html(htmlStr)


                renderPage(res.total)
            }
        })
    }


    //4. 渲染 筛选区 文章分类 
    initCate()
    let form = layui.form;
    // 4.1封装 渲染 筛选区 文章分类
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
            }
        })
    }


    //5. 文章筛选功能

    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        // 获取用户选择的文章筛选请求参数

        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();

        // 参数赋值 （请求参数在变量 p 中 ）
        p.cate_id = cate_id;
        p.state = state;

        // 渲染 文章类别 表格页面
        initTable()
    })


    // 6.分页功能
    let laypage = layui.laypage
    function renderPage(total) {
        // alert(total)
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: p.pagesize,
            curr: p.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'refresh'],
            limits: [2, 3, 5, 10],
            // 当参数改变时会自动调用该函数 监听页面变化 重新渲染页面
            jump: function (obj, first) {

                if (!first) {
                    // 当选择不同页面时，为  p.pagenum 初始页面重新赋值 刷新页面
                    p.pagenum = obj.curr;

                    // 当页面条数改变时 重新赋值刷新页面
                    p.pagesize = obj.limit;

                    initTable();
                }
            }
        });

    }


    // 7.删除文章功能

    $('tbody').on('click', '.btn-delete', function () {

        let Id = $(this).attr('data-id');

        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    console.log(res);

                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg('恭喜你，删除成功')
                    if ($('.btn-delete').length == 1 && p.pagenum > 1) {
                        p.pagenum--;
                    }
                    initTable()

                    layer.close(index);


                }
            })

        });



    })


})