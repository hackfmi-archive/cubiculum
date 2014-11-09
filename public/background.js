$(document).on('click', '#ask', function () {
	// search in wikipedia
	var input = $('#charInput').val();
	console.log(input);
});

// create an array of assets to load

var assetsToLoader = ["../media/room4.jpg", "../media/chairmini.png","../media/CharSmallState1.png", "../media/CharSmallState2.png", "../media/enemy.jpeg", "../media/dialog.jpeg"];

// create a new loader
loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = onAssetsLoaded;

//begin load
loader.load();

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF, true);

// create a renderer instance
var renderer = new PIXI.autoDetectRenderer(1024, 640);

// set the canvas width and height to fill the screen
//renderer.view.style.display = "block";
renderer.view.style.width = "1024px"
renderer.view.style.height = "640px"

// add render view to DOM
document.body.appendChild(renderer.view);

var postition = 0;
var background;
var chair;
var player;
var enemies = [];
var dialog = {};

function onAssetsLoaded()
{
	var backgroundTexture = PIXI.Texture.fromImage("media/room4.jpg");
	background = new PIXI.Sprite(backgroundTexture);
	stage.addChild(background);

	background.interactive = true;

	background.click = function(data){
		var x = data.global.x;
		var y = data.global.y;

		if (x - player.position.x) {
			x -= player.width / 2;
		} else {
			x += player.width / 2;
		}

		if (y - player.position.y) {
			y -= player.height / 2;
		} else {
			y += player.height / 2;
		}

		var deltaX = x - player.position.x;
		var deltaY = y - player.position.y;

		requestAnimFrame(function() {
        	movePlayer(x, y, deltaX, deltaY, 0);
        });
	}

	var chairTexture = PIXI.Texture.fromImage("media/chairmini.png");
	chair = new PIXI.Sprite(chairTexture);
	stage.addChild(chair);

	chair.position.x = 100;
	chair.position.y = 300;

	var playerTexture = PIXI.Texture.fromImage("media/CharSmallState2.png");
	player = new PIXI.Sprite(playerTexture);
	stage.addChild(player);

	player.position.x = 200;
	player.position.y = 150;

	var enemyTexture = PIXI.Texture.fromImage("media/enemy.jpeg");

	var enemiesCount = 5;

	for (var i = 0; i < enemiesCount; i++) {
		enemies[i] = new PIXI.Sprite(enemyTexture);
		stage.addChild(enemies[i]);

		enemies[i].position.x = Math.floor(Math.random() * (700 - 200 + 1)) + 200;
		enemies[i].position.y = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
	};

	requestAnimFrame(animate);

	setTimeout(
		function(){
			var i = 2;
			var x = 400;
			var y = 400;

			initiateEnemyMove (x, y, i)
		},
		3000
	);

	setTimeout(
		function(){
			var i = 4;
			var x = 600;
			var y = 500;

			initiateEnemyMove (x, y, i)
		},
		7000
	);
}

function initiateEnemyMove (x, y, i) {
	if (x - enemies[i].position.x) {
		x -= enemies[i].width / 2;
	} else {
		x += enemies[i].width / 2;
	}

	if (y - enemies[i].position.y) {
		y -= enemies[i].height / 2;
	} else {
		y += enemies[i].height / 2;
	}

	var deltaX = x - enemies[i].position.x;
	var deltaY = y - enemies[i].position.y;

	requestAnimFrame(function() {
    	moveEnemy(x, y, deltaX, deltaY, 0, i);
    });
}

function detectNearCollision (x1, y1, width1, height1, x2, y2, width2, height2) {
	var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
	left1 = x1 - width1;
	right1 = x1 + width1;
	top1 = y1 - height1;
	bottom1 = y1 + height1;
	left2 = x2 - width2;
	right2 = x2 + width2;
	top2 = y2 - height2;
	bottom2 = y2 + height2;
	return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1);
}

