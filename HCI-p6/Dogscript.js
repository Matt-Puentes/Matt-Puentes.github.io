var sceneEl;
var dog;
var dogWrapper;
function main(){
    console.log("Game begin!")
    sceneEl = document.querySelector('a-scene');
    dog = sceneEl.querySelector('#dog');
    dogWrapper = sceneEl.querySelector('#dog-wrapper');

    loadDog()
    addBounceAnimation(dog)
    addJumpAnimation(dog)
    addSadAnimation(dog)

    dog.addEventListener('click', onclick);

    dogwalk()
}

function onclick() {
    loadDog();
    if(Math.random() > 0.5){
        dog.emit('bounce');
    }
    else{
        dog.emit('jump');
    }
}

var nextTick = -1
function dogwalk(){
    if(Math.random() > 0.5){
        addRandomWalk(dogWrapper)
        dog.emit('walk')
    }
    if(nextTick != -1)
        clearTimeout(nextTick)
    nextTick = setTimeout(dogwalk, 2000);
}


function loadDog(){
    console.log("load")
    // dog.setAttribute('scale', {x: .25, y: .25, z: .25}, true);
    dog.setAttribute('scale', {x: .5, y: .5, z: .5}, true);
    // dogWrapper.setAttribute('scale', {x: 1, y: 1, z: 1}, true);
}

function addBounceAnimation(entity) {
    var dogScale = entity.getAttribute('scale');
    var dogScale2 = Object.assign({}, dogScale);
    dogScale2.y = 0.5 * 1.5
    dogScale2.x = 0.5 * 0.8
    dogScale2.z = 0.5 * 0.8
    var dogPos = entity.getAttribute('position');
    var dogPos2 = Object.assign({}, dogPos);
    dogPos2.y = dogPos2.y + 0.2//(entity.getAttribute('geometry').height * 0.5)
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
    console.log(dogScale)
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
    dogScale2.y = dogScale2.y * 0.8
    dogScale2.x = dogScale2.x * 1.2
    dogScale2.z = dogScale2.z * 1.2

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
        from: vec3tostr(dogScale),
        to: vec3tostr(dogScale2),
        startEvents: 'sad',
        dur: sadLen
    })

    entity.setAttribute('animation__scale2_s',{
        property:'scale',
        from: vec3tostr(dogScale2),
        to: vec3tostr(dogScale),
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


    len = 1000;
    var dx = (Math.random() * 3) - 1.5
    var dz = (Math.random() * 3) - 1.5
    dogPos2.x += dx
    dogPos2.z += dz

    var dogRot = entity.getAttribute('position')
    var dogRot2 = Object.assign({}, dogPos);

    var rotation = Math.atan2(dz,dx)
    console.log(rotation)
    dogRot2.y = dogRot2.y - (rotation * 180 / Math.PI)

    dogWrapper.setAttribute('animation__rot1',{
        property:'rotation',
        from: vec3tostr(dogRot),
        to: vec3tostr(dogRot2),
        startEvents: 'walk',
        dur: 300
    })

    entity.setAttribute('animation__pos1',{
        property:'position',
        from: vec3tostr(dogPos),
        to: vec3tostr(dogPos2),
        startEvents: 'walk',
        delay: 300,
        dur: len
    })

}

function vec3tostr(vec3){
    return vec3.x + " " + vec3.y + " " + vec3.z
}

window.addEventListener("keydown", function (event) {
	if(event.key == "r"){
        console.log("bounce")
        dog.emit('bounce')
    }

	if(event.key == "j"){
        console.log("jump")
        dog.emit('jump')
    }

	if(event.key == "l"){
        //addRandomWalk(dog)
        console.log("sad")
        dog.emit('sad')
    }
})
