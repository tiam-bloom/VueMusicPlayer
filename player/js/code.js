new Vue({
	el: "#wrap",
	data: {
		musicName: "",//输入的搜索内容
		musicArr: [],//返回的歌曲数组列表
		musicSrc:"",//播放地址
		cover:"",//专辑封面
		comments:"",//评论
		playingTag:false
	},
	methods: {
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
		// 点击播放当前音乐
		toplay() {
		    this.playingTag = true
		},
		// 点击暂停当前音乐
		toPause() {
		    this.playingTag = false
		}
	}
})
