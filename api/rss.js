const Parser = require("rss-parser");

const parser = new Parser();

module.exports = async (req, res) => {
  try {
    // 从环境变量获取默认 RSS 链接
    const defaultUrl = process.env.RSS_FEED_URL;

    // 如果请求中没有指定 url，使用默认值
    const { url = defaultUrl } = req.query;

    if (!url) {
      return res.status(400).json({ error: "RSS URL is required. Please set RSS_FEED_URL in environment variables or provide a 'url' query parameter." });
    }

    // 解析 RSS 数据
    const feed = await parser.parseURL(url);

    // 格式化返回结果
    const result = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items: feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item.contentSnippet || item.content,
      })),
    };

    // 返回 JSON 格式
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching RSS:", error);
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
};
