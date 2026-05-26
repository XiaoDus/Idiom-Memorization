const fs = require('fs');

// 读取 idioms.json 文件
const rawData = fs.readFileSync('idioms.json', 'utf-8');
const idioms = JSON.parse(rawData);

console.log(`总共有 ${idioms.length} 个成语`);
console.log('='.repeat(50));

// 检查分类情况
let noCategoryCount = 0;
const noCategoryIdioms = [];

idioms.forEach((idiom, index) => {
    if (!idiom.category || idiom.category.trim() === '') {
        noCategoryCount++;
        noCategoryIdioms.push({
            index: index,
            idiom: idiom.idiom,
            meaning: idiom.meaning
        });
        // 给没有分类的成语添加默认分类
        idiom.category = "其他";
    }
});

if (noCategoryCount > 0) {
    console.log(`\n发现 ${noCategoryCount} 个没有分类的成语：\n`);
    noCategoryIdioms.forEach(item => {
        console.log(`- ${item.idiom} (索引: ${item.index})`);
    });
    
    // 保存修复后的文件
    fs.writeFileSync('idioms.json', JSON.stringify(idioms, null, 2), 'utf-8');
    console.log(`\n✅ 已修复！已给 ${noCategoryCount} 个成语添加了 "其他" 分类，更新文件保存成功！`);
    
    // 同时也更新其他位置的文件
    try {
        fs.writeFileSync('src/data/idioms.json', JSON.stringify(idioms, null, 2), 'utf-8');
        console.log('✅ src/data/idioms.json 也已更新！');
    } catch (e) {
        console.log('⚠️  无法更新 src/data/idioms.json');
    }
    
    try {
        fs.writeFileSync('public/idioms.json', JSON.stringify(idioms, null, 2), 'utf-8');
        console.log('✅ public/idioms.json 也已更新！');
    } catch (e) {
        console.log('⚠️  无法更新 public/idioms.json');
    }
} else {
    console.log('✅ 所有成语都有分类！');
}
