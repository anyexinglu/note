function* stateMachine() {
  let state = 'start';

  while (true) {
    switch (state) {
      case 'start':
        console.log('Enter start state');
        state = yield 'start';
        break;

      case 'middle':
        console.log('Enter middle state');
        state = yield 'middle';
        break;

      case 'end':
        console.log('Enter end state');
        state = yield 'end';
        break;
    }
  }
}

const sm = stateMachine();

console.log(sm.next().value); 
console.log(sm.next('middle').value); // 通过 state = yield 'start' 返回 start 并且 将 state 修改成了 middle
console.log(sm.next('end').value);