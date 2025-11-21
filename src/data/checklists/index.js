// 导出所有清单文件
// 注意：微信小程序不支持 require.context，所以需要手动导入
// 添加新清单文件时，请在此文件中添加对应的 import 语句

// 导入所有清单文件
// 从 long 文件夹导入
import movies from './long/movies.js'
import my101Flaws from './long/my-101-flaws.js'
import xiaohongshuLife100 from './long/xiaohongshu-life-100.js'
import xiaohongshuSelfDiscipline from './long/xiaohongshu-self-discipline.js'
import xiaohongshuSelfCare from './long/xiaohongshu-self-care.js'
import alone100 from './long/alone-100.js'
import completed from './long/life-dream-completed.js'
import first80 from './long/first-80.js'
import growth100days from './long/growth-100days.js'
import happiness100 from './long/happiness-100.js'
import life2025must from './long/life-2025-must.js'
import lifeexperience from './long/life-experience.js'
import mustdo2025 from './long/must-do-2025.js'
import noscreen100 from './long/no-phone-100.js'

// 从 short 文件夹导入
import artLife from './short/art-life.js'
import behaviorAbnormal from './short/behavior-abnormal.js'
import bodyReflex from './short/body-reflex.js'
import dailyTexture from './short/daily-texture.js'
import emotionStorm from './short/emotion-storm.js'
import foodMemories from './short/food-memories.js'
import life100 from './short/life-100.js'
import lifeChaos from './short/life-chaos.js'
import loveBrain from './short/love-brain.js'
import mentalBreakdown from './short/mental-breakdown.js'
import selfManagement from './short/self-management.js'
import smallHappiness from './short/small-happiness.js'
import smallThing from './short/small-thing.js'
import socialAnxiety from './short/social-anxiety.js'
import socialDeath from './short/social-death.js'
import techBetrayal from './short/tech-betrayal.js'
import travelStories from './short/travel-stories.js'
import workGrowth from './short/work-growth.js'
import xiaohongshuTravel from './short/xiaohongshu-travel.js'
import xiaohongshuStudy from './short/xiaohongshu-study.js'
import xiaohongshuLove from './short/xiaohongshu-love.js'
import cultivate2025 from './short/cultivate-2025.js'
import girl100 from './short/girl-100.js'
import introvert from './short/i-people.js'
import my100 from './short/my-100.js'
import self108 from './short/self-108.js'

// 所有清单主题列表
const allThemes = [
  life100,
  my101Flaws,
  alone100,
  completed,
  first80,
  growth100days,
  happiness100,
  life2025must,
  lifeexperience,
  mustdo2025,
  noscreen100,
  cultivate2025,
  girl100,
  introvert,
  my100,
  self108,
  xiaohongshuLife100,
  lifeChaos,
  xiaohongshuSelfDiscipline,
  xiaohongshuTravel,
  xiaohongshuStudy,
  xiaohongshuLove,
  xiaohongshuSelfCare,
  smallHappiness,
  smallThing,
  artLife,
  behaviorAbnormal,
  bodyReflex,
  dailyTexture,
  emotionStorm,
  foodMemories,
  loveBrain,
  mentalBreakdown,
  movies,
  selfManagement,
  socialAnxiety,
  socialDeath,
  techBetrayal,
  travelStories,
  workGrowth,
]

// 转换为对象（key 为 theme.id）
const themes = {}
const themesList = []

allThemes.forEach(theme => {
  const t = theme.default || theme
  if (t && t.id && t.name) {
    themes[t.id] = t
    themesList.push(t)
  }
})

// 按 allThemes 数组的顺序显示，不进行排序
// 如需调整顺序，请修改上面的 allThemes 数组顺序

console.log(`✅ 加载了 ${themesList.length} 个清单主题`)

// 导出所有主题对象（key-value 形式，用于通过 id 查找）
export default themes

// 导出为主题数组（用于首页展示）
export const themesArray = themesList

