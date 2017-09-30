/*
*  @Author: Richard
*  @File Descriptions: 
*  @Date:   2017-09-29 20:11:00
* 
*  @Last Modified time: 2017-09-30 13:04:13
*/

$(function(){
			window.CHAT = (function(){
				var _chat = {
					curUsersCount: 0,
					cur_user: {
						userId: '',
						userName: ''
					},
					socket: null,
					chatDom: $('.chatroom')[0],
					init: function(username){
						// 初始化用户信息
						this.cur_user.userName = username;
						this.cur_user.userId = calcUserId();
						// 展示当前用户
						$(this.chatDom).find('.cur-user').html(this.cur_user.userName);

						// 建立socket连接
						this.socket = io('ws://10.66.2.2:9000');

						// 发送用户登录注册事件
						this.socket.emit('login', {
							userName: this.cur_user.userName,
							userId: this.cur_user.userId
						})

						// 监听在线总人数
						this.socket.on('changeUsersCount', function(count){
							$(this.chatDom).find('.cur-count').html(count);
						}.bind(this));

						// 监听用户加入聊天室
						this.socket.on('userIn', function(user){
							this.userIn(user);
						}.bind(this));

						// 监听用户离开聊天室
						this.socket.on('userOut', function(user){
							this.userOut(user);
						}.bind(this));

						// 监听新的消息到来
						this.socket.on('newMsg', function(msg, user){
							this.newMsgCome(msg, user);
						}.bind(this))
					},
					userIn: function(user){
						// 添加userIn消息
						$(this.chatDom).find('.content')
								.append('<p class="enter-tip">\
													<span><strong>' + user.userName + '</strong> 加入了聊天室</span>\
												</p>');
						// 聊天屏幕滚动到最底部
						this.scrollToBottom();
					},
					userOut: function(user){
						// 添加userOut消息
						$(this.chatDom).find('.content')
								.append('<p class="leave-tip">\
													<span><strong>' + user.userName + '</strong> 离开了聊天室</span>\
												</p>');
						// 聊天屏幕滚动到最底部
						this.scrollToBottom();
					},
					newMsgCome: function(msg, user){
						// 创建消息dom
						$(this.chatDom).find('.content')
								.append('<section class="other-message">\
													<h5><strong>' + user.userName + '</strong></h5>\
													<span>' + msg +'</span>\
												</section>');
						// 聊天屏幕滚动到最底部
						this.scrollToBottom();
					},
					sendMsg: function(msg){
						// 在当前聊天室显示自己发送的消息
						$(this.chatDom).find('.content')
								.append('<section class="self-message">\
													<h5><strong>:我</strong></h5>\
													<span>' + msg +'</span>\
												</section>');
						// 聊天屏幕滚动到最底部
						this.scrollToBottom();
						// 发送消息
						this.socket.emit('chatMsg', msg);
					},
					scrollToBottom: function(){
						$(this.chatDom).find('.screen').animate({
								scrollTop: $('.content').height()
						}, 800);
					}
				}

				function calcUserId(){
						var time = (new Date()).getTime();
						return (Math.round(Math.random()*1000).toString()+time);
				}

				return _chat;
			})();

			// 用户登录
			$('.login-form button').click(function(){
				var userName = $('.login-form .form-control').val().replace(/\s/g, '');
				if(userName == ''){
					$('.login-form .tips').css({display: 'block'});
					return;
				}

				// 防止脚本用户名
				if(userName.length > 6){
					$('.login-form .form-control').val('')
					return ;
				}
				// 隐藏登录dom，展示聊天dom
				$('.loginBox').css({display: 'none'});
				$('.chatroom').css({display: 'block'});

				// 初始化聊天室
				CHAT.init(userName);
			})

			// input聚焦时，隐藏tips
			$('.login-form .form-control').focus(function(){
				$('.login-form .tips').css({display: 'none'});
			})

			// 点击发送消息按钮
			$('.input-area button').click(function(){
				var msg = $('.input-area .form-control').val().replace(/\s/g, '');
				if(msg == ''){
					$('.input-area .form-control').val('');
					return false;
				}
				// 清楚输入框内容
				$('.input-area .form-control').val('');
				// 发送消息
				CHAT.sendMsg(msg);
			})

		})