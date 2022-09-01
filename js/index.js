const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier:0.5,
    firefoxMultiplier: 25,
    mobile: {
      breakpoint:0,
      smooth: true
    },
    tablet: {
      breakpoint:0,
      smooth: true
    },
    lerp: 0.07,
  });

const projectLink =  document.querySelector('.project-a');
const scrollDown =  document.querySelector('span.scroll-down');
const projectDestination =  document.querySelector('.projects');

document.addEventListener('click', (e)=>{
  if (e.target == projectLink || e.target == scrollDown){
    console.log("This worked");
    scroll.scrollTo(projectDestination);
  }
})