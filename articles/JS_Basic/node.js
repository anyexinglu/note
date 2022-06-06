function childNum(num, count){
    let allplayer = [];    
    for(let i = 0; i < num; i++){
        allplayer[i] = i + 1;
    }
    
    let exitCount = 0;    // 离开人数
    let counter = 0;      // 记录报数
    let curIndex = 0;     // 当前下标
    
    while(exitCount < num - 1){
        if(allplayer[curIndex] !== 0) counter++;    
        
        if(counter == count){
            allplayer[curIndex] = 0;                 
            counter = 0;
            exitCount++;  
        }
        curIndex++;
        if(curIndex == num){
            curIndex = 0               
        };           
    }    
    for(i = 0; i < num; i++){
        if(allplayer[i] !== 0){
            return allplayer[i]
        }      
    }
}
console.log(childNum(30, 3))

let arr = new Array(30).fill().map((_, index) => ({
    id: index,
    status: true,
    next: index + 1 >= 30 ? 0 : index + 1
}))
function roll() {
    let cur = 0
    let curItem = arr[0]
    while(arr.filter(item => item.status).length > 1) {
        if (curItem.status) {
            cur++
            if (cur === 3) {
               curItem.status = false
               cur = 0
            }
        }
        curItem = arr[curItem.next]
    }
    // 最后留下第 id + 1 个
    const final = arr.find(item => item.status)?.id + 1
    console.log('...final', final)
    return final
}
roll()
