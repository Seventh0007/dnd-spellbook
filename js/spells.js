/* ============================
   跑团法术书 - 法术查询页功能
   ============================ */

/* 全局变量 */
let allSpells = []; // 所有法术数据
let filteredSpells = []; // 筛选后的法术

/* ============================
   初始化
   ============================ */
document.addEventListener('DOMContentLoaded', function() {
    console.log('跑团法术书 - 法术查询页已加载');
    
    /* 解析URL参数 */
    const urlParams = new URLSearchParams(window.location.search);
    const version = urlParams.get('v') || '5e';
    
    /* 更新页面标题 */
    updatePageTitle(version);
    
    /* 加载法术数据 */
    loadSpellsData(version);
    
    /* 绑定搜索框事件 */
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('input', debounce(filterSpells, 300));
    }
    
    /* 绑定筛选下拉菜单事件 */
    const filterLevel = document.getElementById('filter-level');
    const filterSchool = document.getElementById('filter-school');
    const filterClass = document.getElementById('filter-class');
    
    if (filterLevel) filterLevel.addEventListener('change', filterSpells);
    if (filterSchool) filterSchool.addEventListener('change', filterSpells);
    if (filterClass) filterClass.addEventListener('change', filterSpells);
    
    /* 绑定弹窗关闭事件 */
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    /* 绑定ESC键关闭弹窗 */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    /* 绑定返回顶部按钮 */
    window.addEventListener('scroll', toggleBackToTopButton);
    toggleBackToTopButton();
});

/* ============================
   页面标题更新
   ============================ */
function updatePageTitle(version) {
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');
    
    if (version === '5r') {
        if (pageTitle) pageTitle.textContent = '全新5版规则法术库';
        if (pageDescription) pageDescription.textContent = '2024版扩展与重构法术';
    } else {
        if (pageTitle) pageTitle.textContent = '经典5版规则法术库';
        if (pageDescription) pageDescription.textContent = '原汁原味的五版法术库';
    }
}

/* ============================
   加载法术数据
   ============================ */
function loadSpellsData(version) {
    const dataFile = version === '5r' ? 'data/spells-5r.json' : 'data/spells-5e.json';
    
    fetch(dataFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('法术数据加载失败');
            }
            return response.json();
        })
        .then(data => {
            allSpells = data;
            filteredSpells = [...allSpells];
            renderSpellsGrid(filteredSpells);
            console.log(`已加载 ${allSpells.length} 个法术`);
        })
        .catch(error => {
            console.error('加载法术数据失败：', error);
            showToast('法术数据加载失败，请检查网络连接');
            
            /* 使用测试数据（如果没有JSON文件） */
            if (allSpells.length === 0) {
                allSpells = getTestSpells();
                filteredSpells = [...allSpells];
                renderSpellsGrid(filteredSpells);
                console.log('使用测试数据');
            }
        });
}

/* ============================
   渲染法术列表（Stat Block卡片）
   ============================ */
function renderSpellsGrid(spells) {
    const grid = document.getElementById('spells-grid');
    const noResults = document.getElementById('no-results');
    
    if (!grid) return;
    
    /* 清空现有内容 */
    grid.innerHTML = '';
    
    /* 显示/隐藏无结果提示 */
    if (spells.length === 0) {
        grid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    } else {
        grid.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';
    }
    
    /* 渲染每个法术卡片 */
    spells.forEach(spell => {
        const card = createSpellCard(spell);
        grid.appendChild(card);
    });
}

/* ============================
   创建法术卡片（Stat Block样式）
   ============================ */
