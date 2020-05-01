var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

ctx.fillStyle = "#DDDDDD";//加载中动画
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.fillStyle = "#555555";
ctx.font = "50px verdana";
ctx.fillText("Loading...",70,250);
ctx.fillStyle = "#999999";
ctx.font = "40px verdana";
ctx.fillText("Flappy Bird",70,400);
ctx.font = "30px verdana";
ctx.fillText("By John Chen",80,500);

var speed = 2;//背景移动速度
var START = false;//开始标签
var DEAD = false;//死亡标签
var score = 0;//分数

var backGround = new Image();//背景图片
backGround.src = "img/background.png";

var land = new Image();//地面图片
land.src = "img/land.png";

var penUp = new Image();//上铅笔
penUp.src = "img/pie_up.png";

var penDown = new Image();//下铅笔
penDown.src = "img/pie_down.png";

var startButton = new Image();//开始按钮
startButton.src = "img/start_button.png";

var bird = new Image();//小鸟图片
bird.src = "img/bird.png";

var birdUp = new Image();//小鸟图片
birdUp.src = "img/bird_up.png";

var birdDown = new Image();//小鸟图片
birdDown.src = "img/bird_down.png";

setInterval(function () {//加载完毕
    drawBackGround();//绘制背景
    if (!START) {//未开始
        drawStartButton();//未开始绘制开始按钮
    } else if (DEAD) {//死亡后
        drawPencil();
        drawBird();
        deadShow();//死亡后提示信息
    } else {//游戏中
        drawPencil();//游戏中绘制铅笔
        drawBird();//游戏中绘制小鸟
        drawScore();
    }
    drawLand();//绘制地面
}, 16);

var bgx = 0;//bgx记录背景的x坐标
function drawBackGround() {
    if (!DEAD) bgx -= speed;//背景向左移动
    if (bgx <= (-400)) bgx += 400;
    ctx.drawImage(backGround, bgx, 0);//画出背景
    ctx.drawImage(backGround, bgx + 390, 0);

}

function drawLand() {//绘制地面
    ctx.drawImage(land, 0, 555);
}

var pen1y = parseInt(Math.random() * 300 + 100);//pen1始终为左侧铅笔
var pen2y = parseInt(Math.random() * 300 + 100);//pen2始终为右侧铅笔
var pen1x = 500;
var pen2x = 500 + canvas.width / 2;

function drawPencil() {//绘制两对铅笔
    if (!DEAD) {//游戏中
        pen1x -= speed;
        pen2x -= speed;
    }
    if (pen1x <= (-penUp.width)) {//铅笔从左侧离开画布，重生铅笔pen2
        pen1x = pen2x;
        pen1y = pen2y;
        pen2x = canvas.width;
        do {
            pen2y = parseInt(Math.random() * 300 + 100);
        } while (Math.abs(pen2y - pen1y) > 200);
        console.log("新的铅笔@" + pen2y);
    }
    if ((pen1x - penUp.width / 2 + 5) <= 100 && (pen1x - penUp.width / 2 + 5) > (100 - speed)) {//加分
        score++;
        console.log("分数：" + score);
    }
    ctx.drawImage(penUp, pen1x, pen1y - 490);
    ctx.drawImage(penDown, pen1x, pen1y + 70);
    ctx.drawImage(penUp, pen2x, pen2y - 490);
    ctx.drawImage(penDown, pen2x, pen2y + 70);
}

function drawStartButton() {//在画面中间绘制开始按钮,游戏未开始
    ctx.fillStyle = "#666666";
    ctx.font = "50px verdana";
    ctx.fillText("Flappy Bird", 40, 120);
    ctx.fillStyle = "#888888"
    ctx.fillRect(canvas.width / 2 - 40, canvas.height / 2 - 40, 80, 80);
    ctx.drawImage(startButton, (canvas.width - startButton.width) / 2, (canvas.height - startButton.height) / 2);
}

function mouseClick(e) {//鼠标点击事件
    if (!START) {//未开始时点击开始游戏
        START = true;
        return;
    } else if (DEAD) {//死亡后
        return;
    } else {//游戏时点击升高小鸟
        birdToy -= 70;
    }

}

var birdx = 100;//鸟的x坐标不变
var birdy = 300;//鸟的现在高度
var birdToy = 300;//鸟的目标高度
var birdImgNum = 0;

function drawBird() {//绘制小鸟
    if (!DEAD) {//游戏中
        birdToy += 2;
        if (birdy - birdToy >= 5) birdy -= 5;//过低升高
        else if (birdToy - birdy >= 5) birdy += 5;//过高降低
        else birdy = birdToy;
    }
    if (birdImgNum < 6 || DEAD) {
        ctx.drawImage(birdUp, birdx, birdy);//绘制小鸟1
    } else if (birdImgNum < 12) {
        ctx.drawImage(bird, birdx, birdy);//绘制小鸟2
    } else {
        ctx.drawImage(birdDown, birdx, birdy);//绘制小鸟3
    }
    birdImgNum++;
    if (birdImgNum >= 18) birdImgNum = 0;

    if (birdy > 530) {//过低死亡
        DEAD = true;
        console.log("碰到地面");
    } else if (birdy < -10) {//过高死亡
        DEAD = true;
        console.log("碰到天空");
    } else if (checkImpact(pen1x + penUp.width / 2 - 5, pen1y - 490, 10, penUp.height - 5, birdx, birdy, bird.width, bird.height)) {
        DEAD = true;//碰到铅笔死亡
        console.log("碰到上铅笔");
    } else if (checkImpact(pen1x + penDown.width / 2 - 5, pen1y + 75, 10, penDown.height, birdx, birdy, bird.width, bird.height)) {
        DEAD = true;
        console.log("碰到下铅笔");
    }
}

function deadShow() {//死亡后显示信息
    ctx.fillStyle = "#000000";
    ctx.font = "50px verdana";
    ctx.fillText("You are dead.", 20, 220);
    ctx.fillStyle = "#666666";
    ctx.fillText("scored " + ((score > 1) ? (score - 1) : 0), 70, 400)
}

function checkImpact(ax, ay, aw, ah, bx, by, bw, bh) {//检查两物体是否碰撞
    if ((Math.max(ax, bx) <= Math.min(ax + aw, bx + bw)) && (Math.max(ay, by) <= Math.min(ay + ah, by + bh))) return true;
    else return false;
}

function drawScore() {//写分数
    ctx.fillStyle = "#666666";
    ctx.font = "20px verdana";
    ctx.fillText("Score:" + score, 5, 25);
}