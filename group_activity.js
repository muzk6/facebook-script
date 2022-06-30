/**
 * 在搜索结果页面爬取群组动态信息：
 Buying On A Budget!- Deals, Coupons, and Codes
 https://www.facebook.com/groups/buyingonbudgets/
 今日新帖：72篇
 上月发帖：944篇
 成员总数：12,454 人
 上周新增粉丝：+ 1,222
 创建时间：2018/4/1 07:39:46

 Deals and Codes Boutique💜❤️‍🔥
 https://www.facebook.com/groups/DealsandCodesBoutique/
 今日新帖：427篇
 上月发帖：10000篇
 成员总数：72,230 人
 上周新增粉丝：+ 172
 创建时间：2018/7/30 12:27:04
 * 执行位置，搜索结果页面：https://www.facebook.com/search/top/?q=50O57WBT
 */

javascript: (async (test = false) => {
    if (typeof (OUT_62BD46DFCF1A7) === 'undefined') {
        OUT_62BD46DFCF1A7 = ''
    }

    if (typeof (DOING_62BD46DFCF1A7) === 'undefined') {
        DOING_62BD46DFCF1A7 = false
    }

    if (DOING_62BD46DFCF1A7) {
        alert('脚本还没爬完，不要重复执行')
        return
    }

    DOING_62BD46DFCF1A7 = true
    if (test || !OUT_62BD46DFCF1A7) {
        let list = []
        document.querySelectorAll('a[href*="https://www.facebook.com/groups/"]').forEach(v => {
            if (v.closest('span') == null || v.closest('span').className !== 'nc684nl6') {
                return
            }

            const title = v.querySelector('span').textContent
            const href = /(?<href>https:\/\/www.*\/)\?/.exec(v.getAttribute('href'))['groups']['href']
            list.push({title, href})
        })

        const out = []
        if (confirm(`共计${list.length}个，继续爬详情按确定`)) {
            const oldTitle = document.title
            if (test) {
                list = list.slice(0, 1)
            }
            for (const [k, v] of Object.entries(list)) {
                document.title = `正在爬${k * 1 + 1}/${list.length}`
                const resp = await fetch(`${v.href}about`, {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,de;q=0.6,pt;q=0.5,fr;q=0.4,mt;q=0.3",
                        "cache-control": "max-age=0",
                        "upgrade-insecure-requests": "1",
                    },
                    "referrerPolicy": "origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include",
                })
                if (resp.ok) {
                    const text = await resp.text()
                    const act = /(?<act>"number_of_posts_in_last_day.*),"__module_operation_GroupsCometAboutFeedColumn_group__if_viewer_can_see_activity_section/.exec(text)['groups']['act']
                    const obj = JSON.parse(`{${act}}`)
                    const createTimeText = new Date(obj['created_time'] * 1000).toLocaleString()

                    out.push(`${v.title}\n${v.href}\n今日新帖：${obj['number_of_posts_in_last_day']}篇\n上月发帖：${obj['number_of_posts_in_last_month']}篇\n${obj['group_total_members_info_text']}\n${obj['group_new_members_info_text']}\n创建时间：${createTimeText}`)
                }
            }

            document.title = oldTitle
            OUT_62BD46DFCF1A7 = out.join(`\n\n`)
        }
    }

    if (OUT_62BD46DFCF1A7) {
        prompt('全部爬完，直接复制本弹出框内容即可', OUT_62BD46DFCF1A7)
    }

    DOING_62BD46DFCF1A7 = false
})()