function createSpellCard(spell) {
    const card = document.createElement('div');
    card.className = 'spell-card';
    card.onclick = () => openSpellModal(spell);
    
    /* 构建法术环数显示 */
    const levelText = spell.level === 0 ? '戏法' : `${spell.level}环`;
    
    card.innerHTML = `
        <div class="stat-block">
            <div class="spell-name">${escapeHtml(spell.name)}</div>
            <div class="spell-subtitle">${levelText} · ${escapeHtml(spell.school)}</div>
            <hr class="divider">
            
            <div class="stat-line">
                <span class="stat-label">施法时间</span>
                <span class="stat-value">${escapeHtml(spell.castingTime)}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">施法距离</span>
                <span class="stat-value">${escapeHtml(spell.range)}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">法术成分</span>
                <span class="stat-value">${formatComponents(spell.components)}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">持续时间</span>
                <span class="stat-value">${escapeHtml(spell.duration)}</span>
            </div>
            
            <hr class="divider">
            
            <div class="description">
                ${escapeHtml(truncateText(spell.description, 150))}
            </div>
        </div>
    `;
    
    /* 自动包装数字（使用黑体字体与宋体对齐） */
    wrapNumbers(card);
    
    return card;
}

/* ============================
   打开法术详情弹窗（完整Stat Block样式）
   ============================ */
function openSpellModal(spell) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    if (!modalOverlay || !modalContent) return;
    
    /* 构建法术环数显示 */
    const levelText = spell.level === 0 ? '戏法' : `${spell.level}环`;
    
    /* 构建成分显示 */
    const componentsText = formatComponents(spell.components);
    
    /* 构建高等法术效果 */
    let higherLevelHtml = '';
    if (spell.higherLevel) {
        higherLevelHtml = `
            <div class="higher-level">
                <span class="higher-level-label">升环施法。</span>${escapeHtml(spell.higherLevel)}
            </div>
        `;
    }
    
    /* 构建来源信息 */
    let sourceHtml = '';
    if (spell.source) {
        sourceHtml = `<div class="source-placeholder">${escapeHtml(spell.source)}</div>`;
    }
    
    /* 填充弹窗内容 */
    modalContent.innerHTML = `
        <button class="modal-close" id="modal-close">×</button>
        <div class="stat-block" style="box-shadow: none; border: none; padding: 0;">
            <div class="spell-name">${escapeHtml(spell.name)}</div>
            <div class="spell-subtitle">${levelText} · ${escapeHtml(spell.school)}</div>
            <hr class="divider">
            
            <div class="stat-line">
                <span class="stat-label">施法时间</span>
                <span class="stat-value">${escapeHtml(spell.castingTime)}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">施法距离</span>
                <span class="stat-value">${escapeHtml(spell.range)}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">法术成分</span>
                <span class="stat-value">${componentsText}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">持续时间</span>
                <span class="stat-value">${escapeHtml(spell.duration)}</span>
            </div>
            
            <hr class="divider">
            
            <div class="description">
                ${formatDescription(spell.description)}
            </div>
            
            ${higherLevelHtml}
            ${sourceHtml}
            <div style="clear: both;"></div>
        </div>
    `;
    
    /* 自动包装数字（使用黑体字体与宋体对齐） */
    wrapNumbers(modalContent);
    
    /* 重新绑定关闭按钮事件 */
    const newModalClose = document.getElementById('modal-close');
    if (newModalClose) {
        newModalClose.addEventListener('click', closeModal);
    }
    
    /* 显示弹窗 */
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

/* ============================
   关闭弹窗
   ============================ */
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modalOverlay) {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
}

/* ============================
   搜索和筛选功能
   ============================ */
function filterSpells() {
    const searchBox = document.getElementById('search-box');
    const filterLevel = document.getElementById('filter-level');
    const filterSchool = document.getElementById('filter-school');
    const filterClass = document.getElementById('filter-class');
    
    const searchText = searchBox ? searchBox.value.toLowerCase() : '';
    const selectedLevel = filterLevel ? filterLevel.value : 'all';
    const selectedSchool = filterSchool ? filterSchool.value : 'all';
    const selectedClass = filterClass ? filterClass.value : 'all';
    
    filteredSpells = allSpells.filter(spell => {
        /* 搜索条件 */
        const matchesSearch = !searchText || 
            spell.name.toLowerCase().includes(searchText) ||
            (spell.nameEn && spell.nameEn.toLowerCase().includes(searchText)) ||
            spell.description.toLowerCase().includes(searchText) ||
            spell.school.toLowerCase().includes(searchText) ||
            (spell.classes && spell.classes.some(c => c.toLowerCase().includes(searchText)));
        
        /* 环数筛选 */
        const matchesLevel = selectedLevel === 'all' || spell.level.toString() === selectedLevel;
        
        /* 学派筛选 */
        const matchesSchool = selectedSchool === 'all' || spell.school === selectedSchool;
        
        /* 职业筛选 */
        const matchesClass = selectedClass === 'all' || 
            (spell.classes && spell.classes.includes(selectedClass));
        
        return matchesSearch && matchesLevel && matchesSchool && matchesClass;
    });
    
    renderSpellsGrid(filteredSpells);
}

