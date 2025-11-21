// 导出所有清单文件
// 注意：微信小程序不支持 require.context，所以需要手动导入
// 添加新清单文件时，请在此文件中添加对应的 import 语句

// 导入所有清单文件
import artLife from './art-life.js'
import behaviorAbnormal from './behavior-abnormal.js'
import bodyReflex from './body-reflex.js'
import dailyTexture from './daily-texture.js'
import emotionStorm from './emotion-storm.js'
import foodMemories from './food-memories.js'
import life100 from './life-100.js'
import lifeChaos from './life-chaos.js'
import loveBrain from './love-brain.js'
import mentalBreakdown from './mental-breakdown.js'
import movies from './movies.js'
import my101Flaws from './my-101-flaws.js'
import selfManagement from './self-management.js'
import smallHappiness from './small-happiness.js'
import smallThing from './small-thing.js'
import socialAnxiety from './social-anxiety.js'
import socialDeath from './social-death.js'
import techBetrayal from './tech-betrayal.js'
import travelStories from './travel-stories.js'
import workGrowth from './work-growth.js'
import xiaohongshuLife100 from './xiaohongshu-life-100.js'
import xiaohongshuSelfDiscipline from './xiaohongshu-self-discipline.js'
import xiaohongshuTravel from './xiaohongshu-travel.js'
import xiaohongshuStudy from './xiaohongshu-study.js'
import xiaohongshuLove from './xiaohongshu-love.js'
import xiaohongshuSelfCare from './xiaohongshu-self-care.js'

// 所有清单主题列表
const allThemes = [
  life100,
  my101Flaws,
  lifeChaos,
  xiaohongshuLife100,
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
  workGrowth
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

