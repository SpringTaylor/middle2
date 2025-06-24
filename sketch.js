let defaultImg, wImg, aImg, sImg, dImg;
let currentImg;
let bgImg, topImg;
let img01, bgImg2, img010, img03, img04, img05, img06, img07, img08, img09, img011, img012, img013;
let img06Width, img06Height;
let alpha01 = 0;
let alpha03 = 0;
let alpha04 = 0;
let alpha05 = 0;
let alpha07 = 0;
let fadeOut01 = false;
let startFadeOut04 = false;
let startFadeOut05 = false;

let start06Time = null;
let show06 = false;
let hide06 = false;
let show08 = false;
let img06X = 2060;
let img06Y = 560;

let cols = 7;
let spacingX = 300;
let spacingY = 60;
let horizontalLines = [];
let verticalLines = [];
let moveSpeed = 4;
let vanishingPoint;
let cutoffY;
let extension = 30;
let displayTop = 500;
let displayBottom = 1080;

// 弹窗控制
let showPopup = false;
let popupScale = 0;
let popupAnimating = false;
let hidePopup = false;
let img011FullyShownTime = null;

// 新增控制013.png
let showImg013 = false;

function preload() {
  defaultImg = loadImage('wasd2.png');
  wImg = loadImage('W2.png');
  aImg = loadImage('A2.png');
  sImg = loadImage('S2.png');
  dImg = loadImage('D2.png');

  bgImg = loadImage('3.2.png');
  bgImg2 = loadImage('02.png');
  img010 = loadImage('010.png');
  img011 = loadImage('011.png');
  img012 = loadImage('012.png');
  img013 = loadImage('013.png'); // ✅ 新增图片加载
  img09 = loadImage('09.png'); // ✅ 新增09.png

  topImg = loadImage('3g.2.png');

  img01 = loadImage('01.png');
  img03 = loadImage('03.png');
  img04 = loadImage('04.png');
  img05 = loadImage('05.png');
  img07 = loadImage('07.png');
  img08 = loadImage('08.png');

  img06 = loadImage('06.png', () => {
    let aspect = img06.width / img06.height;
    img06Height = 300;
    img06Width = img06Height * aspect;
  });
}

function setup() {
  createCanvas(1920, 1080);
  currentImg = defaultImg;
  vanishingPoint = createVector(width / 2, 360);
  cutoffY = height / 2;
  initGrid();
}

function initGrid() {
  horizontalLines = [];
  verticalLines = [];
  for (let y = height; y >= vanishingPoint.y; y -= spacingY) {
    horizontalLines.push(y);
  }
  for (let i = 0; i < cols; i++) {
    let x = width / 2 - ((cols - 1) / 2) * spacingX + i * spacingX;
    verticalLines.push(x);
  }
}

function draw() {
  background(255);

  if (alpha01 > 0) {
    image(bgImg2, 0, 0, width, height);
  } else {
    image(bgImg, 0, 0, width, height);
  }

  stroke(178, 178, 178);
  drawVerticalLines();
  updateAndDrawHorizontalLines();
  image(currentImg, 0, 0, width, height);

  // 01.png 渐入
  if (!fadeOut01 && alpha01 < 255) {
    alpha01 += 2;
  } else if (fadeOut01 && alpha01 > 0) {
    alpha01 -= 5;
  }
  tint(255, alpha01);
  image(img01, 0, 0, width, height);
  noTint();

  // 04.png
  if (fadeOut01 && !startFadeOut04 && alpha04 < 255) {
    alpha04 = 255 - alpha01;
  }
  if (alpha04 >= 255 && !startFadeOut04) {
    startFadeOut04 = true;
  }
  if (startFadeOut04 && alpha04 > 0) {
    alpha04 -= 3;
  }
  if (alpha04 > 0) {
    tint(255, alpha04);
    image(img04, 0, 0, width, height);
    noTint();
  }

  // 05.png
  if (startFadeOut04 && alpha04 < 255 && !startFadeOut05) {
    alpha05 = 255 - alpha04;
    if (alpha05 >= 255) {
      alpha05 = 255;
      startFadeOut05 = true;
    }
  }
  if (startFadeOut05 && alpha05 > 0) {
    alpha05 -= 3;
  }
  if (alpha05 > 0) {
    tint(255, alpha05);
    image(img05, 0, 0, width, height);
    noTint();
  }

  // 03 与 07
  if (!show06 && alpha03 < 255) {
    alpha03 += 2;
  }
  if (show06 && alpha03 > 0) {
    alpha03 -= 2;
    alpha07 += 2;
    if (alpha07 > 255) alpha07 = 255;
  }
  if (alpha03 > 0) {
    tint(255, alpha03);
    image(img03, 0, 0, width, height);
    noTint();
  }
  if (alpha07 > 0) {
    tint(255, alpha07);
    image(img07, 0, 0, width, height);
    noTint();

    if (img07 === img011 && alpha07 === 255 && img011FullyShownTime === null) {
      img011FullyShownTime = millis();
    }
  }

  // 控制06
  if (alpha05 <= 0 && startFadeOut05 && start06Time === null) {
    start06Time = millis();
  }
  if (start06Time !== null && millis() - start06Time > 2000) {
    show06 = true;
  }
  if (show06 && img06X > 1000) {
    img06X -= 5;
    if (img06X < 1000) img06X = 1000;
  }
  if (show06 && !hide06 && img06Width && img06Height) {
    image(img06, img06X, img06Y - img06Height / 2, img06Width, img06Height);
  }

  if (show08 && img06Width && img06Height) {
    image(img08, img06X, img06Y - img06Height / 2, img06Width, img06Height);
  }

  image(topImg, 0, 0, width, height);

  // 弹窗逻辑
  if (img011FullyShownTime && millis() - img011FullyShownTime > 2000 && !showPopup) {
    showPopup = true;
    popupAnimating = true;
    popupScale = 0;
  }

  if (showPopup) {
    if (popupAnimating && !hidePopup && popupScale < 1) {
      popupScale += 0.05;
    } else if (hidePopup && popupScale > 0) {
      popupScale -= 0.05;
      if (popupScale <= 0) {
        showPopup = false;
        popupAnimating = false;
        showImg013 = true; // ✅ 弹窗消失后显示013.png
      }
    }

    if (popupScale > 0) {
      push();
      imageMode(CENTER);
      translate(width / 2, height / 2);
      scale(popupScale);
      image(img012, 0, 0, width, height);
      pop();
    }
  }

  // ✅ 013.png 最上层显示
  if (showImg013) {
    image(img013, 0, 0, width, height);
  }
}

