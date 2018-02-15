$(document).ready(function() {
    $('#crossdomain_login').attr('href', protocol + '://' + mainhost + sitepath + 'utils/crossdomain.php');
    $('#wechat_login').attr('onclick', 'alert("抱歉，该渠道暂未开通！")');
});

/**
 * 拉取基础信息
 * @return string
 */
function getBaseInfo() {
    $.ajax({
        url: protocol + '://' + mainhost + sitepath + 'api.php',
        method: 'get',
        data: {
            'c': 'Index',
            'a': 'operate',
            'mod': 'baseinfo',
            'type': 'read'
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (r) {
            if (jQuery.isEmptyObject(r)) {
                alert('服务端成功接受了请求，但没有返回任何数据。可能是由于您没有创建任何项目！');
                return false;
            }
            $.each(r, function(key, value) {
                $('title').html(value.myalbum_name);
                $('.title').html(value.myalbum_nickname);
                $('#mname').html(value.myalbum_name);
                $('#msaying').html(value.myalbum_saying);
                $('#sicon').attr('href', value.myalbum_logo);
                $('#bicon').attr('href', value.myalbum_logo);
                $('#header_logo').attr('src', value.myalbum_logo);
                $('#copyinfo').html(value.myalbum_copyright);
                $('#author_name').html(value.myalbum_author);
            });
        },
        error: function (e) {
            alert('网络请求异常，请检查是否可以正确连接主服务端接口。');
        }
    });
}

/**
 * 拉取相册列表
 * @return string
 */
function getCoverList() {
    $.ajax({
        url: protocol + '://' + mainhost + sitepath + 'api.php',
        method: 'get',
        data: {
            'c': 'Index',
            'a': 'operate',
            'mod': 'coverinfo',
            'type': 'read'
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (r) {
            if (jQuery.isEmptyObject(r)) {
                alert('服务端成功接受了请求，但没有返回任何数据。可能是由于您没有创建任何项目！');
                return false;
            }
            $.each(r, function(key, value) {
                if (value.open == '1') {
                    var record = '<article class="style' + value.style +  '">\
                    <span class="image"><img src="' + value.coveraddr + '" alt="" /></span>\
                    <a href="' + protocol + '://' + mainhost + sitepath + 'index.php?c=sub&cid=' + value.cid + '">\
                    <h2>' + value.name + '</h2><div class="content"><p>' + value.inst + '</p></div></a></article>';
                    $('.tiles').append(record);
                }
            });
        },
        error: function (e) {
            alert('网络请求异常，请检查是否可以正确连接主服务端接口。');
        }
    });
}

/**
 * 跨域登录请求
 * @return mixed
 */
function doLoginRequest() {
    var username = $('#user').val();
    var password = $('#pswd').val();
    if (username == '') {
        alert('抱歉，用户名不能为空！');
    }
    else if (password == '') {
        alert('抱歉，密码不能为空！');
    }
    else {
        $.ajax({
            url: protocol + '://' + mainhost + sitepath + 'api.php',
            method: 'get',
            data: {
                'c': 'Index',
                'a': 'login',
                'user': username,
                'pswd': MD5(password)
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function (r) {
                if (jQuery.isEmptyObject(r)) {
                    alert('服务端成功接受了请求，但没有返回任何数据。可能是由于您没有创建任何项目！');
                }
                else if (r.code === 200) {
                    if (!confirm('登录成功！是否立即进入后台管理面板？')) {
                        history.go(-1);
                    }
                    else {
                        location.href = protocol + '://' + mainhost + sitepath + 'admin.php';
                    }
                }
                else if (r.code === 403) {
                    alert('登录失败：' + r.message);
                }
                else {
                    alert('登录失败：服务端无法验证您的请求，可能是您的请求过于频繁，请稍候再试一次。');
                }
            },
            error: function (e) {
                alert('网络请求异常，请检查是否可以正确连接主服务端接口。');
            }
        });
    }
    return false;
}