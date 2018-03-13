/**
 * @author liang(https://github.com/Mying666)
 * @description 写个会陪你玩五子棋的代码
 */
class fiveInRow {
    constructor () {
        this.wins = []            // 所有点对应的赢法号
        this.myWin = {}
        this.comWin = {}
        this.count = 0            // 统计赢法计数
        this.points = []          // 二维数组，标记每一个点的状态，0为空、1为人、2为电脑

        this.grid = 15            // 标准五子棋为15*15格
        this.box = document.getElementById('game')
        this.box.width = this.box.offsetWidth
        this.box.height = this.box.offsetHeight
        this.maxWidth = Math.min(this.box.offsetWidth, this.box.offsetHeight)
        this.interval = Math.floor(this.maxWidth / this.grid)
        this.ctx = this.box.getContext('2d');
        this.statistics()
        this.createCheckerboard()
        this.init()
        this.events()
        this.resize()
    }
    // 赢法统计
    statistics () {
        let me = this
        for(let i = 0; i < me.grid; i++) {
            me.wins[i] = []
            for(let j = 0; j < me.grid; j++) {
                me.wins[i][j] = {}
            }
        }
        
        // 遍历所有点，标记每个点对应的解法序号
        // 纵向
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    me.wins[i][j + k][this.count] = true
                }
                this.count++
            }
        }
        // 横向
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    me.wins[j + k][i][this.count] = true
                }
                this.count++
            }
        }
        // 正斜 \ 某点右下方
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    me.wins[i + k][j + k][this.count] = true
                }
                this.count++
            }
        }
        // 反斜 / 某点左上方
        for (let i = 0; i < 11; i++) {
            for (let j = 4; j < 15; j++) {
                for (let k = 0; k < 5; k++) {
                    me.wins[i + k][j - k][this.count] = true
                }
                this.count++
            }
        }
        
        // 再来一局需要重置
        for (let i = 0; i < me.count; i++) {
            me.myWin[i] = 0
            me.comWin[i] = 0
        }
        // console.log(me.wins, me.count, me.myWin, me.comWin)
    }

    init () {
        this.myTurn = true
        this.over = false
        this.initPoints()
        // console.log(this.points)
    }

    initPoints () {
        this.points = []
        let grid = this.grid
        for (let i = 0; i < grid; i++) {
            this.points[i] = [];
            for (let j = 0; j < grid; j++) {
                this.points[i][j] = 0;
            }
        } 
    }

    // 画棋盘部分
    createCheckerboard () {
        let me = this
        let bgImg = new Image();
        bgImg.src = "images/bg.jpg";
        bgImg.onload = function () {
            me.ctx.drawImage(bgImg, 0, 0, me.maxWidth, me.maxWidth);
            me.createGrid()
            // me.createChess(7, 7, false)
            // me.createChess(7, 6, true)
            // me.createChess(6, 7, true)
            // me.createChess(8, 7, true)
            // me.createChess(7, 8, true)
        }
    }
    createGrid () {
        let me = this
        let margin = me.interval / 2
        for (let i = 0; i < me.grid; i++) {
            me.ctx.beginPath();
            // 横
            me.ctx.moveTo(margin, margin + i * me.interval)
            me.ctx.lineTo((me.grid - 0.5) * me.interval, margin + i * me.interval)
            me.ctx.stroke()
            // 纵
            me.ctx.moveTo(margin + i * me.interval, margin)
            me.ctx.lineTo(margin + i * me.interval, (me.grid - 0.5) * me.interval)
            me.ctx.stroke()
            me.ctx.closePath();
        }
        me.createGridSign(3, 3)
        me.createGridSign(3, 11)
        me.createGridSign(11, 3)
        me.createGridSign(11, 11)
        me.createGridSign(7, 7)
    }
    createGridSign (i, j) {
        let me = this
        let margin = me.interval / 2
        me.ctx.beginPath();
        me.ctx.arc(margin + i * me.interval, margin + j * me.interval, 0.2 * margin, 0, 2 * Math.PI);
        me.ctx.closePath();
        me.ctx.fillStyle = '#333';
        me.ctx.fill();
    }

    /** 创建棋子
     * @param {number} i 
     * @param {number} j 
     * @param {boolen} myTurn 
     */
    createChess (i, j, myTurn) {
        let me = this
        let interval = me.interval
        let margin = interval / 2
        me.ctx.beginPath()
        me.ctx.arc(margin + i * interval, margin + j * interval, 0.9 * margin, 0, 2 * Math.PI)
        me.ctx.closePath()

        let color = me.ctx.createRadialGradient(margin + i * interval, margin + j * interval, 0.9 * margin, margin + i * interval + 5, margin + j * interval - 5, 5);
        //我方为黑子,对方为白子
        if (myTurn) {
            color.addColorStop(0, "#0A0A0A")
            color.addColorStop(1, "#636766")
        } else {
            color.addColorStop(0, "#D1D1D1")
            color.addColorStop(1, "#F9F9F9")
        }
        me.ctx.fillStyle = color
        me.ctx.fill()
    }

    events () {
        let me = this
        this.box.addEventListener('click', e => {
            if (me.over || !me.myTurn) {
                return
            }
            let x = e.offsetX,
                y = e.offsetY,
                i = Math.floor(x / this.interval),
                j = Math.floor(y / this.interval)
            if (me.points[i][j] === 0) {
                me.createChess(i, j, true)
                me.points[i][j] = 1

                // 遍历点击的点的赢法序号,人此序号赢法加一,电脑此赢法超出
                for (let n in me.wins[i][j]){
                    me.myWin[n]++
                    me.comWin[n] = 6
                    if (me.myWin[n] === 5) {
                        alert('大神你赢了')
                        me.over = true
                        return
                    }
                }
                if (!me.over) {
                    me.myTurn = false
                    me.comAi()
                }
            }
        })
    }

    /** 程序落子
     * @description 需要判断人和电脑分别将要完成那种赢法
     *              如果人要完成某种赢法则优先防守（在该赢法其他点上落子）
     *              如果电脑比人完成的多，则优先进攻（继续完成某种赢法）
     */
    comAi () {
        let me = this
        let myScore = [],
            comScore = [],
            max = 0,
            ci = 7,
            cj = 7
        for (let i = 0; i < 15; i++) {
            myScore[i] = []
            comScore[i] = []
            for (let j = 0; j < 15; j++) {
                myScore[i][j] = 0
                comScore[i][j] = 0
            }
        }
        // 遍历所有的点，找出最应该下子的点
        this.points.forEach((p, indexI) => {
            p.forEach((j,indexJ) => {
                if (j === 0) {
                    for (let n in me.wins[indexI][indexJ]) {
                        if (me.myWin[n] === 1) {
                            myScore[indexI][indexJ] += 10
                        } else if (me.myWin[n] === 2) {
                            myScore[indexI][indexJ] += 100
                        } else if (me.myWin[n] === 3) {
                            myScore[indexI][indexJ] += 1000
                        } else if (me.myWin[n] === 4) {
                            myScore[indexI][indexJ] = 10000
                        }

                        if (me.comWin[n] === 1) {
                            comScore[indexI][indexJ] += 11
                        } else if (me.comWin[n] === 2) {
                            comScore[indexI][indexJ] += 101
                        } else if (me.comWin[n] === 3) {
                            comScore[indexI][indexJ] += 1001
                        } else if (me.comWin[n] === 4) {
                            comScore[indexI][indexJ] += 10001
                        }
                    }
                    if (myScore[indexI][indexJ] > max) {
                        max = myScore[indexI][indexJ]
                        ci = indexI
                        cj = indexJ
                    } else if (myScore[indexI][indexJ] === max) {
                        if (comScore[indexI][indexJ] > comScore[ci][cj]) {
                            ci = indexI
                            cj = indexJ
                        }
                    }

                    if (comScore[indexI][indexJ] > max) {
                        max = comScore[indexI][indexJ]
                        ci = indexI
                        cj = indexJ
                    } else if (comScore[indexI][indexJ] === max) {
                        if (myScore[indexI][indexJ] > myScore[ci][cj]) {
                            ci = indexI
                            cj = indexJ
                        }
                    }
                }
            })
        })
        // 落子并标记
        me.createChess(ci, cj, false)
        me.points[ci][cj] = 2
        // 检查是否胜利
        for (let n in me.wins[ci][cj]){
            me.comWin[n]++
            me.myWin[n] = 6
            if (me.comWin[n] === 5) {
                alert('技术不到家，还得再练练！')
                me.over = true
                return
            }
        }
        if (!me.over) {
            me.myTurn = true
        }
    }

    resize () {
        let me = this
        window.addEventListener('resize', () => {
            me.box.width = me.box.offsetWidth
            me.box.height = me.box.offsetHeight
            me.maxWidth = Math.min(me.box.offsetWidth, me.box.offsetHeight)
            me.interval = Math.floor(me.maxWidth / me.grid)
            me.createCheckerboard()
        })
    }
}
new fiveInRow()
