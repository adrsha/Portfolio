var winwidth = window.innerWidth
var winheight = window.innerHeight
const cursor = document.querySelector('.mouse');
const overlay = document.querySelector('.overlay');
let loader = document.querySelectorAll('.loader');
let leftPosition = winwidth / 2;
let topPosition = winheight / 2;
let overlaySize = Math.round(Math.max(winheight, winwidth) * 0.9)
// scroll-controls

const rotator = document.querySelector('.scroll-counter>ol')
const counter = Array.from(document.querySelectorAll('.scroll-counter>ol>li'))
const secondhand = document.querySelector('.secondhand')
let amp = 100
var ang = new Array()
var noOfEls = counter.length

for (var i = 0; i < noOfEls; i++) {
    ang.push(0);
}

for (var i = 0; i < noOfEls; i++) {
    amp = 100
    counter[i].style.left = `${Math.cos(ang[i])*amp}%`
    counter[i].style.top = `${Math.sin(ang[i])*amp}%`
    counter[i].style.transform = `translate(70%, 90%) rotate(${ang[i]*180/Math.PI}deg)`

    ang[i + 1] = ang[i] + Math.PI / (noOfEls / 2)
}
var least = 1
scroll.on('scroll', (obj) => {

    // for(i=0;i<3;i++){
    // console.log(i+ "number: " + document.querySelectorAll('.section')[i].getBoundingClientRect().y)
    // }

    ang = obj.scroll.y / (winheight / (360 / noOfEls))
    rotator.style.transform = 'rotate(' + -ang + 'deg)'
    secondhand.style.transform = 'translate(0%, -50%) rotate(' + -ang % (360 / (noOfEls * 5)) + 'deg)'
})

//miscelleneous mouse actions

document.addEventListener('mousemove', (e) => {
    leftPosition = e.pageX;
    topPosition = e.pageY;

    cursor.style.left = leftPosition + 'px'
    cursor.style.top = topPosition + 'px'
    if (overlay.style.width != overlaySize + 'px') {
        overlay.style.left = leftPosition + 'px'
        overlay.style.top = topPosition + 'px'
    }
    if (e.target.classList.value.includes('hoverable')) {
        cursor.classList.add('mouse-hover')
    } else {
        cursor.classList.remove('mouse-hover')
    }
})

document.addEventListener('mousedown', (e) => {
    cursor.classList.add('mouse-click')
    
    setTimeout(() => {
        cursor.classList.remove('mouse-click')
    }, 1500);

})

document.addEventListener('dblclick', (e) => {
    if (overlay.style.width === overlaySize + 'px') {
        overlay.style.width = '0px'
        overlay.style.height = '0px'
        overlay.style.left = '50vw'
        overlay.style.top = '50vh'
    } else {
        overlay.style.width = overlaySize + 'px'
        overlay.style.height = overlaySize + 'px'
        overlay.style.left = '50vw'
        overlay.style.top = '50vh'
    }

})

//on click action
function changecss(val) {
    const link = document.getElementById('styles')
    link.setAttribute("href", 'css/style' + val + '.css')
}

//on load action
window.addEventListener('load', ()=>{
    setTimeout(() => {
        loader.forEach(e => {
            
            e.classList.add('loader-end')
        });
        
    }, 2000);
})