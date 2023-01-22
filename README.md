# Vue音乐播放器
## 效果图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210701102552859.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzUwOTY5MzYy,size_16,color_FFFFFF,t_70)
## 实现功能
1、样式基本美观
2、响应式布局
3、输入查询，通过api接口获取歌曲基本信息列表
4、双击歌曲，获取歌曲封面及评论，并播放歌曲，封面图开始旋转，播放杆放下
5、点击暂停，停止播放，封面图停止旋转，播放杆抬起

## 主体HTML部分
```html
<div id="wrap">
			<div id="main">
				<div id="nav">
					<img src="img/162303413685758.png">
					<input v-model="musicName" type="text" placeholder="请输入想听的歌曲" @keyup.enter="search()" />
					<img @click="search()" src="img/zoom.png" />
				</div>
				<div id="content">
					<!-- 歌曲清单 -->
					<div id="scrollbar" class="list" data-rsssl=1 onload="loaded()">
						<ul>
							<li @dblclick="playMusic(music.id)" v-for="music in musicArr">
								{{music.name}}--{{music.artists[0].name}}
							</li>
						</ul>
					</div>
					<!-- 播放动画 -->
					<div class="picture" class="player_con">
						<img src="img/disc.png" class="disc autoRotate " :class="{playing: playingTag}" >
						<img src="img/player_bar.png" class="play_bar " :class="{playing: playingTag}">
						<img id="rotate" v-bind:src="cover" class="cover autoRotate" :class="{playing: playingTag}">
					</div>
					<!-- 用户评论 -->
					<div class="comment">
						<dl v-for="music in comments">
							<dt><img v-bind:src="music.user.avatarUrl"></dt>
							<dd>{{music.user.nikename}}</dd>
							<dd>{{music.content}}</dd>
						</dl>
					</div>
				</div>
				<div id="audio">
					<audio controls :src="musicSrc" autoplay="autoplay" @play='toplay' @pause='toPause'>
					</audio>
				</div>
			</div>
		</div>
```

## 动画
```css
/* 动画 */
@keyframes rote {
	from {
		transform: rotateZ(0deg);
	}

	to {
		transform: rotateZ(360deg);
	}
}

/* 旋转的类名 */
.autoRotate {
	animation-name: rote;
	animation-iteration-count: infinite;
	animation-play-state: paused;
	animation-timing-function: linear;
	animation-duration: 5s;
}

/* 是否正在播放 */
.playing {
	animation-play-state: running;
}

.play_bar {
	position: absolute;
	left: 200px;
	top: -10px;
	z-index: 10;
	transform: rotate(-25deg);
	transform-origin: 12px 12px;
	transition: 1s;
}

/* 播放杆 转回去 */
.play_bar.playing {
	transform: rotate(0);
}

/* Vue动画类 */
.list-enter-active,
.list-leave-active {
	transition: all 1s;
}

.list-enter,
.list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}
```

## axios查询获取歌曲信息
```js
search: function() {
			var music = this;
			var err;
			axios.get("https://autumnfish.cn/search?keywords=" + this.musicName).then(function(resp) {
					music.musicArr = resp.data.result.songs;
					console.log(musicArr);
				})
				.catch(function(err) {
					console.log("警告：查询音乐错误");
				})
		},
```
## 获取封面评论
```js
playMusic: function(musicId){
			console.log(musicId);//歌曲id
			document.getElementById("rotate").style.animate="rote 10s infinite";
			var ul = this;
			// 获取音乐播放地址
			axios.get("https://autumnfish.cn/song/url?id="+musicId).then(function(resp){
				ul.musicSrc = resp.data.data[0].url;				
			}).catch(function(err){
				console.log("警告：获取音乐播放地址错误");
			}),
			// 获取专辑封面地址
			axios.get("https://autumnfish.cn/song/detail?ids="+musicId).then(function(resp){
				ul.cover = resp.data.songs[0].al.picUrl;				
			}).catch(function(err){
				console.log("警告：获取专辑封面地址错误");
			}),
			// 获取评论
			axios.get("https://autumnfish.cn/comment/hot?type=0&id="+musicId).then(function(resp){
				ul.comments = resp.data.hotComments;
			}).catch(function(err){
				console.log("警告：获取评论错误");
			})			
		},
```
## 效果展示
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210701104506999.gif#pic_center)

## [源码](https://wwr.lanzoui.com/i0q6uqvwywf)