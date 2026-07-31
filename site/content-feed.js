window.socialAccount = {
  name: '劳有心获成长局',
  subtitle: '心理支持、成长服务与劳动实践内容',
  updateNote: '文章与视频持续同步更新',
};

window.socialPlatforms = [
  {
    platform: '小红书',
    account: '劳有心获成长局',
    handle: 'laoyouxinhuo',
    image: './assets/xiaohongshu-entry.jpg',
    note: '扫码进入小红书主页',
  },
  {
    platform: '抖音',
    account: '劳有心获成长局',
    handle: 'laoyouxinhuo',
    image: './assets/douyin-entry.jpg',
    note: '扫码进入抖音主页',
  },
];

// 每次新增文章或视频时，在数组中增加一项即可同步到网页内容区。
window.socialFeed = [
  {
    type: 'article',
    date: '2026-07-31',
    category: '科普文章',
    title: '从“发过传单”到“能写进简历”：经历翻译四步法',
    excerpt: '把劳动、志愿服务、学生工作、兼职和实习中的真实行动，转化为可识别、可表达的能力线索。',
    image: './assets/article-experience-cover.png',
    href: './articles/experience-translation/',
  },
  {
    type: 'article',
    date: '2026-07-29',
    category: '科普文章',
    title: 'AI把活儿都干完了，为什么我反而没成就感？',
    excerpt: '从宜家效应到人机协作，讨论怎样让 AI 帮你完成，而不是替你拿走参与感。',
    image: './assets/article-ai-cover.jpg',
    href: './articles/ai-achievement/',
  },
  {
    type: 'video',
    date: '2026-07-31',
    category: '科普视频',
    title: '经历翻译四步法｜网页视频版',
    excerpt: '把普通经历拆成任务、行动、结果和能力，留下可带走的成长证据。',
    poster: './assets/video-experience-poster.png',
    src: './media/experience-translation.mp4',
  },
  {
    type: 'video',
    date: '2026-07-31',
    category: '科普视频',
    title: '经历翻译四步法｜纸片人视频版',
    excerpt: '用纸片人叙事把经历翻译方法讲清楚，适合转发和课堂分享。',
    poster: './assets/video-paper-poster.jpg',
    src: './media/experience-translation-paper.mp4',
  },
  {
    type: 'poster',
    date: '2026-07-31',
    category: '劳动科普海报',
    title: '以青春之我，践劳动之美',
    excerpt: '从身边做起，从点滴做起，在劳动中收获成长。',
    image: './assets/labor-poster.jpg',
  },
];
