// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
// 后端 API 路由：接收卦名+爻位+问题，调用 AI 生成文案
import fs from "fs";
import path from "path";

// 加载知识库数据
const dataPath = path.join(process.cwd(), "src/app/data/hexagrams.json");
const knowledgeBase = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 加载配色方案
const schemePath = path.join(process.cwd(), "public/colorSchemes.json");
const colorSchemes = JSON.parse(fs.readFileSync(schemePath, "utf-8"));

export async function POST(request) {
  const { hexagram, yao, question } = await request.json();

  // 从知识库查找该卦的数据
  const guaData = knowledgeBase.hexagrams.find((h) => h.name === hexagram);
  
  // 提取简称：如"乾为天"→"乾"、"水雷屯"→"屯"、"坎为水"→"坎"
  const shortName = hexagram.includes("为") 
    ? hexagram.split("为")[0] 
    : hexagram.slice(-1);
  
  // 简化爻位：如"初九"→"初"、"上六"→"上"
  const yaoSimple = yao.replace(/[九六]/g, "");
  
  // 拼装典据信息
  let classicRef = "";
  if (guaData) {
    classicRef = `
【经典原文参考】
卦名：《${guaData.name}》
卦辞：「${guaData.guaCi}」
象曰：「${guaData.guaXiang}」`;

    // 查找对应爻位
    const yaoData = guaData.yaos.find((y) => y.position === yao);
    if (yaoData) {
      classicRef += `
爻辞（${yaoData.position}）：「${yaoData.yaoCi}」
象曰（${yaoData.position}）：「${yaoData.yaoXiang}」`;
    }

    // 添加香型参考（仅供风格参考，不用作具体推荐）
    if (guaData.scentCategory) {
      classicRef += `
整体香型方向参考：${guaData.scentCategory}`;
    }

    // 添加爻位香气变奏规则
    const yaoIdx = parseInt(yao.replace(/[^0-9]/g, "")) - 1;
    if (yaoIdx >= 0 && yaoIdx < knowledgeBase.yaoAesthetics.length) {
      const rule = knowledgeBase.yaoAesthetics[yaoIdx];
      classicRef += `
爻位香气法则（${rule.position}）：${rule.meaning}。香气应偏向：${rule.scentDirection}，质地：${rule.intensity}。`;
    }
  }

  const systemPrompt = `你是一位精通《周易》和香水美学的占卜师。用户通过数字卦占卜，得到了卦象【${hexagram}】，爻位【${yao}】。用户的问题是：「${question}」。

${classicRef}

可选配色方案（根据文案气质选择最匹配的一个，无需考虑香型）：
${colorSchemes.map(s => `- ${s.name}（${s.mood}）`).join('\n')}

  请严格依据以上爻辞经典原文的含义，按以下顺序和格式输出内容。注意：直接输出内容，不要加「针对你的问题」「关于你的问题」等元叙述开头。

  输出顺序（每一块内容之间用两个换行分隔）：
  
  香气关键词：3个词组，每个为「形容词+名词」，中间用·符号连接。例如「清冽的晨风·温润的琥珀·苍劲的雪松」。
  
  香气隐喻：以一个具体的嗅觉场景开头，如「如同……」「仿佛……」等。用通感将卦象核心意境转化为可感知的气味体验，这个体验要贴近生活，真实可感。只写感官世界，不直接解释易经。结尾留有余韵。约100-120字。
  
  运势解析：语气温柔而有力量。先分析处境再给建议。不要用《周易》的原文，语言通俗易懂，多用「此时宜……」「不妨……」「若……则……」。约80-100字。
  
  核心原料：3-4种真实制香原料，每种一行。格式为「原料名（一句话解释）」。
  
  香水推荐：2款真实存在的知名品牌香水。每款格式为「品牌：真实品牌名」「香水名：真实香水名」「前调：」「中调：」「后调：」，各项单独一行。
  
  总要求：
  - 香气隐喻只写感官，不说道理
  - 运势解析直接写分析，不以任何元叙述开头
  - 核心原料必须是在调香工业中真实存在的原料，禁止编造
  - 香水推荐必须真实存在
  - 在所有内容输出完毕后，在最末尾单独一行用 【配色：名称】 注明最匹配的配色方案名称（例如【配色：烟雨酥青】）`;

  // 调用 DeepSeek API（流式返回）
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "请为我生成占卜解读。" },
      ],
      stream: true,
      temperature: 0.8,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    return new Response(
      `data: {"error":"AI 占卜服务暂时不可用 (${response.status})"}\n\ndata: [DONE]\n\n`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      }
    );
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
