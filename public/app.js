
var stage = new PIXI.Stage(0x66FF99);

var renderer = PIXI.autoDetectRenderer(400, 300);
document.body.appendChild(renderer.view);

requestAnimFrame( animate );

// create a texture from an image path
var texture = PIXI.Texture.fromImage("/media/cat.jpg");
// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprites anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;

stage.addChild(bunny);

function animate() {

    requestAnimFrame( animate );
    // just for fun, lets rotate mr rabbit a little
    bunny.rotation += 0.1;
    renderer.render(stage);
}
