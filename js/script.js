var winwidth = window.innerWidth 
var winheight = window.innerHeight 
const cursor = document.querySelector('.mouse');
const overlay = document.querySelector('.overlay');
const imgp = document.querySelector('div.showcase>img');

// scroll-controls

const rotator = document.querySelector('.scroll-counter>ul')
const counter = Array.from(document.querySelectorAll('.scroll-counter>ul>li'))
let amp = 200
var ang = 0
var noOfEls = 4

for(var i=0;i<4; i++){
    counter[i].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp}%) rotate(${ang*(180/Math.PI)}deg)`;
    ang = ang +  Math.PI/(noOfEls/2)
}
var ang = 0

scroll.on('scroll', (obj)=>{
    console.log(winheight);
    ang=obj.scroll.y/(winheight/90)
    rotator.style.transform = 'rotate('+-ang+'deg)'
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

    if(e.target == imgp){
        imgp.parentElement.focus()
    }
})

document.addEventListener('dblclick', (e)=>{
    console.log(overlay.style.width)
    if (overlay.style.width === '100vw')
    {
        overlay.style.width = '0vw'
    }else{
        overlay.style.width = '100vw'
    }
    
})