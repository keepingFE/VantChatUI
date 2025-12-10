#!/usr/bin/env node

/**
 * 发布前检查脚本
 * Pre-publish check script
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

console.log('🔍 开始发布前检查...\n');

let hasError = false;

// 检查必需文件
const requiredFiles = [
  'dist/chatvant.es.js',
  'dist/chatvant.umd.js',
  'dist/chatvant.css',
  'README.md',
  'LICENSE',
  'package.json'
];

console.log('📁 检查必需文件...');
requiredFiles.forEach(file => {
  const filePath = resolve(rootDir, file);
  if (existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - 文件不存在！`);
    hasError = true;
  }
});

// 检查 package.json 配置
console.log('\n📦 检查 package.json 配置...');
const pkg = await import('../package.json', { with: { type: 'json' } });
const pkgData = pkg.default;

const requiredFields = {
  name: '包名',
  version: '版本号',
  description: '描述',
  main: '主入口',
  module: 'ES Module 入口',
  license: '许可证',
  keywords: '关键词'
};

Object.entries(requiredFields).forEach(([field, label]) => {
  if (pkgData[field]) {
    console.log(`  ✅ ${label} (${field}): ${Array.isArray(pkgData[field]) ? pkgData[field].join(', ') : pkgData[field]}`);
  } else {
    console.log(`  ❌ ${label} (${field}) - 缺失！`);
    hasError = true;
  }
});

// 检查 peerDependencies
console.log('\n🔗 检查 peerDependencies...');
if (pkgData.peerDependencies) {
  Object.entries(pkgData.peerDependencies).forEach(([dep, version]) => {
    console.log(`  ✅ ${dep}: ${version}`);
  });
} else {
  console.log('  ⚠️  未定义 peerDependencies');
}

// 检查仓库信息
console.log('\n📍 检查仓库信息...');
if (pkgData.repository) {
  console.log(`  ✅ 仓库类型: ${pkgData.repository.type}`);
  console.log(`  ✅ 仓库地址: ${pkgData.repository.url}`);
  
  if (pkgData.repository.url.includes('your-username')) {
    console.log('  ⚠️  警告: 仓库地址包含占位符 "your-username"，请更新为实际地址');
  }
} else {
  console.log('  ⚠️  未定义仓库信息');
}

// 总结
console.log('\n' + '='.repeat(50));
if (hasError) {
  console.log('❌ 检查失败！请修复上述错误后再发布。');
  process.exit(1);
} else {
  console.log('✅ 所有检查通过！可以发布了。');
  console.log('\n📝 发布命令:');
  console.log('   npm publish');
  console.log('   或');
  console.log('   npm publish --access public  (如果是作用域包)');
  process.exit(0);
}
