// scripts/print-lan-url.mjs
// 打印当前电脑可供手机访问的局域网 URL。
// 只使用 Node.js 内置模块，无需额外依赖。
// 用法：node scripts/print-lan-url.mjs
//       或   npm run mobile:url

import os from "os";

const port = process.env.PORT || 3000;

function getLanAddresses() {
  const interfaces = os.networkInterfaces();
  const results = [];

  for (const [, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      if (addr.family !== "IPv4") continue;
      if (addr.internal) continue;
      if (addr.address === "127.0.0.1") continue;
      if (addr.address.startsWith("169.254.")) continue;

      results.push(addr.address);
    }
  }

  // 私有局域网地址优先排序：192.168.x.x > 10.x.x.x > 172.16-31.x.x > 其他
  results.sort((a, b) => {
    const priority = (ip) => {
      if (ip.startsWith("192.168.")) return 0;
      if (ip.startsWith("10."))      return 1;
      const secondOctet = parseInt(ip.split(".")[1], 10);
      if (ip.startsWith("172.") && secondOctet >= 16 && secondOctet <= 31) return 2;
      return 3;
    };
    return priority(a) - priority(b);
  });

  // 去重
  return [...new Set(results)];
}

const addresses = getLanAddresses();
const line = "=".repeat(50);

console.log("\n" + line);
console.log("📱 手机预览地址\n");

if (addresses.length === 0) {
  console.log("❌ 未检测到局域网 IP 地址\n");
  console.log("请检查：");
  console.log("  1. 电脑是否已连接 Wi-Fi（而非仅有线网络）");
  console.log("  2. 网络连接是否正常\n");
  console.log("手动查询命令：");
  console.log("  Mac:     ipconfig getifaddr en0");
  console.log("  Windows: ipconfig\n");
  console.log("查到 IP 后，手机打开：http://<IP>:" + port);
} else {
  console.log("请确认：");
  console.log("  1. 电脑和手机连接 同一个 Wi-Fi");
  console.log("  2. dev server 使用 npm run dev:lan 启动");
  console.log("  3. 手机浏览器打开下面的网址\n");

  if (addresses.length === 1) {
    console.log("  http://" + addresses[0] + ":" + port);
  } else {
    console.log("检测到多个可用地址：");
    addresses.forEach((ip, i) => {
      const suffix = i === 0 ? "  ← 优先尝试" : "";
      console.log("  " + (i + 1) + ". http://" + ip + ":" + port + suffix);
    });
  }

  console.log("\n如果打不开：");
  console.log("  - 检查手机和电脑是否在同一个 Wi-Fi");
  console.log("  - 检查 Mac/Windows 防火墙是否允许 Node.js 入站连接");
  console.log("  - 确认终端正在运行 npm run dev:lan（不是 npm run dev）");
  console.log("  - 公司/学校 Wi-Fi 可能禁止局域网互访");
}

console.log(line + "\n");
