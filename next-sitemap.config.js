/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://demian.dev',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    // app directory 라우트를 직접 지정
    additionalPaths: async (config) => [
      await config.transform(config, '/'),          // 홈
      await config.transform(config, '/posts'),     // 포스트 목록
      // 아래처럼 동적으로 /posts/슬러그 형태라면...
      // await config.transform(config, '/posts/1'),  // (예시)
      // await config.transform(config, '/posts/2'),  // (예시)
    ],
  };