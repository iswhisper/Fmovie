// 处理删除电影数据的逻辑
$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/admin/movie/list?id=' + id,
        })
        .done(function (results) {
            if (results.success === 1) {
                if (tr.length > 0) {
                    tr.remove(); //删除成功，移出当前列
                }
                window.location.reload();  //删除成功，页面刷新
            }
        });
    });
     $('.userdel').click(function (e) {
        alert("确定删除？");
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);
        console.log(id+"-===");
        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/admin/user/list?id=' + id,
        })
        .done(function (results) {
            if (results.success === 1) {
                if (tr.length > 0) {
                    tr.remove();
                }
                window.location.reload();  //删除成功，页面刷新
            }
        });
    });

   $('.catdel').click(function(e) {
         var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/admin/categroy/list?id=' + id,
        })
        .done(function (results) {
            if (results.success === 1) {
                if (tr.length > 0) {
                    tr.remove(); //删除成功，移出当前列
                }
                window.location.reload();  //删除成功，页面刷新
            }
        });
    })
   $("#douban").blur(function () {
       /* body... */
       var douban=$(this)
       var id=douban.val()
       if(id){
           $.ajax({
            url:"http://api.douban.com/v2/movie/subject/"+id, //接口地址
            cache:true,
            type:"get",//请求方式
            dataType:"jsonp",
            crossDomain:true, //是否跨域
            jsonp:"callback",//回传参数的名字
            success: function(data) {
              $('#inputTitle').val(data.title)
              $('#inputDoctor').val(data.directors[0].name)
              $('#inputCountry').val(data.countries[0])
              $('#inputPoster').val(data.images.large)
              $('#inputYear').val(data.year)
              $('#inputSummary').val(data.summary)
            }
           })
       }
       })
});