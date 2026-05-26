const fs = require('fs');
const files = [
    'd:\\桌面\\idiom\\idioms.json',
    'd:\\桌面\\idiom\\src\\data\\idioms.json',
    'd:\\桌面\\idiom\\public\\idioms.json'
];

files.forEach(filePath => {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const idioms = JSON.parse(rawData);

    let updated = false;
    idioms.forEach(idiom => {
        if (idiom.idiom === '表征') {
            idiom.category = '代替、代指某物';
            updated = true;
            console.log(`✅ 已更新 ${filePath} 中的“表征”分类！`);
        }
    });

    if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2), 'utf-8');
    }
});

console.log('🎉 所有文件更新完成！');
