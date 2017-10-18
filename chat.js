/**
 * Created by lu_hb on 2017/10/17.
 */
layui.define(['layer', 'laytpl'],function (exports) {
    var getHistoryChatLog = function (data) {
        var match = location.href.match(/^(http:\/\/.*?\/.*?)\//);
        var ctx = match[1];
        var result = parseURL(),
            token = result.params.token,
            params = JSON.parse(decodeURIComponent(base64.decode(token))),

            lastReadDate = new Date(),
            receiver = params.userCode;
        lastReadDate.setDate(lastReadDate.getDate() + 1);
        var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

        var url = ctx + '/service/webim/historyMessage/' + receiver + '/' + data.id;
        console.log(url);
        $.ajax({
            url: url,
            async: false,
            dataType: 'json',
            data: {pageNo: 1, lastReadDate: dateStr},
            success: function (res) {
                var messageList = res.data.objList,
                    message;

                for (var i = 0, length = messageList.length; i < length; i++) {
                    message = messageList[i];
                    console.log(message);
                    if(message.msgType === 'S'){
                        getMessage({
                            type: 'friend',
                            system: true,
                            reverse: true,
                            username: message.senderName,
                            id: data.id,
                            content: JSON.parse(message.content).msg,
                            timestamp: message.sendTime,
                            avatar: ctx + USER_AVATAR
                        }, false)
                    }
                    else if (message.sender == data.id) {
                        getMessage({
                            type: 'friend',
                            system: false,
                            reverse: true,
                            username: message.senderName,
                            id: data.id,
                            content: JSON.parse(message.content).msg,
                            timestamp: message.sendTime,
                            avatar: ctx + USER_AVATAR
                        }, false)
                    } else {
                        showMineMessage({content: JSON.parse(message.content).msg, timestamp: message.sendTime});
                    }
                }

                $(".layim-chat-username").attr('userCode', data.id);
                $(".layim-chat-username").data('pageNo' + data.id, 2);
                chatListMore();
            }
        });
    }
//判断是否需要去后台查询数据
    var judgeFlag = function (currentName) {
        console.log('currentName is ' + currentName);
        var flag = true;
        var chatPanel = $('.layim-chat-other')
        var panelList = $('.layui-unselect.layim-chat-list li');
        var name;
        for (var j = 0, length = panelList.length; j < length; j++) {
            name = panelList[j].innerText;
            if (name.indexOf(currentName) != -1) {
                flag = false
            }
        }
        for (var i = 0, length = chatPanel.length; i < length; i++) {
            if (chatPanel[i].innerText == currentName) {
                flag = false
            }
        }
        return flag;
    }
})