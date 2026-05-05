/* ============================
   跑团法术书 - 首页功能
   ============================ */

/* 跑团冷知识数据库（至少15条） */
const funFacts = [
    "在D&D中，'法术位'（Spell Slot）是施放法术的资源。法师需要准备法术并消耗法术位来施放，这模拟了施法者的精神和体力限制。",
    
    "D&D 5版中，法术分为'准备法术'和'已知法术'两种机制。法师、牧师、德鲁伊需要每日准备法术，而吟游诗人、术士、邪术师则直接知道一定数量的法术。",
    
    "法术成分包括三种：言语（V）、姿势（S）、材料（M）。材料成分通常需要价格低于25gp且不被消耗的物品，除非描述中明确说明会被消耗。",
    
    "法术环数（Spell Level）不等于角色等级。一个5级法师可以使用3环法术位施放1环法术'魔法飞弹'，并且可以使用更高环位的法术位来增强低环法术的效果。",
    
    "防护善恶（Protection from Good and Evil）是最实用的1环法术之一，为盟友提供对抗特定类型生物的加成，持续长达10分钟（集中）。",
    
    "隐形术（Invisibility）在D&D 5版中非常强大，因为只要施法者保持集中且不进行攻击，隐形状态就会持续。这使得潜行和战术机动变得极其有效。",
    
    "治疗真言（Cure Wounds）需要触碰目标，而治疗重伤（Healing Word）则是30尺远程法术。聪明的玩家会同时准备这两种治疗法术以应对不同情况。",
    
    "法师护甲（Mage Armor）为无甲目标提供13+敏捷调整值的AC，持续8小时。这是一个仪式法术，可以不消耗法术位施放（需要额外10分钟）。",
    
    "闪光尘（Glitterdust）是2环法术，会在一个10尺球状区域内覆盖闪烁尘埃，使区域内的生物致盲并显形（无法隐身）。这是反隐形的神技。",
    
    "许愿术（Wish）是最强大的9环法术，可以实现几乎任何效果。但使用许愿术复制其他法术后，你有33%的概率从此无法施放许愿术（除了复制法术的功能）。",
    
    "法术抗力（Spell Resistance）在D&D 5版中被简化了。现在只有少部分生物（如某些恶魔、魔鬼）具有'魔法抗性'特质，可以重骰被法术影响的骰子。",
    
    "延迟爆发火球（Delayed Blast Fireball）是法术被延迟施放的经典例子。法师可以设定法术在几轮后爆发，用于设置陷阱或协同攻击。",
    
    "法术书（Spellbook）是法师的重要道具。法师只能在升级时或花费时间和金钱研究新法术来添加到法术书中。丢失法术书对法师来说是灾难性的。",
    
    "仪式法术（Ritual Spells）可以不消耗法术位施放，但需要额外的10分钟施法时间。法师、牧师、德鲁伊等准备法术的职业可以施放仪式法术。",
    
    "法术的'集中'（Concentration）机制是D&D 5版的重要创新。许多强力法术需要施法者保持集中，如果在维持法术时受到伤害，需要进行体质豁免来维持集中。",
    
    "幻影之力（Phantasmal Force）是一个2环幻术法术，可以在目标脑海中创造幻象。因为幻象只在目标脑中，所以即使目标知道是幻术，仍然会受到真实伤害！",
    
    "死者复活（Raise Dead）可以复活死亡不超过10天的生物，但目标会失去1点体质（最高值降低，如果降到0则真正死亡）。这也是为什么许多冒险者会准备'转生术'作为后备方案。",
    
    "法术'预言术'（Divination）让法师可以获得一次'闪避骰'（Portent），在任意生物（包括自己）进行属性检定、攻击检定或豁免检定时，强制使用预言骰子结果。这是预言学派法师的核心能力。",
    
    "传送术（Teleportation）有多种版本：2环的'传送术'（Teleportation Circle）需要10分钟施法时间和法阵，而7环的'传送术'（Teleport）可以瞬间将整个队伍传送到已知地点！",
    
    "法术'限时愿望'（Limited Wish）在早期的D&D版本中存在，但在5版中被简化为'许愿术'。许愿术是游戏中唯一可以实现'复活已死角色'、'创造魔法物品'等极端效果的法术。"
];

/* 当前冷知识索引 */
let currentFunFactIndex = -1;

/* ============================
   冷知识功能
   ============================ */

/* 显示下一个冷知识（带淡入淡出动画） */
function showNextFunFact() {
    const contentEl = document.getElementById('funfact-content');
    const cardEl = document.getElementById('funfact-card');
    
    if (!contentEl || !cardEl) return;
    
    /* 淡出动画 */
    cardEl.style.opacity = '0';
    cardEl.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        /* 随机选择冷知识（避免连续重复） */
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * funFacts.length);
        } while (newIndex === currentFunFactIndex && funFacts.length > 1);
        
        currentFunFactIndex = newIndex;
        contentEl.textContent = funFacts[currentFunFactIndex];
        
        /* 淡入动画 */
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'translateY(0)';
    }, 300);
}

/* 初始化冷知识 */
function initFunFacts() {
    /* 显示第一个冷知识 */
    showNextFunFact();
    
    /* 每30秒自动更换 */
    setInterval(showNextFunFact, 30000);
    
    /* 初始动画 */
    const cardEl = document.getElementById('funfact-card');
    if (cardEl) {
        cardEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
}

/* ============================
   返回顶部功能
   ============================ */

/* 滚动到顶部（平滑） */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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

/* ============================
   Toast提示功能（Stat Block风格）
   ============================ */

/* 显示Toast提示 */
function showToast(message, duration = 3000) {
    /* 移除已存在的Toast */
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    /* 创建Toast元素 */
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    /* 添加到页面 */
    document.body.appendChild(toast);
    
    /* 动画结束后移除 */
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);
}

/* ============================
   页面初始化
   ============================ */

/* DOM加载完成后初始化 */
document.addEventListener('DOMContentLoaded', function() {
    /* 初始化冷知识 */
    initFunFacts();
    
    /* 监听滚动事件（返回顶部按钮） */
    window.addEventListener('scroll', toggleBackToTopButton);
    
    /* 初始检查返回顶部按钮状态 */
    toggleBackToTopButton();
    
    console.log('跑团法术书 - 首页已加载');
    console.log('冷知识数量：' + funFacts.length);
});

/* ============================
   工具函数
   ============================ */

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

/* 节流函数 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
