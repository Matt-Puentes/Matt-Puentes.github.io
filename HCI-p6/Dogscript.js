var sceneEl;
var dog;
var food;
var dogWrapper;
var camera;
var ground;
var isWalking = false
var isEmoting = false
var foodOut = false
var targetingFood = false
var happiness = 5
var squeak = new Audio('squeeky.wav');
var longsqueak = new Audio('longsqueak.wav');
var click  = new Audio('click.wav');
var throwsfx = new Audio('land.wav');
var foodPos = {x: 0, y: 0, z: 0}
var tossing = false

function init(){
    console.log("game begin")
    sceneEl = document.querySelector('a-scene');
    dog = sceneEl.querySelector('#dog');
    food = sceneEl.querySelector('#food');
    food.setAttribute('visible', false)
    camera = sceneEl.querySelector('a-camera')
    ground = sceneEl.querySelector('a-sky')
    dogWrapper = sceneEl.querySelector('#dog-wrapper');
    loadDog()
    addBounceAnimation(dog)
    addJumpAnimation(dog)
    addSadAnimation(dog)
    dog.addEventListener('click', onclick);
    ground.addEventListener('click', tossFood);
    dogWrapper.addEventListener('animationcomplete__pos1_w', function (e) {
        isWalking = false
        if (targetingFood) {
            targetingFood = false
            foodOut = false
            food.setAttribute('visible', false)
        }
    });
    dog.addEventListener('animationcomplete__rot2_s', function (e) {
        isEmoting = false
    });
    dog.addEventListener('animationcomplete__pos2', function (e) {
        isEmoting = false
    });
    dog.addEventListener('animationcomplete__pos2_j', function (e) {
        isEmoting = false
    });

    setupClickable("Call", callDuck)
    setupClickable("Point", enableToss)

    isWalking = false
    dogwalk()
    setTimeout(loadTimeout, 5000);
}

function enableToss(){
    click.play();
    tossing = true;
}

function loadTimeout(){
    console.log("loadTimeout")
    isWalking = false
    dogwalk()
}

// happiness ranges from 0 to 10
function change_happiness(num) {
    happiness += num
    if (happiness > 10) {
        happiness = 10
    } else if (happiness < 0) {
        happiness = 0
    }
}

function setupClickable(id, func){
    var id = "#" + id
    document.querySelector(id).addEventListener('mouseenter', function(e){
        document.querySelector(id).setAttribute('color', 'yellow')
    })
    document.querySelector(id).addEventListener('mouseleave', function(e){
        document.querySelector(id).setAttribute('color', 'white')
    })
    document.querySelector(id).addEventListener('click', func)
}

function onclick() {
    loadDog();

    var camera_rotation = camera.getAttribute("rotation")
    var dog_rotation = dogWrapper.getAttribute("rotation")
    var newRot = (camera_rotation.x - dog_rotation.x) + " " +
        (camera_rotation.y - dog_rotation.y) + " " +
        ( camera_rotation.z - dog_rotation.z);

    if (!isEmoting) {


        if (happiness > 2) {
            squeak.play();
            if (Math.random() > 0.5) {
                dog.emit('bounce');
            }
            else {
                dog.emit('jump');
            }
            change_happiness(4)
        } else {
            longsqueak.play();
            dog.emit('sad')
            change_happiness(1.8)
        }
        isEmoting = true
    }
}

var nextTick = -1
function dogwalk(){
    if (!isWalking) {
        if (Math.random() > 0.25) {
            addRandomWalk(dogWrapper)
            dog.emit('walk')
            change_happiness(-0.8)
            isWalking = true
        }

        if (nextTick != -1)
            clearTimeout(nextTick)
    }
    // duck waits around longer when he's not happy
    nextTick = setTimeout(dogwalk, 1000 - happiness / 11);
}

function loadDog(){
    dog.setAttribute('scale', {x: .5, y: .5, z: .5}, true);
}

function addBounceAnimation(entity) {
    var dogScale = entity.getAttribute('scale');
    var dogScale2 = Object.assign({}, dogScale);
    dogScale2.y = 0.5 * 1.5
    dogScale2.x = 0.5 * 0.8
    dogScale2.z = 0.5 * 0.8
    var dogPos = entity.getAttribute('position');
    var dogPos2 = Object.assign({}, dogPos);
    dogPos2.y = dogPos2.y + 0.2;
    var len = 500

    entity.setAttribute('animation__scale1',{
        property:'scale',
        from: "0.5 0.5 0.5",
        to: vec3tostr(dogScale2),
        startEvents: 'bounce',
        dur: len
    })
    entity.setAttribute('animation__pos1',{
        property:'position',
        from: vec3tostr(dogPos),
        to: vec3tostr(dogPos2),
        startEvents: 'bounce',
        dur: len
    })
    entity.setAttribute('animation__scale2',{
        property:'scale',
        from: vec3tostr(dogScale2),
        to: "0.5 0.5 0.5",
        startEvents: 'bounce',
        delay: len,
        dur: len
    })
    entity.setAttribute('animation__pos2',{
        property:'position',
        from: vec3tostr(dogPos2),
        to: vec3tostr(dogPos),
        startEvents: 'bounce',
        delay: len,
        dur: len
    })
}

function callDuck() {
    click.play();
    var camPos = camera.getAttribute('position')
    foodPos = camPos
    console.log(foodPos)
    console.log(camPos)
    foodOut = true
    change_happiness(1)
    food.setAttribute('visible', false)
}


