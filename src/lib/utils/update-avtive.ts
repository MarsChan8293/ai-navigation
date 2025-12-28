import { prisma } from "../db/db";

async function checkUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

export async function updateWebsiteActive() {
  try {
    const websites = await prisma.website.findMany({
      where: { status: "approved" },
      select: {
        id: true,
        url: true,
        title: true,
      },
    });

    console.log(`开始检查 ${websites.length} 个网站的可访问性`);

    for (const website of websites) {
      try {
        const isAlive = await checkUrl(website.url);
        await prisma.website.update({
          where: { id: website.id },
          data: { active: isAlive ? 1 : 0 },
        });
        console.log(
          `网站 [${website.title}] (ID: ${website.id}) 状态更新为 ${
            isAlive ? "可访问" : "不可访问"
          }`
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log(
            `更新网站 [${website.title}] (ID: ${website.id}) 状态失败: ${error.message}`
          );
        } else {
          console.log(
            `更新网站 [${website.title}] (ID: ${website.id}) 状态失败: 未知错误`
          );
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("所有网站检查完成");
  } catch (error) {
    if (error instanceof Error) {
      console.log("检查网站过程中发生错误:", error.message);
    } else {
      console.log("检查网站过程中发生未知错误");
    }
  } finally {
    await prisma.$disconnect();
  }
}