/* ============================
   工具函数
   ============================ */

/* HTML转义（防止XSS） */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

/* 截断文本 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/* 格式化法术成分 */
function formatComponents(components) {
    if (!components) return '';
    
    let result = [];
    if (components.verbal) result.push('V');
    if (components.somatic) result.push('S');
    if (components.material) {
        let material = 'M';
        if (components.materialDesc) {
            material += `（${components.materialDesc}）`;
        }
        result.push(material);
    }
    
    return result.join('、');
}

/* 格式化描述文本（处理加粗等） */
function formatDescription(description) {
    if (!description) return '';
    
    /* 简单的加粗处理（假设 **text** 表示加粗） */
    let formatted = escapeHtml(description);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return formatted;
}

/* 防抖函数 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* 显示Toast提示 */
function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);
}

/* 显示/隐藏返回顶部按钮 */
function toggleBackToTopButton() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    if (window.pageYOffset > window.innerHeight) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
}

/* 滚动到顶部 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* ============================
   测试数据（如果没有JSON文件）
   ============================ */
function getTestSpells() {
    return [
        {
            id: "fireball",
            name: "火球术",
            nameEn: "Fire Ball",
            level: 3,
            school: "塑能",
            classes: ["法师", "术士", "邪术师"],
            castingTime: "1动作",
            range: "150尺",
            components: {
                verbal: true,
                somatic: true,
                material: true,
                materialDesc: "一块蝙蝠粪和硫磺"
            },
            duration: "瞬时",
            description: "你指着一个点，并随着一声低吼迸成一片烈焰。目标点周围半径20尺球状区域内的每个生物必须进行一次敏捷豁免。豁免失败者将受到8d6点火焰伤害，豁免成功则伤害减半。区域内所有未被着装或携带的可燃物件会开始燃烧。",
            higherLevel: "使用的法术位每比3环高一环，此伤害就增加1d6。",
            source: "玩家手册 第241页"
        },
        {
            id: "magic-missile",
            name: "魔法飞弹",
            nameEn: "Magic Missile",
            level: 1,
            school: "塑能",
            classes: ["法师", "术士"],
            castingTime: "1动作",
            range: "120尺",
            components: {
                verbal: true,
                somatic: true,
                material: false
            },
            duration: "瞬时",
            description: "你创造出数枚闪光飞弹。每枚飞弹对目标造成1d4+1点力场伤害。你创造的飞弹数量等于1+你使用的法术位环数（最大4枚）。每枚飞弹可以指向同一个或不同的目标。",
            higherLevel: "使用2环或更高环数的法术位施展此法术时，你每升1环就多创造1枚飞弹。",
            source: "玩家手册 第257页"
        },
        {
            id: "shield",
            name: "护盾术",
            nameEn: "Shield",
            level: 1,
            school: "防护",
            classes: ["法师", "术士"],
            castingTime: "1反应",
            range: "自身",
            components: {
                verbal: true,
                somatic: true,
                material: false
            },
            duration: "直到当前回合结束",
            description: "你通过神秘力量制造一个隐形的力场护盾保护自己。直到你的下个回合开始前，你的AC获得+5加值，并且你能够免疫魔法飞弹的伤害。",
            source: "玩家手册 第275页"
        }
    ];
}
