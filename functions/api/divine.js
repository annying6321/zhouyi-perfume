// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
// Cloudflare Pages Function：接收卦名+爻位+问题，调用 DeepSeek API 生成文案
import knowledgeBase from "../data/hexagrams.json" with { type: "json" };
import colorSchemes from "../data/colorSchemes.json" with { type: "json" };

export async function onRequest(context) {
  const { request, env } = context;
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

请严格依据以上爻辞经典原文的含义，按以下格式输出纯净内容，不要加任何额外说明或标题括号：

香气关键词：3个词组，每个为「形容词+名词」，用·分隔

（空一行后直接写以下两段内容，不要加任何标题或序号。两段之间用空行隔开）

以一个具体的嗅觉场景开头，如「如同……」「仿佛……」等。用通感将卦象核心意境转化为可感知的气味体验。只写感官世界，不直接解释易经。结尾留有余韵。约100-150字。

针对「${question}」给出建议。语气温柔而有力量。先分析处境，再给核心启示，最后是具体行动建议。多用「此时宜……」「不妨……」「若……则……」。约120-180字。

核心原料（3-4种真实制香原料，每种一行，括号内解释与卦爻意蕴的联结）：
原料名（一句话解释）
原料名（一句话解释）

香水推荐（2款真实存在的知名品牌香水，前中后调准确）：
品牌：真实品牌名
香水名：真实香水名
前调：真实前调
中调：真实中调
后调：真实后调

品牌：第二款
香水名：
前调：
中调：
后调：

【配色：最匹配的配色方案名称】

要求：
- 香气隐喻只写感官，不说道理
- 运势解析精准呼应卦爻与用户问题
- 核心原料必须是真实存在于调香工业中的原料，禁止编造
- 香水推荐必须是真实存在的品牌和香水
- 输出纯文本，不要使用【】包裹任何段落标题（仅配色标签用【】）`;

  // 调用 DeepSeek API（流式返回）
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
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
