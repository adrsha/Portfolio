
const cursor = document.querySelector('.mouse');
const overlay = document.querySelector('.overlay');

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
    }, 500);
})

document.addEventListener('dblclick', (e)=>{
    if (overlay.style.backgroundColor == 'rgb(242, 220, 194)')
    {
        overlay.style.backgroundColor = 'transparent'
    }
    else{
        overlay.style.backgroundColor = '#F2DCC2'
    }
})

// scroll-controls

const counter = Array.from(document.querySelectorAll('.scroll-counter>ul>li'))
console.log(counter[1])
let amp = 300
let ang = 3* Math.PI/2
counter[0].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;
ang = 0
counter[1].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;
ang =  Math.PI/2
counter[2].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;
ang =  Math.PI
counter[3].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;