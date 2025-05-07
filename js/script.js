document.addEventListener('DOMContentLoaded', function() {
    // 添加页面淡入效果
    document.body.classList.add('loaded');
    
    // 音乐播放管理
    const bgMusic = document.getElementById('bgMusic');
    const bgMusic2 = document.getElementById('bgMusic2');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.querySelector('.music-icon');
    
    // 当前播放的音乐索引
    let currentMusicIndex = 0;
    const musicElements = [bgMusic, bgMusic2];
    
    // 检查音乐播放状态并同步UI
    function checkMusicStatus() {
        const currentMusic = musicElements[currentMusicIndex];
        if (!currentMusic.paused) {
            // 音乐正在播放，更新UI
            musicIcon.classList.remove('paused');
            musicIcon.classList.add('playing');
            musicIcon.textContent = '🎵';
            updateVisualizerState();
        } else {
            // 音乐暂停中，尝试播放
            playCurrentMusic();
        }
    }
    
    // 播放当前索引的音乐
    function playCurrentMusic() {
        // 先暂停所有音乐
        musicElements.forEach(music => {
            if (!music.paused) {
                music.pause();
            }
        });
        
        // 播放当前索引的音乐
        const currentMusic = musicElements[currentMusicIndex];
        currentMusic.volume = 0.6;
        
        const playPromise = currentMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('音乐播放成功');
                musicIcon.classList.remove('paused');
                musicIcon.classList.add('playing');
                musicIcon.textContent = '🎵';
                updateVisualizerState();
            }).catch(error => {
                console.log('音乐播放失败，尝试备用方案', error);
                tryPlayAfterInteraction();
            });
        }
    }
    
    // 尝试在用户交互后播放
    function tryPlayAfterInteraction() {
        // 设置播放图标为暂停状态
        musicIcon.classList.remove('playing');
        musicIcon.classList.add('paused');
        musicIcon.textContent = '🔇';
        
        // 显示状态消息（可选）
        console.log('等待用户交互以启用音频播放');
    }
    
    // 监听音乐播放结束事件
    function setupMusicEndedEvent() {
        musicElements.forEach(music => {
            music.addEventListener('ended', function() {
                // 切换到下一首音乐
                currentMusicIndex = (currentMusicIndex + 1) % musicElements.length;
                playCurrentMusic();
            });
        });
    }
    
    // 音乐播放/暂停按钮
    musicToggle.addEventListener('click', function(event) {
        event.stopPropagation(); // 阻止事件冒泡到body
        
        const currentMusic = musicElements[currentMusicIndex];
        if (currentMusic.paused) {
            // 尝试播放
            playCurrentMusic();
        } else {
            // 暂停当前音乐
            currentMusic.pause();
            musicIcon.classList.remove('playing');
            musicIcon.classList.add('paused');
            musicIcon.textContent = '🔇';
            updateVisualizerState();
        }
    });
    
    // 设置音乐结束事件监听
    setupMusicEndedEvent();
    
    // 初始检查音乐状态 - 1秒后检查确保内联脚本有机会先执行
    setTimeout(checkMusicStatus, 1500);
    
    // 页面可见性变化时检查音乐状态
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            setTimeout(checkMusicStatus, 500);
        }
    });
    
    // Banner轮播图
    const banners = document.querySelectorAll('.banner');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let slideInterval;
    
    // 使用CSS动画处理轮播图缩放效果
    // 不再需要手动添加loaded类和修改transform
    
    // 切换Banner的函数
    function showSlide(index) {
        // 先移除所有active类，停止动画
        banners.forEach(banner => {
            banner.classList.remove('active');
            // 重置缩放
            banner.style.animation = 'none';
            banner.offsetHeight; // 触发重排，确保动画重新开始
        });
        
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 添加active类到当前索引
        banners[index].classList.add('active');
        dots[index].classList.add('active');
        
        // 移除animation:none以启动动画
        banners[index].style.animation = '';
        
        currentIndex = index;
    }
    
    // 自动轮播
    function startSlideshow() {
        slideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % banners.length;
            showSlide(nextIndex);
        }, 6000); // 6秒切换一次，给予更多观看时间
    }
    
    // 点击小圆点切换
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval); // 清除自动轮播
            const index = parseInt(this.getAttribute('data-index'));
            showSlide(index);
            startSlideshow(); // 重新开始自动轮播
        });
    });
    
    // 开始自动轮播
    startSlideshow();
    
    // 计算倒计时
    function updateCountdown() {
        /* 固定倒计时天数为36 */
        const daysLeftElement = document.getElementById('daysLeft');
        if (daysLeftElement) {
            daysLeftElement.textContent = '36';
        }
    }
    
    // 更新倒计时
    updateCountdown();
    
    // 音乐可视化效果
    const visualizerContainer = document.querySelector('.visualizer-container');
    
    // 创建更多柱子以实现图片中的效果
    function createBars() {
        // 先清空容器
        visualizerContainer.innerHTML = '';
        
        // 创建20个柱子
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            visualizerContainer.appendChild(bar);
        }
        
        // 更新bars变量
        return document.querySelectorAll('.bar');
    }
    
    // 创建新的蓝色柱
    const colorBars = createBars();
    
    // 初始化最小和最大高度值
    const minHeight = 5;      // 最小高度
    const maxHeight = 38;     // 最大高度
    
    // 预设相同高度的基础值，模拟图片中的效果
    const baseHeights = Array(20).fill(38);
    
    // 更新条形动画 - 更大的跳动幅度和更低的频率
    function updateBars() {
        if (!musicElements.every(music => music.paused)) {
            colorBars.forEach((bar, index) => {
                // 大幅度随机波动
                const randomFactor = Math.random();
                // 有30%的概率会下降到很低的高度
                if (randomFactor < 0.3) {
                    bar.style.height = `${minHeight + Math.floor(Math.random() * 10)}px`;
                } else {
                    // 其他情况保持较高高度，但也有轻微波动
                    const variance = Math.floor(Math.random() * 6) - 3; // -3到3的随机波动
                    const height = maxHeight + variance;
                    bar.style.height = `${height}px`;
                }
            });
        }
    }
    
    // 定时器
    let barInterval;
    
    function updateVisualizerState() {
        // 清除现有的计时器
        clearInterval(barInterval);
        
        if (musicElements.every(music => music.paused)) {
            // 如果音乐暂停，停止所有bar的动画
            colorBars.forEach(bar => {
                bar.style.height = '5px';
            });
        } else {
            // 如果音乐播放，立即更新一次并开始定时更新
            updateBars();
            // 降低更新频率：从50ms改为120ms
            barInterval = setInterval(updateBars, 120);
        }
    }
    
    // 监听音乐播放状态变化
    musicElements.forEach(music => {
        music.addEventListener('play', updateVisualizerState);
        music.addEventListener('pause', updateVisualizerState);
    });
    
    // 初始化音乐可视化状态
    updateVisualizerState();
    
    // 添加页面滚动效果
    const sections = document.querySelectorAll('.detail-item, .music-visualizer, footer');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.classList.add('visible');
            }
        });
    }
    
    // 初始检查
    setTimeout(checkScroll, 500);
    
    // 监听滚动事件
    window.addEventListener('scroll', checkScroll);
}); 