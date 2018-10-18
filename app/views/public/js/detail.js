$(function () {
    $('.comment').click(function (e) {
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');
        //点击头像评论时动态添加一些数据在表单里面
        //根据id判断是否已经存在隐藏域
         if ($('#toId').length > 0) {
              $('#toId').val(toId) //如果存在重新赋值
            }
            else {
              $('<input>').attr({
                type: 'hidden',
                id: 'toId',
                name: 'comment[tid]',
                value: toId
              }).appendTo('#commentForm')
            }

            if ($('#commentId').length > 0) {
              $('#commentId').val(commentId)
            }
            else {
              $('<input>').attr({
                type: 'hidden',
                id: 'commentId',
                name: 'comment[cid]',
                value: commentId
              }).appendTo('#commentForm')
            }
          })
})


 