function drawVerticalLines() {
  for (let x of verticalLines) {
    let dx = vanishingPoint.x - x;
    let dy = vanishingPoint.y - height;
    let ratio = (cutoffY - height) / dy;
    let cutoffX = x + dx * ratio;
    let cutoffYLine = height + dy * ratio;
    let extendedY = cutoffYLine + extension;
    if (extendedY >= displayTop && height <= displayBottom) {
      line(x, height, cutoffX, extendedY);
    }
  }
}

function updateAndDrawHorizontalLines() {
  if (keyIsDown(83)) {
    for (let i = 0; i < horizontalLines.length; i++) {
      horizontalLines[i] += moveSpeed;
    }
    if (horizontalLines[0] > height) {
      horizontalLines.push(horizontalLines.shift() - (horizontalLines.length - 1) * spacingY);
    }
  }
  if (keyIsDown(87)) {
    for (let i = 0; i < horizontalLines.length; i++) {
      horizontalLines[i] -= moveSpeed;
    }
    if (horizontalLines[horizontalLines.length - 1] < vanishingPoint.y) {
      horizontalLines.unshift(horizontalLines.pop() + (horizontalLines.length - 1) * spacingY);
    }
  }

  let visibleLines = horizontalLines.filter(y => y >= vanishingPoint.y && y <= height && y >= displayTop && y <= displayBottom);
  let minY = min(visibleLines);
  for (let y of visibleLines) {
    if (y === minY) continue;
    let shrink = map(y, height, vanishingPoint.y, 0, 1);
    let halfWidth = ((cols - 1) / 2) * spacingX;
    let left = lerp(width / 2 - halfWidth, vanishingPoint.x, shrink);
    let right = lerp(width / 2 + halfWidth, vanishingPoint.x, shrink);
    line(left, y, right, y);
  }
}

function keyPressed() {
  updateCurrentImage(key);
  if ((key === 'w' || key === 'W') && alpha03 >= 255) {
    fadeOut01 = true;
  }
}

function keyReleased() {
  if ('wasdWASD'.includes(key)) {
    currentImg = defaultImg;
  }
}

function updateCurrentImage(k) {
  switch (k.toLowerCase()) {
    case 's': currentImg = wImg; break;
    case 'a': currentImg = aImg; break;
    case 'w': currentImg = sImg; break;
    case 'd': currentImg = dImg; break;
  }
}

function mousePressed() {
  // 检测点击013.png的区域
  let distanceToCenter = dist(mouseX, mouseY, 660, 940);
  if (distanceToCenter <= 60 && showImg013) {
    showImg013 = false; // 点击区域内时隐藏013.png
    img08 = img09; // ✅ 013消失后更新08.png为09.png
  }

  if (mouseX >= 1000 && mouseX <= 1160 && mouseY >= 420 && mouseY <= 700) {
    hide06 = true;
    show08 = true;
    bgImg2 = img010;
    img07 = img011;
  }

  if (showPopup && !hidePopup && popupScale > 0) {
    if (
      mouseX >= 784 && mouseX <= 904 &&
      mouseY >= 737 && mouseY <= 857
    ) {
      hidePopup = true;
    }
  }
}
