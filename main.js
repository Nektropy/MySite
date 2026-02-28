// main.js
// 主要功能调用
(function() {
    'use strict';

    const isMobile = window.innerWidth <= 1024;
    
    // 页面加载动画
    function initPageLoader() {
        const loader = document.getElementById('pageLoader');
        if (!loader) return;
        
        // 检查是否是首次访问
        const hasVisited = localStorage.getItem('visited');
        
        if (!hasVisited) {
            // 首次访问，显示加载动画
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.classList.add('hidden');
                    setTimeout(() => {
                        loader.remove();
                    }, 500);
                }, 500);
            });
            
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.classList.add('hidden');
                    setTimeout(() => loader.remove(), 500);
                }
            }, 3000);
            
            // 设置访问标记
            localStorage.setItem('visited', 'true');
        } else {
            // 非首次访问，直接隐藏加载动画
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 100);
        }
    }

    // 初始化侧边栏
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (!isMobile && sidebar && sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.toggle('collapsed');
                const isCollapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
                sidebarToggle.title = isCollapsed ? '展开菜单' : '收起菜单';
            });
            
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                // 添加no-transition类禁用过渡动画
                sidebar.classList.add('no-transition');
                
                // 设置初始状态
                sidebar.classList.add('collapsed');
                sidebarToggle.title = '展开菜单';
                
                // 强制重排
                void sidebar.offsetWidth;
                
                // 移除no-transition类，恢复过渡动画
                setTimeout(() => {
                    sidebar.classList.remove('no-transition');
                }, 100);
            }
        } else if (mobileMenu) {
            const menuToggle = document.getElementById('menuToggle');
            const menuDropdown = document.getElementById('menuDropdown');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.classList.toggle('active');
                    menuDropdown.classList.toggle('active');
                });

                document.addEventListener('click', function(e) {
                    if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
                        menuToggle.classList.remove('active');
                        menuDropdown.classList.remove('active');
                    }
                });
            }
        }
    }

    // 窗口大小改变处理
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 1024;
        if (newIsMobile !== isMobile) {
            location.reload();
        }
    });

    // 主题切换
    function initTheme() {
        const switcher = document.getElementById('themeSwitcher');
        if (!switcher) return;
        
        switcher.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            this.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('darkMode', isDark);
        });
        
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            switcher.querySelector('i').className = 'fas fa-sun';
        }
    }

    // 建站时间计算
    function initTimeCalc() {
        const startDate = new Date('2026-01-23T21:12:00');
        
        function getFormattedTime(currentDate) {
            return currentDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).replace(/:/g, ' : ');
        }
        
        function getFormattedDate(currentDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][currentDate.getDay()];
            
            return `${year} 年 ${month} 月 ${day} 日 ${weekday}`;
        }
        
        function update() {
            const now = new Date();
            const diff = now - startDate;
            
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            
            const daysEl = document.getElementById('site-running-days');
            const timeEl = document.getElementById('site-running-time');
            if (daysEl) daysEl.textContent = `${days} 天`;
            if (timeEl) timeEl.textContent = `${hours.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
            
            const dateEl = document.getElementById('current-date');
            const currentTimeEl = document.getElementById('current-time');
            if (dateEl && currentTimeEl) {
                dateEl.textContent = getFormattedDate(now);
                currentTimeEl.textContent = getFormattedTime(now);
            }
        }

        update();
        setInterval(update, 1000);
    }

    // 一言API
    function initQuote() {
        const quotes = [
            {text: "代码写的是逻辑，但表达的是思想。", author: "佚名"},
            {text: "保持好奇，保持饥饿。", author: "乔布斯"},
            {text: "简单是终极的复杂。", author: "达芬奇"},
            {text: "Talk is cheap. Show me the code.", author: "Linus Torvalds"},
            {text: "世界本就浑浊，罪与爱同歌。", author: "熵"}
        ];

        async function load() {
            try {
                const res = await fetch('https://v1.hitokoto.cn');
                const data = await res.json();
                const textEl = document.getElementById('quote-text');
                const authorEl = document.getElementById('quote-author');
                
                if (textEl) textEl.textContent = data.hitokoto;
                if (authorEl) {
                    const who = data.from_who || data.from || '佚名';
                    authorEl.textContent = `—— ${who}`;
                }
            } catch(e) {
                const q = quotes[Math.floor(Math.random() * quotes.length)];
                const textEl = document.getElementById('quote-text');
                const authorEl = document.getElementById('quote-author');
                if (textEl) textEl.textContent = q.text;
                if (authorEl) authorEl.textContent = `—— ${q.author}`;
            }
        }

        load();

        const refreshBtn = document.getElementById('refresh-quote');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                this.style.transform = 'rotate(360deg)';
                setTimeout(() => this.style.transform = '', 300);
                load();
            });
        }
    }

    // 渲染合作信息
    function renderCooperators() {
        const container = document.getElementById('coopList');
        if (!container || typeof siteConfig === 'undefined') return;
        
        const html = siteConfig.cooperators.map(c => `
            <a href="${c.url}" target="_blank" title="${c.name}">
                <img src="${c.avatar}" class="coop-avatar" alt="" onerror="this.style.display='none'">
                ${c.name}
            </a>
        `).join('');
        
        container.innerHTML = html || '暂无';
    }

    // 渲染页脚友链
    function renderFooterFriends() {
        const container = document.getElementById('footerFriends');
        if (!container || typeof friendsConfig === 'undefined') return;
        
        const displayFriends = friendsConfig.slice(0, 5);
        const html = displayFriends.map(f => `
            <a href="${f.url}" class="footer-friend-item" target="_blank" title="${f.desc}">
                <img src="${f.avatar}" alt="" onerror="this.src='head.png'">
                <span>${f.name}</span>
            </a>
        `).join('');
        
        container.innerHTML = html;
    }

    // 卡片入场动画
    function initAnimations() {
        const cards = document.querySelectorAll('.card');
        
        // 使用 Intersection Observer 实现更平滑的滚动动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // 使用 requestAnimationFrame 确保动画在浏览器渲染周期中执行
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 40); // 更短的延迟，使动画更连贯
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05, // 更早触发动画
            rootMargin: '0px 0px -100px 0px' // 更大的触发区域
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(25px)';
            card.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(card);
        });

        document.querySelectorAll('.skill, .hobby').forEach(tag => {
            tag.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            tag.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // 统计备份
    function initStats() {
        setTimeout(function() {
            const pv = document.getElementById('busuanzi_value_site_pv');
            const uv = document.getElementById('busuanzi_value_site_uv');
            
            if (pv && pv.textContent === '0') {
                let visits = parseInt(localStorage.getItem('site_visits') || '158');
                pv.textContent = visits;
                localStorage.setItem('site_visits', visits + 1);
            }
            if (uv && uv.textContent === '0') {
                let visitors = parseInt(localStorage.getItem('site_visitors') || '42');
                uv.textContent = visitors;
                if (!localStorage.getItem('visited')) {
                    localStorage.setItem('site_visitors', visitors + 1);
                    localStorage.setItem('visited', '1');
                }
            }
        }, 1500);
    }

    // ========== Waline 相关功能 ==========
    
    // 初始化 Waline
    async function initWaline() {
        // 检查是否有Waline评论区
        if (!document.getElementById('waline')) {
            return;
        }
        
        try {
            const { init } = await import('https://unpkg.com/@waline/client@v3/dist/waline.js');
            
            // 1. 图片预览插件
            const imagePreview = () => ({
                name: 'waline-image-preview',
                mounted: (ctx) => {
                    ctx.el.addEventListener('click', (e) => {
                        const img = e.target.closest('.wl-content img');
                        if (!img) return;
                        e.preventDefault();
                        
                        const overlay = document.createElement('div');
                        overlay.className = 'image-preview-overlay';
                        overlay.innerHTML = `<img src="${img.src}" alt="">`;
                        document.body.appendChild(overlay);
                        
                        const close = () => {
                            overlay.style.animation = 'fadeOut 0.3s';
                            setTimeout(() => overlay.remove(), 300);
                        };
                        
                        overlay.addEventListener('click', close);
                        document.addEventListener('keydown', (e) => {
                            if (e.key === 'Escape') close();
                        }, { once: true });
                    });
                }
            });

            // 2. 代码高亮插件
            const codeHighlight = () => ({
                name: 'waline-code-highlight',
                mounted: (ctx) => {
                    // 动态加载 Prism.js
                    if (!window.Prism) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
                        document.head.appendChild(link);
                        
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
                        script.onload = () => {
                            // 加载常用语言
                            const languages = ['javascript', 'python', 'css', 'html', 'bash', 'json'];
                            languages.forEach(lang => {
                                const langScript = document.createElement('script');
                                langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
                                document.head.appendChild(langScript);
                            });
                            highlightCode(ctx.el);
                        };
                        document.head.appendChild(script);
                    } else {
                        highlightCode(ctx.el);
                    }
                    
                    function highlightCode(container) {
                        setTimeout(() => {
                            const codeBlocks = container.querySelectorAll('pre code');
                            codeBlocks.forEach(block => {
                                if (!block.classList.contains('language-none')) {
                                    block.classList.add('language-none');
                                }
                                if (window.Prism) {
                                    window.Prism.highlightElement(block);
                                }
                                // 添加复制按钮
                                addCopyButton(block.parentElement);
                            });
                        }, 500);
                    }
                    
                    function addCopyButton(preElement) {
                        if (preElement.querySelector('.copy-btn')) return;
                        
                        const button = document.createElement('button');
                        button.className = 'copy-btn';
                        button.innerHTML = '<i class="fas fa-copy"></i>';
                        button.title = '复制代码';
                        
                        button.addEventListener('click', async () => {
                            const code = preElement.querySelector('code').textContent;
                            try {
                                await navigator.clipboard.writeText(code);
                                button.innerHTML = '<i class="fas fa-check"></i>';
                                button.title = '已复制';
                                setTimeout(() => {
                                    button.innerHTML = '<i class="fas fa-copy"></i>';
                                    button.title = '复制代码';
                                }, 2000);
                            } catch (err) {
                                button.innerHTML = '<i class="fas fa-times"></i>';
                                button.title = '复制失败';
                                setTimeout(() => {
                                    button.innerHTML = '<i class="fas fa-copy"></i>';
                                    button.title = '复制代码';
                                }, 2000);
                            }
                        });
                        
                        preElement.style.position = 'relative';
                        button.style.position = 'absolute';
                        button.style.top = '8px';
                        button.style.right = '8px';
                        button.style.padding = '4px 8px';
                        button.style.background = 'var(--glass-bg)';
                        button.style.border = '1px solid var(--glass-border)';
                        button.style.borderRadius = '4px';
                        button.style.color = 'var(--text-main)';
                        button.style.cursor = 'pointer';
                        button.style.fontSize = '12px';
                        button.style.zIndex = '10';
                        
                        preElement.appendChild(button);
                    }
                },
                updated: (ctx) => {
                    if (window.Prism) {
                        setTimeout(() => {
                            const codeBlocks = ctx.el.querySelectorAll('pre code:not(.language-none)');
                            codeBlocks.forEach(block => {
                                window.Prism.highlightElement(block);
                                addCopyButton(block.parentElement);
                            });
                        }, 300);
                    }
                }
            });

            // 3. 打字机效果插件（可选）
            const typewriterEffect = () => ({
                name: 'waline-typewriter',
                mounted: (ctx) => {
                    // 这个插件只对新评论生效
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach((node) => {
                                    if (node.nodeType === 1 && node.matches('.wl-comment-item')) {
                                        // 只对前三个新评论应用打字效果
                                        const content = node.querySelector('.wl-content');
                                        if (content) {
                                            const text = content.textContent;
                                            if (text.length < 500) { // 只对短文本应用
                                                animateText(content, text);
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    });
                    
                    observer.observe(ctx.el, {
                        childList: true,
                        subtree: true
                    });
                    
                    function animateText(element, text) {
                        element.textContent = '';
                        let i = 0;
                        const speed = 20; // 打字速度（毫秒）
                        
                        function typeWriter() {
                            if (i < text.length) {
                                element.textContent += text.charAt(i);
                                i++;
                                setTimeout(typeWriter, speed);
                            }
                        }
                        
                        // 延迟开始打字效果
                        setTimeout(typeWriter, 300);
                    }
                }
            });

            // 4. 评论字数统计插件
            const wordCountPlugin = () => ({
                name: 'waline-word-count',
                mounted: (ctx) => {
                    const editor = ctx.el.querySelector('.wl-editor');
                    if (!editor) return;
                    
                    const counter = document.createElement('div');
                    counter.className = 'word-counter';
                    counter.style.cssText = `
                        position: absolute;
                        bottom: -25px;
                        right: 10px;
                        font-size: 12px;
                        color: var(--text-sub);
                        transition: color 0.3s;
                    `;
                    
                    editor.parentElement.style.position = 'relative';
                    editor.parentElement.appendChild(counter);
                    
                    const updateCount = () => {
                        const text = editor.value || '';
                        const count = text.length;
                        counter.textContent = `${count}/2000`;
                        
                        if (count > 1800) {
                            counter.style.color = 'var(--accent)';
                        } else if (count > 1500) {
                            counter.style.color = 'orange';
                        } else {
                            counter.style.color = 'var(--text-sub)';
                        }
                    };
                    
                    editor.addEventListener('input', updateCount);
                    editor.addEventListener('focus', updateCount);
                    updateCount();
                }
            });

            // 5. 实时预览插件
            const realtimePreview = () => ({
                name: 'waline-realtime-preview',
                mounted: (ctx) => {
                    const editor = ctx.el.querySelector('.wl-editor');
                    const previewBtn = ctx.el.querySelector('.wl-preview');
                    
                    if (!editor || !previewBtn) return;
                    
                    // 创建预览容器
                    const previewContainer = document.createElement('div');
                    previewContainer.className = 'realtime-preview';
                    previewContainer.style.cssText = `
                        display: none;
                        margin-top: 10px;
                        padding: 15px;
                        background: var(--glass-bg);
                        border: 1px solid var(--glass-border);
                        border-radius: 12px;
                        color: var(--text-main);
                        font-size: 14px;
                        line-height: 1.6;
                        min-height: 100px;
                        max-height: 300px;
                        overflow-y: auto;
                    `;
                    
                    editor.parentElement.appendChild(previewContainer);
                    
                    // 简单的Markdown解析
                    function parseMarkdown(text) {
                        if (!text.trim()) return '<span style="color:var(--text-sub)">输入内容预览...</span>';
                        
                        return text
                            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" style="max-width:100%;border-radius:8px;margin:5px 0;">')
                            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" style="color:var(--primary);text-decoration:underline;">$1</a>')
                            .replace(/\n\n/gim, '</p><p>')
                            .replace(/\n/gim, '<br>')
                            .replace(/`(.*?)`/gim, '<code style="background:rgba(0,0,0,0.1);padding:2px 6px;border-radius:4px;font-family:monospace;">$1</code>')
                            .replace(/```([\s\S]*?)```/gim, '<pre style="background:rgba(0,0,0,0.1);padding:10px;border-radius:8px;overflow-x:auto;"><code>$1</code></pre>');
                    }
                    
                    let previewVisible = false;
                    
                    // 修改预览按钮点击事件
                    const originalClick = previewBtn.onclick;
                    previewBtn.onclick = function(e) {
                        e.preventDefault();
                        previewVisible = !previewVisible;
                        
                        if (previewVisible) {
                            previewContainer.style.display = 'block';
                            previewContainer.innerHTML = parseMarkdown(editor.value);
                            previewBtn.textContent = '隐藏预览';
                        } else {
                            previewContainer.style.display = 'none';
                            previewBtn.textContent = '预览';
                        }
                        
                        // 保留Waline原有的预览功能
                        if (originalClick) originalClick.call(this, e);
                    };
                    
                    // 实时更新预览
                    let updateTimer;
                    editor.addEventListener('input', () => {
                        if (previewVisible) {
                            clearTimeout(updateTimer);
                            updateTimer = setTimeout(() => {
                                previewContainer.innerHTML = parseMarkdown(editor.value);
                            }, 300);
                        }
                    });
                    
                    // 初始化
                    if (editor.value) {
                        previewContainer.innerHTML = parseMarkdown(editor.value);
                    }
                }
            });

            // 6. 表情快捷输入插件
            const emojiShortcut = () => ({
                name: 'waline-emoji-shortcut',
                mounted: (ctx) => {
                    const editor = ctx.el.querySelector('.wl-editor');
                    if (!editor) return;
                    
                    // 表情快捷映射
                    const emojiMap = {
                        ':)': '😊',
                        ':(': '😞',
                        ':D': '😁',
                        ':P': '😛',
                        ';)': '😉',
                        '<3': '❤️',
                        ':+1:': '👍',
                        ':-1:': '👎',
                        ':heart:': '❤️',
                        ':star:': '⭐',
                        ':fire:': '🔥',
                        ':100:': '💯',
                        ':ok:': '👌',
                        ':clap:': '👏'
                    };
                    
                    editor.addEventListener('keydown', (e) => {
                        // 检测空格键输入表情
                        if (e.key === ' ' || e.key === 'Enter') {
                            const text = editor.value;
                            let changed = false;
                            let newText = text;
                            
                            Object.keys(emojiMap).forEach(key => {
                                // 确保是完整的表情符号（前面是空格或开始）
                                const regex = new RegExp(`(^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'g');
                                if (regex.test(text)) {
                                    newText = newText.replace(regex, `$1${emojiMap[key]}$2`);
                                    changed = true;
                                }
                            });
                            
                            if (changed) {
                                editor.value = newText;
                                const event = new Event('input', { bubbles: true });
                                editor.dispatchEvent(event);
                            }
                        }
                    });
                }
            });

            // 7. 自动保存草稿插件
            const autoSaveDraft = () => ({
                name: 'waline-auto-save',
                mounted: (ctx) => {
                    const editor = ctx.el.querySelector('.wl-editor');
                    const nickInput = ctx.el.querySelector('input[name="nick"]');
                    const mailInput = ctx.el.querySelector('input[name="mail"]');
                    
                    if (!editor) return;
                    
                    const storageKey = 'waline_draft';
                    const saveInterval = 3000; // 3秒保存一次
                    
                    // 加载草稿
                    const loadDraft = () => {
                        try {
                            const draft = JSON.parse(localStorage.getItem(storageKey));
                            if (draft && draft.content) {
                                if (draft.content) editor.value = draft.content;
                                if (draft.nick && nickInput) nickInput.value = draft.nick;
                                if (draft.mail && mailInput) mailInput.value = draft.mail;
                                
                                // 显示恢复提示
                                const hint = document.createElement('div');
                                hint.className = 'draft-hint';
                                hint.style.cssText = `
                                    position: fixed;
                                    bottom: 20px;
                                    right: 20px;
                                    background: var(--primary);
                                    color: white;
                                    padding: 10px 15px;
                                    border-radius: 8px;
                                    font-size: 12px;
                                    z-index: 1000;
                                    cursor: pointer;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                    animation: draftFadeIn 0.5s ease;
                                `;
                                hint.innerHTML = '📝 已恢复草稿 <span style="margin-left:10px;cursor:pointer;font-size:10px;">×</span>';
                                
                                hint.querySelector('span').addEventListener('click', () => {
                                    hint.remove();
                                });
                                
                                document.body.appendChild(hint);
                                setTimeout(() => {
                                    if (hint.parentNode) hint.remove();
                                }, 5000);
                            }
                        } catch (e) {
                            console.log('无法加载草稿:', e);
                        }
                    };
                    
                    // 保存草稿
                    const saveDraft = () => {
                        if (!editor.value.trim() && (!nickInput || !nickInput.value) && (!mailInput || !mailInput.value)) {
                            return; // 空内容不保存
                        }
                        
                        const draft = {
                            content: editor.value,
                            nick: nickInput ? nickInput.value : '',
                            mail: mailInput ? mailInput.value : '',
                            timestamp: Date.now()
                        };
                        
                        localStorage.setItem(storageKey, JSON.stringify(draft));
                    };
                    
                    // 清空草稿
                    const clearDraft = () => {
                        localStorage.removeItem(storageKey);
                    };
                    
                    // 监听提交按钮
                    const submitBtn = ctx.el.querySelector('.wl-btn[type="submit"]');
                    if (submitBtn) {
                        submitBtn.addEventListener('click', () => {
                            setTimeout(clearDraft, 1000);
                        });
                    }
                    
                    // 定时保存
                    let saveTimer;
                    const startAutoSave = () => {
                        if (saveTimer) clearInterval(saveTimer);
                        saveTimer = setInterval(saveDraft, saveInterval);
                    };
                    
                    // 输入时重置定时器
                    const resetSaveTimer = () => {
                        clearInterval(saveTimer);
                        startAutoSave();
                    };
                    
                    editor.addEventListener('input', resetSaveTimer);
                    if (nickInput) nickInput.addEventListener('input', resetSaveTimer);
                    if (mailInput) mailInput.addEventListener('input', resetSaveTimer);
                    
                    // 页面卸载时保存
                    window.addEventListener('beforeunload', saveDraft);
                    
                    // 加载草稿并开始自动保存
                    loadDraft();
                    startAutoSave();
                    
                    // 添加草稿动画样式
                    if (!document.querySelector('#draft-animation-style')) {
                        const style = document.createElement('style');
                        style.id = 'draft-animation-style';
                        style.textContent = `
                            @keyframes draftFadeIn {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }
            });

            // 8. 评论图片懒加载插件
            const lazyLoadImages = () => ({
                name: 'waline-lazy-load',
                mounted: (ctx) => {
                    const observerOptions = {
                        root: null,
                        rootMargin: '100px',
                        threshold: 0.1
                    };
                    
                    const imageObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                if (img.dataset.src) {
                                    img.src = img.dataset.src;
                                    img.removeAttribute('data-src');
                                }
                                imageObserver.unobserve(img);
                            }
                        });
                    }, observerOptions);
                    
                    // 观察现有图片
                    const images = ctx.el.querySelectorAll('.wl-content img[data-src]');
                    images.forEach(img => imageObserver.observe(img));
                    
                    // 观察新添加的图片
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) {
                                    const newImages = node.querySelectorAll ? node.querySelectorAll('.wl-content img[data-src]') : [];
                                    newImages.forEach(img => imageObserver.observe(img));
                                }
                            });
                        });
                    });
                    
                    observer.observe(ctx.el, {
                        childList: true,
                        subtree: true
                    });
                }
            });

            const walineInstance = init({
                el: '#waline',
                serverURL: 'https://chat.mxw315.buzz',
                dark: document.body.classList.contains('dark-mode') ? 'html[class="dark-mode"]' : false,
                lang: 'zh-CN',
                placeholder: '说点什么吧... 支持 Markdown、表情包、点击图片预览',
                requiredMeta: ['nick', 'mail'],
                avatar: 'mp',
                pageSize: 10,
                wordLimit: [3, 2000],
                emoji: [
                    'https://unpkg.com/@waline/emojis@1.1.0/weibo',
                    'https://unpkg.com/@waline/emojis@1.1.0/bilibili',
                    'https://unpkg.com/@waline/emojis@1.1.0/qq',
                    'https://unpkg.com/@waline/emojis@1.1.0/alus'
                ],
                // 添加所有插件
                plugins: [
                    imagePreview(),
                    codeHighlight(),
                    // typewriterEffect(), // 打字机效果（可根据需要启用/禁用）
                    wordCountPlugin(),
                    realtimePreview(),
                    emojiShortcut(),
                    autoSaveDraft(),
                    lazyLoadImages()
                ],
                locale: {
                    placeholder: '说点什么吧... 支持 Markdown、表情包、点击图片预览',
                    sofa: '🛋️ 还没有人留言，来抢沙发吧~',
                    admin: '站长',
                    submit: '发布',
                    ctrlReply: '按 Ctrl+Enter 快速提交'
                }
            });

            // 隐藏加载动画
            const loading = document.getElementById('walineLoading');
            if (loading) loading.style.display = 'none';

            // 初始化折叠
            initWalineCollapse();
            
            // 初始化计数
            initCommentCount();
            
            // 初始化反应功能
            initReaction();
            
            // 初始化最近评论
            initRecentComments();

            // 主题监听
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isDark = document.body.classList.contains('dark-mode');
                        if (walineInstance?.update) {
                            walineInstance.update({ dark: isDark ? 'html[class="dark-mode"]' : false });
                        }
                    }
                });
            });
            
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });

        } catch (err) {
            console.error('Waline 加载失败:', err);
            const loading = document.getElementById('walineLoading');
            if (loading) {
                loading.innerHTML = '<span style="color: var(--text-color);">❌ 评论系统加载失败，请刷新重试</span>';
            }
        }
    }

    // 评论区折叠
    function initWalineCollapse() {
        const walineCard = document.getElementById('walineCard');
        const walineHeader = document.getElementById('walineHeader');
        const walineContent = document.getElementById('walineContent');
        const walineToggle = document.getElementById('walineToggle');
        
        if (!walineCard || !walineHeader || !walineContent || !walineToggle) return;

        let isExpanded = localStorage.getItem('walineExpanded') !== 'false';
        
        const setExpanded = (expanded) => {
            isExpanded = expanded;
            localStorage.setItem('walineExpanded', isExpanded);
            
            if (isExpanded) {
                walineCard.classList.add('expanded');
                walineContent.style.maxHeight = 'none';
                walineContent.style.opacity = '1';
                walineContent.style.padding = '';
                walineToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
                walineToggle.title = '收起';
            } else {
                walineCard.classList.remove('expanded');
                walineContent.style.maxHeight = '0';
                walineContent.style.opacity = '0';
                walineContent.style.padding = '0';
                walineToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                walineToggle.title = '展开';
            }
        };

        if (!isExpanded) setExpanded(false);

        walineHeader.addEventListener('click', (e) => {
            if (e.target.closest('.waline-toggle') || e.target === walineHeader || e.target.closest('h3')) {
                setExpanded(!isExpanded);
            }
        });

        walineContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 评论计数
    async function initCommentCount() {
        const updateCount = async () => {
            try {
                const response = await fetch(`https://chat.mxw315.buzz/api/comment?path=${encodeURIComponent(location.pathname)}`);
                const data = await response.json();
                const count = data.data?.count || 0;
                
                const commentCount = document.getElementById('commentCount');
                if (commentCount) {
                    if (count > 0) {
                        commentCount.textContent = count;
                        commentCount.style.display = 'inline-flex';
                    } else {
                        commentCount.style.display = 'none';
                    }
                }
            } catch (e) {}
        };

        updateCount();
        setInterval(updateCount, 30000);
    }

    // 文章反应功能
    async function initReaction() {
        const container = document.getElementById('waline-reaction');
        if (!container) return;

        const reactions = [
            { emoji: '👍', text: '有帮助', id: 'like' },
            { emoji: '❤️', text: '喜欢', id: 'love' },
            { emoji: '😄', text: '有趣', id: 'funny' },
            { emoji: '🤔', text: '思考', id: 'think' },
            { emoji: '👏', text: '感谢', id: 'thanks' }
        ];

        // 从 localStorage 读取用户已选
        const storageKey = `waline-reactions-${location.pathname}`;
        const userReactions = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 初始化 UI
        container.innerHTML = `
            <div class="reaction-buttons">
                ${reactions.map(r => `
                    <button class="reaction-btn ${userReactions.includes(r.id) ? 'active' : ''}" 
                            data-id="${r.id}" 
                            ${userReactions.includes(r.id) ? 'disabled' : ''}>
                        <span class="reaction-emoji">${r.emoji}</span>
                        <span class="reaction-text">${r.text}</span>
                        <span class="reaction-count" data-id="${r.id}">0</span>
                    </button>
                `).join('')}
            </div>
        `;

        // 尝试从服务器获取计数（使用 article API）
        try {
            const response = await fetch(`https://chat.mxw315.buzz/api/article?path=${encodeURIComponent(location.pathname)}`);
            if (response.ok) {
                const data = await response.json();
                const reactionData = data.data?.reaction || {};
                
                // 更新计数
                Object.entries(reactionData).forEach(([id, count]) => {
                    const el = container.querySelector(`.reaction-count[data-id="${id}"]`);
                    if (el) el.textContent = count;
                });
            }
        } catch (e) {
            // 静默失败，使用本地计数
        }

        // 点击事件 - 提交到服务器
        container.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                if (btn.disabled) return;
                
                // 先更新本地
                const countEl = btn.querySelector('.reaction-count');
                const currentCount = parseInt(countEl.textContent) || 0;
                countEl.textContent = currentCount + 1;
                
                btn.classList.add('active');
                btn.disabled = true;
                
                userReactions.push(id);
                localStorage.setItem(storageKey, JSON.stringify(userReactions));
                
                // 尝试提交到服务器
                try {
                    await fetch('https://chat.mxw315.buzz/api/article', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            path: location.pathname,
                            reaction: [id]
                        })
                    });
                } catch (err) {
                    // 服务器不支持也OK，本地已保存
                    console.log('Reaction saved locally');
                }
            });
        });
    }

    // 最近评论
    async function initRecentComments() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const response = await fetch(`https://chat.mxw315.buzz/api/comment?type=recent&count=5`);
            const data = await response.json();
            const comments = data.data || [];
            
            const container = document.getElementById('waline-recent');
            if (!container) return;
            
            if (comments.length === 0) {
                container.innerHTML = '<div class="recent-loading">还没有评论哦，来抢沙发吧~</div>';
                return;
            }
            
            const timeAgo = (date) => {
                const seconds = Math.floor((new Date() - new Date(date)) / 1000);
                const intervals = { 年: 31536000, 月: 2592000, 天: 86400, 小时: 3600, 分钟: 60 };
                for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                    const interval = Math.floor(seconds / secondsInUnit);
                    if (interval >= 1) return `${interval}${unit}前`;
                }
                return '刚刚';
            };
            
            container.innerHTML = comments.map(comment => `
                <div class="recent-comment-item">
                    <img src="${comment.avatar}" class="recent-comment-avatar" alt="" onerror="this.src='head.png'">
                    <div class="recent-comment-content">
                        <div class="recent-comment-header">
                            <span class="recent-comment-nick">${comment.nick}</span>
                            <span class="recent-comment-time">${timeAgo(comment.time)}</span>
                        </div>
                        <div class="recent-comment-text">${comment.comment.replace(/<[^>]*>/g, '').substring(0, 50)}${comment.comment.length > 50 ? '...' : ''}</div>
                    </div>
                </div>
            `).join('');
            
        } catch (err) {
            console.error('最近评论加载失败:', err);
            const container = document.getElementById('waline-recent');
            if (container) {
                container.innerHTML = '<div class="recent-loading">最近评论加载失败</div>';
            }
        }
    }

    // 启动
    document.addEventListener('DOMContentLoaded', function() {
        initPageLoader();
        initSidebar();
        initTheme();
        initTimeCalc();
        initQuote();
        renderCooperators();
        renderFooterFriends();
        initAnimations();
        initStats();
        
        // 延迟加载 Waline (仅在有评论区的页面)
        if (document.getElementById('waline')) {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(initWaline, { timeout: 2000 });
            } else {
                setTimeout(initWaline, 100);
            }
        }
    });

})();