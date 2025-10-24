window.onload = async function() {
  // 1. 自动获取访客IP
  const ipRes = await fetch('https://api.ipify.org?format=json');
  const { ip } = await ipRes.json();

  // 2. 收集访问信息（时间、IP、页面）
  const logInfo = {
    time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    ip: ip,
    page: window.location.href
  };

  // 3. 自动写入日志到仓库
  const githubApi = 'https://api.github.com/repos/zxcvbnm601/combfish-studio/contents/visitor-log.txt';
  await fetch(githubApi, {
    method: 'PUT',
    headers: {
      Authorization: 'token github_pat_118ZGf6YVjS4BlHcm2AXDs_ZALWdvEoChuI7j5ML0R7HXJqLuecRF1UTfJhvaLPLPGt65QvpI3Th3',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Add visitor log: ${ip}`,
      content: btoa(`${logInfo.time}|${logInfo.ip}|${logInfo.page}\n`),
      sha: await getFileSha()
    })
  });

  // 4. 管理员带?admin=1访问时弹窗提示
  if (window.location.search.includes('?admin=1')) {
    alert('IP记录成功！去仓库看visitor-log.txt');
  }
};

// 辅助函数：获取日志文件SHA值
async function getFileSha() {
  const res = await fetch('https://api.github.com/repos/zxcvbnm601/combfish-studio/contents/visitor-log.txt');
  const data = await res.json();
  return data.sha;
}
