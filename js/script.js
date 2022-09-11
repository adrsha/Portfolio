var winwidth = window.innerWidth 
var winheight = window.innerHeight 
const cursor = document.querySelector('.mouse');
const overlay = document.querySelector('.overlay');

// scroll-controls

const rotator = document.querySelector('.scroll-counter>ul')
const counter = Array.from(document.querySelectorAll('.scroll-counter>ul>li'))
const secondhand= document.querySelector('.secondhand')
let amp = 100
var ang = new Array()
var noOfEls = counter.length

for(var i=0;i<noOfEls; i++){
    ang.push(0);
}

for(var i=0;i<noOfEls; i++){
    amp = 100
    counter[i].style.left = `${Math.cos(ang[i])*amp}%`
    counter[i].style.top = `${Math.sin(ang[i])*amp}%`
    counter[i].style.transform = `translate(70%, 90%) rotate(${ang[i]*180/Math.PI}deg)`
    
    ang[i+1] = ang[i] +  Math.PI/(noOfEls/2)
}
var least = 1
scroll.on('scroll', (obj)=>{
    rotator.style.transform = 'rotate('+-ang+'deg)'
    ang=obj.scroll.y/(winheight/(360/noOfEls))
    console.log(secondhand)
    secondhand.style.transform = 'translate(0%, -50%) rotate('+-ang%(360/(noOfEls*5))+'deg)'
})

//miscelleneous

document.addEventListener('mousemove',(e)=>{
    let leftPosition = e.pageX; 
    let topPosition = e.pageY;

    cursor.style.left = leftPosition + 'px'
    cursor.style.top = topPosition + 'px'

   if(e.target.classList.value.includes('hoverable') ){
    cursor.classList.add('mouse-hover')
    }else{
        cursor.classList.remove('mouse-hover')
   }
})

document.addEventListener('mousedown', (e)=>{
    cursor.classList.add('mouse-click')

    setTimeout(() => {
    cursor.classList.remove('mouse-click')
    }, 1500);

})

document.addEventListener('dblclick', (e)=>{
    if (overlay.style.width === '100vw')
    {
        overlay.style.width = '0vw'
    }else{
        overlay.style.width = '100vw'
    }
    
})