function addSadAnimation(entity) {
    var dogPos = entity.getAttribute('position')
    var dogPos2 = Object.assign({}, dogPos);
    var dogRot = entity.getAttribute('rotation')
    var dogRot2 = Object.assign({}, dogRot);
    var sadLen = 1000

    dogPos2.y -= 0.05
    dogRot2.z += -15

    var dogScale = entity.getAttribute('scale');
    var dogScale2 = Object.assign({}, dogScale);
    dogScale2.y = 0.5 * 0.8
    dogScale2.x = 0.5 * 1.2
    dogScale2.z = 0.5 * 1.2

    entity.setAttribute('animation__pos1_s',{
        property:'position',
        from: vec3tostr(dogPos),
        to: vec3tostr(dogPos2),
        startEvents: 'sad',
        dur: sadLen
    })

    entity.setAttribute('animation__pos2_s',{
        property:'position',
        from: vec3tostr(dogPos2),
        to: vec3tostr(dogPos),
        startEvents: 'sad',
        delay: sadLen,
        dur: sadLen
    })

    entity.setAttribute('animation__rot1_s', {
        property: 'rotation',
        from: vec3tostr(dogRot),
        to: vec3tostr(dogRot2),
        startEvents: 'sad',
        dur: sadLen
    })

    entity.setAttribute('animation__rot2_s', {
        property: 'rotation',
        from: vec3tostr(dogRot2),
        to: vec3tostr(dogRot),
        startEvents: 'sad',
        delay: sadLen * 2,
        dur: sadLen
    })

    entity.setAttribute('animation__scale1_s',{
        property:'scale',
        from: "0.5 0.5 0.5",
        to: vec3tostr(dogScale2),
        startEvents: 'sad',
        dur: sadLen
    })

    entity.setAttribute('animation__scale2_s',{
        property:'scale',
        from: vec3tostr(dogScale2),
        to: "0.5 0.5 0.5",
        startEvents: 'sad',
        delay: sadLen * 2,
        dur: sadLen
    })
}

function addJumpAnimation(entity) {
    var dogPos = entity.getAttribute('position')
    var dogPos2 = Object.assign({}, dogPos);
    var dogRot = entity.getAttribute('rotation')
    var dogRot2 = Object.assign({}, dogRot);
    var len = 140

    dogPos2.y += 1
    dogRot2.z += 20

    entity.setAttribute('animation__pos1_j',{
        property:'position',
        from: vec3tostr(dogPos),
        to: vec3tostr(dogPos2),
        startEvents: 'jump',
        dur: len
    })

    entity.setAttribute('animation__pos2_j',{
        property:'position',
        from: vec3tostr(dogPos2),
        to: vec3tostr(dogPos),
        startEvents: 'jump',
        delay: len,
        dur: len
    })

    entity.setAttribute('animation__rot1_j', {
        property: 'rotation',
        from: vec3tostr(dogRot),
        to: vec3tostr(dogRot2),
        startEvents: 'jump',
        dur: len
    })

    entity.setAttribute('animation__rot2_j', {
        property: 'rotation',
        from: vec3tostr(dogRot2),
        to: vec3tostr(dogRot),
        startEvents: 'jump',
        delay: len,
        dur: len
    })
}

function addRandomWalk(entity) {
    var dogPos = entity.getAttribute('position')
    var dogPos2 = Object.assign({}, dogPos);
    var camPos = camera.getAttribute('position')

    var dx = (Math.random() * 3) - 1.5
    var dz = (Math.random() * 3) - 1.5
    if (!foodOut) {
        dogPos2.x = camPos.x + dx
        dogPos2.z = camPos.z + dz
    } else {
        dogPos2.x = foodPos.x
        dogPos2.z = foodPos.z
        targetingFood = true
    }

    var dogRot = entity.getAttribute('rotation')
    var dogRot2 = Object.assign({}, dogPos);

    var rotation = Math.atan2(dogPos2.z - dogPos.z, dogPos2.x - dogPos.x)
    var speed = happiness / 5
    if (speed < 0.4)
        speed = 0.4

    var distance = Math.pow( Math.pow(dogPos2.z - dogPos.z, 2) +
                             Math.pow(dogPos2.x - dogPos.x, 2), 0.5)

    len = 400 * distance / speed
    dogRot2.x = 0
    dogRot2.y = dogRot2.y - (rotation * 180 / Math.PI)
    dogRot2.z = 0

    dogWrapper.setAttribute('animation__rot1_w',{
        property:'rotation',
        from: vec3tostr(dogRot),
        to: vec3tostr(dogRot2),
        startEvents: 'walk',
        dur: 300
    })

    entity.setAttribute('animation__pos1_w',{
        property:'position',
        from: vec3tostr(dogPos),
        to: vec3tostr(dogPos2),
        startEvents: 'walk',
        delay: 300,
        dur: len
    })
}

function tossFood() {
    if(tossing){
        camPos = camera.getAttribute('position')
        camRot = camera.getAttribute('rotation')
        if (-camRot.x < 85) {
            throwsfx.play();
            dist = camPos.y / Math.tan(d2r(-camRot.x))
            foodPos = { x: camPos.x + dist * Math.cos(d2r(camRot.y) + Math.PI/2),
                        y: 0,
                        z: camPos.z + dist * -Math.sin(d2r(camRot.y) + Math.PI/2)}
            foodOut = true

            food.setAttribute('position', foodPos, true)
            food.setAttribute('visible', true)
            tossing = false
        }
    }
}

function d2r(num) {
    return num / 180 * Math.PI
}

function vec3tostr(vec3){
    return vec3.x + " " + vec3.y + " " + vec3.z
}

window.addEventListener("keydown", function (event) {
    switch(event.key){
        case "r":
            dog.emit('bounce')
            break;
        case "j":
            dog.emit('jump')
            break;
        case "l":
            dog.emit('sad')
            break;
        case "t":
            tossFood()
            break;
        case "c":
            callDuck()
            dog.emit('bounce')
            break;
    }
})