function moveEnemy(x, y, deltaX, deltaY, turn, i) {
	if (turn % 50 === 0) {
		enemies[i].texture = PIXI.Texture.fromImage("media/enemy.jpeg");
	} else if (turn % 50 === 25){
		enemies[i].texture = PIXI.Texture.fromImage("media/CharSmallState1.png");
	}
	
	turn++;

	var absX = Math.abs(enemies[i].position.x - x);
	var absY = Math.abs(enemies[i].position.y - y);

	var centerX = enemies[i].position.x + enemies[i].width / 2;
	var centerY = enemies[i].position.y + enemies[i].height / 2;

	if (absX < 1 || absY < 1) {
		return;
	}

	enemies[i].position.x += deltaX / 100;
	enemies[i].position.y += deltaY / 100;

	requestAnimFrame(function() {
      	moveEnemy(x, y, deltaX, deltaY, turn, i);
    });

	renderer.render(stage);
}

function movePlayer(x, y, deltaX, deltaY, turn) {
	if (turn % 50 === 0) {
		player.texture = PIXI.Texture.fromImage("media/CharSmallState1.png");
	} else if (turn % 50 === 25){
		player.texture = PIXI.Texture.fromImage("media/CharSmallState2.png");
	}
	
	turn++;

	var absX = Math.abs(player.position.x - x);
	var absY = Math.abs(player.position.y - y);

	var centerX = player.position.x + player.width / 2;
	var centerY = player.position.y + player.height / 2;

	if (absX < 1 || absY < 1) {
		var closestIndex = -1;
		var minDistance = 5000;

		for (var i = 0; i < enemies.length; i++) {
			var centerEnemyX = enemies[i].position.x + enemies[i].width / 2;
			var centerEnemyY = enemies[i].position.y + enemies[i].height / 2;

			var areInCollision = detectNearCollision(centerX, centerY, player.width, player.height, centerEnemyX, centerEnemyY, enemies[i].width + 20, enemies[i].height + 20);
			if (areInCollision) {
				var distance = Math.sqrt(Math.abs(centerEnemyX - centerX) ^ 2 + Math.abs(centerEnemyY - centerY) ^ 2);
				if (distance < minDistance) {
					minDistance = distance;
					closestIndex = i;
				}
			}
		}

		for (var i = 0; i < enemies.length; i++) {
			if (i !== closestIndex) {
				stage.removeChild(dialog[i]);

				renderer.render(stage);
			}
		}

		var dialogTexture = PIXI.Texture.fromImage("media/dialog.jpeg");
		dialog[closestIndex] = new PIXI.Sprite(dialogTexture);
		stage.addChild(dialog[closestIndex]);

		dialog[closestIndex].width = 20;
		dialog[closestIndex].height = 20;
		dialog[closestIndex].position.x = enemies[closestIndex].position.x;
		dialog[closestIndex].position.y = enemies[closestIndex].position.y;

		dialog[closestIndex].interactive = true;

		dialog[closestIndex].click = function(data){
		    bootbox.dialog({
				message: "<input id='charInput' placeholder='Ask me...'/>" +
					"<button id='ask'> Ask </button>",
				title: "Custom title",
				buttons: {
					first: {
					  	label: "How are you?",
					  	className: "btn-primary",
					  	callback: function() {
					    	Example.show("great success");
					  	}
					},
					second: {
					  	label: "Are you going to blow the bomb?",
					  	className: "btn-primary",
					  	callback: function() {
					    	Example.show("uh oh, look out!");
					  	}
					},
					third: {
					  	label: "I like oranges!",
					  	className: "btn-primary",
					  	callback: function() {
					    	Example.show("Primary button");
				  		}
					},
					fourth: {
					  	label: "Bye!",
					  	className: "btn-primary",
					  	callback: function() {
					    	bootbox.hideAll();
				  		}
					}
				}
			});
		}

		renderer.render(stage);

		return;
	}

	player.position.x += deltaX / 100;
	player.position.y += deltaY / 100;

	requestAnimFrame(function() {
      	movePlayer(x, y, deltaX, deltaY, turn);
    });

	renderer.render(stage);
}

function animate() {

	// postition += 10;

	// player.position.x = -(postition * 0.6);
	// player.position.x %= 200 * 2;
	// if(player.position.x<0)player.position.x += 200 * 2;
	// player.position.x -= 200;

	// requestAnimFrame(animate);

     renderer.render(stage);
}
