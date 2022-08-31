
const cursor = document.querySelector('.mouse');
const overlay = document.querySelector('.overlay');
const imgp = document.querySelector('div.showcase>img');

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
        console.log(imgp.parentElement)
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

// scroll-controls

const counter = Array.from(document.querySelectorAll('.scroll-counter>ul>li'))
let amp = 300
let ang = 3* Math.PI/2
counter[0].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;
ang = 0
counter[1].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;
ang =  Math.PI/2
counter[2].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;
ang =  Math.PI
counter[3].style.transform = `translate(${Math.cos(ang)*amp}%, ${Math.sin(ang)*amp-50}%)`;

