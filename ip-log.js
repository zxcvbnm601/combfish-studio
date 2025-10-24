window.onload = async function() {
  // 获取访客IP
  const ipRes = await fetch('https://api.ipify.org?format=json');
  const { ip } = await ipRes.json();

  // 拼接日志信息
  const logInfo = `${new Date().toLocaleString()}|${ip}|${window.location.href}\n`;

  // 你的仓库与令牌配置（已适配）
  const GITHUB_USERNAME = "zxcvbnm601";
  const REPO_NAME = "combfish-studio";
  const PERSONAL_TOKEN = "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"; // 务必替换为你的实际令牌

  // 调用GitHub API写入日志
  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/visitor-log.txt`;

  try {
    const fileRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${PERSONAL_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });
    const fileData = await fileRes.json();
    const newContent = btoa(fileData.content + logInfo);
    
    await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${PERSONAL_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: "Add visitor log",
        content: newContent,
        sha: fileData.sha
      })
    });

    if (window.location.search.includes("?admin=1")) {
      alert("IP记录成功！");
    }
  } catch (err) {
    console.error("记录失败：", err);
  }
};
