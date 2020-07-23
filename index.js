 const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d'); 
canvas.width = 500;
canvas.height = 500;
let cols ,rows;

var w  =20;
let grid=[]
let stack = [];
let finalStack =[]
let speed = 20;

  
// all event listeners  
const clearGridButton = document.getElementById('clearGrid')
const createPathButton= document.getElementById('createPath')
const createGridButton= document.getElementById('createGrid')
const  scrollSpeed = document.getElementById("scrollSpeed"); 
const  scrollSize = document.getElementById("scrollSize"); 
scrollSpeed.oninput = function() {
  speed = this.value;
}
// scrollSize.oninput = function() {
//     w = this.value;
//     setup();
//   }
clearGridButton.addEventListener('click' , function(){
    setup()
}) 
createGridButton.addEventListener('click',function(){
    createGridButton.setAttribute('disabled' , 'disabled');
    createPathButton.setAttribute('disabled' , 'disabled');
    
    let timer  =  setInterval(() => {
         draw()
    }, 1/speed);
 }) 
 createPathButton.addEventListener('click',function(){
     console.log(finalStack)
  animatePath(finalStack)
 })  

// outer component functions 
function drawLine(x,y,a,b){
    context.beginPath();
    context.lineWidth=2; 
    context.strokeStyle = 'white';
    context.moveTo(x, y);
    context.lineTo(a, b);
    context.stroke();  
    context.closePath()
}
function index(i,j){
    if(i<0 ||j<0 || i>=cols || j>=rows ){return -1;}
    return i+j*cols;
}
function removeWalls(current ,next){
    let e = current.x-next.x;
    if(e ===  -1){
        current.walls[1] = false;
        next.walls[3] = false;
    }
    else if(e==1){
        current.walls[3] = false;
        next.walls[1] = false;
    }
      e = current.y-next.y;
     if(e ===  -1){
        current.walls[2] = false;
        next.walls[0] = false;
    }
    else if(e==1){
        current.walls[0] = false;
        next.walls[2] = false;
    }
}

// animating the path
function animatePath(stacks){
     let index = 0;
    context.beginPath();
context.moveTo(w/2,w/2);
    let animate = setInterval(() => {
             context.strokeStyle = 'yellow'
           context.lineWidth = w/3;
           context.lineTo(stacks[index].x*w+w/2 ,stacks[index].y*w+w/2 )
           context.stroke()
             index++;
            if(index>=stacks.length){ context.closePath() ;
                    for(let i=0;i<10000;i++){
                         clearInterval(animate)
                    }
            }
    
    },100/speed);

}

 

 
function Cell(x,y  ){
    this.x = x;
    this.y = y;
    this.walls =[true ,true ,true ,true ];
    this.visited = false;
    this.highlight = function(){
        let x = this.x*w;
        let y = this.y*w;
        context.fillStyle='white';
        context.fillRect(x+5 , y+5 ,w-10 ,w-10);
         context.fill(); 
    }
    this.checkNeighbours = function(){
        let neighbours = [];
        let top = grid[index(this.x,this.y-1)];
        let right = grid[index(this.x+1,this.y)];
        let bottom = grid[index(this.x,this.y+1)];
        let left = grid[index(this.x-1,this.y)];
        if( top && !top.visited){neighbours.push(top);}
        if( right && !right.visited){neighbours.push(right);}
        if( bottom && !bottom.visited){neighbours.push(bottom);}
        if( left && !left.visited){neighbours.push(left);}
        if(neighbours.length>0){
            let r = Math.floor( Math.random()*neighbours.length)
         //   console.log('for the point ', this.x , this.y ,'->' , Math.random()*neighbours.length);

            return neighbours[r]; 
        }

    }
    this.show=function(){
        let x = this.x*w;
        let y = this.y*w;
        if(this.visited){
            context.fillStyle='red';
            context.fillRect(x , y ,w ,w);
               context.fill(); 
       }
        if(this.walls[0]){
            drawLine(x,y,x+w,y); 
        }
        if(this.walls[1]){
            drawLine(x+w,y,x+w,y+w);
        }
        if(this.walls[2]){
            drawLine(x,y+w,x+w,y+w);
        }
        if(this.walls[3]){
            drawLine(x,y,x,y+w);
        }
         
    }

}
 
let current;
function setup(){
    current = null;
    stack = []
    grid = [] 
    createGridButton.removeAttribute('disabled')
    createPathButton.removeAttribute('disabled')
    context.clearRect(0,0,canvas.width , canvas.height);
    for(let i=0;i<10000;i++){
        clearInterval(i)
   } 
    rows = Math.floor(canvas.height/w);
    cols = Math.floor(canvas.width/w);
    for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
            let cell = new Cell(x,y);
            grid.push(cell);
            cell.show()
        }
    }
     current = grid[0];

}


function draw(){
    for(let i=0;i<grid.length ;i++){
        grid[i].show();
    }
    current.highlight() ; 
    current.visited = true;
    let next = current.checkNeighbours()
    rows = Math.floor(canvas.height/w);
    cols = Math.floor(canvas.width/w);


        // on reaching the destination 
        if(current.x ==cols-1 && current.y ==rows-1){
            // to print the elements in stack to get the coorect path
            finalStack = []
              for(let i=0;i<stack.length;i++){
                 // console.log(stack[i].x , stack[i].y)
                  finalStack.push(stack[i])
              }
               
               //console.log(finalStack)
               
            //   for(let i=0;i<10000;i++){
            //       window.clearInterval(i)
            //   }
           // animatePath(stack)
             // return;
        }  
  
    if( next ){ 
            next.visited = true;
            stack.push(next); 
            removeWalls(current , next); 
            current =  next; 
    }
      else if( !next && stack.length>0){
        current = stack.pop();
    }
    else{
        for(let i=0;i<10000;i++){
            window.clearInterval(i)
        }
        createPathButton.removeAttribute('disabled')

    }
 

}






// for initializing the program
setup()



 